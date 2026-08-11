using System.Net;
using System.Text.Json;
using CompoundResearchAPI.Helpers;

namespace CompoundResearchAPI.Middleware
{
    // Catches unhandled exceptions and converts them into a consistent ApiResponse envelope,
    // instead of leaking stack traces to API consumers.
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception processing {Method} {Path}", context.Request.Method, context.Request.Path);

                var (statusCode, message) = ex switch
                {
                    KeyNotFoundException => (HttpStatusCode.NotFound, ex.Message),
                    UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ex.Message),
                    InvalidOperationException => (HttpStatusCode.BadRequest, ex.Message),
                    ArgumentException => (HttpStatusCode.BadRequest, ex.Message),
                    _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.")
                };

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)statusCode;

                var response = ApiResponse<object>.FailureResponse(message);
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }
}
