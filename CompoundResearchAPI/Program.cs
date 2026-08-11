using System.Text;
using CompoundResearchAPI.Data;
using CompoundResearchAPI.Data.Seed;
using CompoundResearchAPI.Middleware;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Repositories.Implementations;
using CompoundResearchAPI.Repositories.Interfaces;
using CompoundResearchAPI.Services.Implementations;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ---------- Serilog ----------
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Host.UseSerilog();

// ---------- EF Core / SQL Server ----------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---------- ASP.NET Core Identity ----------
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ---------- JWT Authentication ----------
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!))
        };
    });

builder.Services.AddAuthorization();

// ---------- Controllers + Swagger ----------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Compound Research Assistant API",
        Version = "v1",
        Description = "REST API for managing compound records, reference documents, and RAG-based research Q&A."
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(document =>
    {
        var schemeRef = new OpenApiSecuritySchemeReference("Bearer", document);
        return new OpenApiSecurityRequirement { [schemeRef] = new List<string>() };
    });
});

// ---------- CORS (adjust origins for your frontend) ----------
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// ---------- Dependency Injection: Repositories ----------
builder.Services.AddScoped<ICompoundRepository, CompoundRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IChunkRepository, ChunkRepository>();

// ---------- Dependency Injection: Services ----------
builder.Services.AddScoped<ICompoundService, CompoundService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRagService, RagService>();
builder.Services.AddHttpClient<IEmbeddingService, EmbeddingService>();
builder.Services.AddHttpClient<IRagService, RagService>();

var app = builder.Build();

// ---------- Seed database (Development only) ----------
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    await context.Database.MigrateAsync();
    await DbSeeder.SeedAsync(context, roleManager, userManager);
}

// ---------- Middleware pipeline ----------
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

//app.UseHttpsRedirection();
app.UseCors("DefaultPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Exposed for WebApplicationFactory-based integration tests.
public partial class Program { }
