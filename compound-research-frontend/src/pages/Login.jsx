import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MoleQueryLogo from "../assets/molequery_icon.svg";
import loginVideo from "../assets/login-background.mp4";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@compoundresearch.local");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const demoAccounts = [
    {
      label: "Admin",
      email: "admin@compoundresearch.local",
      pass: "Admin@12345",
      color: "primary",
    },
    {
      label: "Reviewer",
      email: "reviewer@compoundresearch.local",
      pass: "Reviewer@12345",
      color: "secondary",
    },
    {
      label: "Researcher",
      email: "researcher@compoundresearch.local",
      pass: "Researcher@12345",
      color: "info",
    },
  ];

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both Email and Password.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await login(email, password);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Invalid credentials or login server offline."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
        px: { xs: 2, md: 5 },
        py: 4,
      }}
    >
      {/* Main Login Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          minHeight: { xs: "auto", md: 680 },
          display: "flex",
          alignItems: "stretch",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
          backgroundColor: "white",
        }}
      >
        {/* =========================================================
            LEFT SIDE - BRANDING / FUTURE VIDEO
            ========================================================= */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 680,
            background:
              "linear-gradient(135deg, #0d47a1 0%, #1976d2 55%, #42a5f5 100%)",
          }}
        >
          {

              <Box
                component="video"
                src={loginVideo}
                autoPlay
                muted
                loop
                playsInline
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              />

          }

          {/* Dark overlay for future video */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(13, 71, 161, 0.9), rgba(25, 118, 210, 0.65))",
              zIndex: 1,
            }}
          />

          {/* Left side content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              color: "white",
              textAlign: "center",
              px: 6,
              maxWidth: 500,
            }}
          >
            <Box
              component="img"
              src={MoleQueryLogo}
              alt="MoleQuery"
              sx={{
                width: 130,
                height: 130,
                objectFit: "contain",
                mb: 3,
                filter: "brightness(0) invert(1)",
              }}
            />

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 2,
                letterSpacing: "-1px",
              }}
            >
              MoleQuery
            </Typography>

            <Typography
              variant="h6"
              fontWeight="normal"
              sx={{
                opacity: 0.95,
                mb: 2,
                lineHeight: 1.5,
              }}
            >
              Research Knowledge & Discovery Platform
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                lineHeight: 1.8,
              }}
            >
              Explore compounds, discover research evidence,
              and generate AI-assisted insights from your
              controlled knowledge base.
            </Typography>
          </Box>
        </Box>

        {/* =========================================================
            RIGHT SIDE - LOGIN
            ========================================================= */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: 500,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            p: {
              xs: 3,
              sm: 5,
            },
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 3,
              backgroundColor: "transparent",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Logo */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={MoleQueryLogo}
                  alt="MoleQuery"
                  sx={{
                    width: 75,
                    height: 75,
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Heading */}
              <Box
                sx={{
                  textAlign: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    color: "text.primary",
                  }}
                >
                  Welcome Back
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Sign in to continue to MoleQuery
                </Typography>
              </Box>

              {/* Error */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* =====================================================
                  LOGIN FORM
                  ===================================================== */}
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="email"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Register */}
              <Box
                sx={{
                  mt: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Don't have an account?{" "}
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={() => navigate("/register")}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Register here
                  </Button>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* =====================================================
                  DEMO ACCOUNTS
                  ===================================================== */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1.5,
                  }}
                >
                  Quick Demo Login
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {demoAccounts.map((acc) => (
                    <Chip
                      key={acc.label}
                      label={acc.label}
                      color={acc.color}
                      variant={
                        email === acc.email
                          ? "filled"
                          : "outlined"
                      }
                      size="small"
                      onClick={() =>
                        handleQuickFill(
                          acc.email,
                          acc.pass
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        fontWeight: "medium",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Small branding */}
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 4,
                }}
              >
                MoleQuery Research Platform
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;