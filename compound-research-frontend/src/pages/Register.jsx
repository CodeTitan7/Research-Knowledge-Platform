import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import SecurityIcon from "@mui/icons-material/Security";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MoleQueryLogo from "../assets/molequery_icon.svg";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      if (res.success) {
        setSuccess(
          "Account registered successfully! Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Registration failed. Email may already be registered."
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
      {/* =========================================================
          MAIN CONTAINER
          ========================================================= */}
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
            LEFT SIDE - MOLEQUERY BRANDING
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
          {/* Decorative background circles */}
          <Box
            sx={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.06)",
              top: -150,
              left: -150,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 350,
              height: 350,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
              bottom: -130,
              right: -100,
            }}
          />

          {/* Branding content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              color: "white",
              textAlign: "center",
              px: 6,
              maxWidth: 520,
            }}
          >
            {/* Logo */}
            <Box
              component="img"
              src={MoleQueryLogo}
              alt="MoleQuery"
              sx={{
                width: 125,
                height: 125,
                objectFit: "contain",
                mb: 2,
                filter: "brightness(0) invert(1)",
              }}
            />

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 1.5,
                letterSpacing: "-1px",
              }}
            >
              MoleQuery
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                opacity: 0.95,
                mb: 4,
              }}
            >
              Research Knowledge & Discovery Platform
            </Typography>

            {/* Feature highlights */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                textAlign: "left",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <ScienceIcon />

                <Box>
                  <Typography fontWeight="bold">
                    Explore Compounds
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8 }}
                  >
                    Organize and discover compound information.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <AutoGraphIcon />

                <Box>
                  <Typography fontWeight="bold">
                    Research Insights
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8 }}
                  >
                    Discover relationships across research evidence.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <MenuBookIcon />

                <Box>
                  <Typography fontWeight="bold">
                    Evidence-Based Research
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8 }}
                  >
                    Work with information from your controlled knowledge base.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* =========================================================
            RIGHT SIDE - REGISTRATION FORM
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
                    width: 70,
                    height: 70,
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Heading */}
              <Box
                sx={{
                  textAlign: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Create Account
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Join MoleQuery and start exploring research
                  knowledge.
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

              {/* Success */}
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  {success}
                </Alert>
              )}

              {/* =====================================================
                  REGISTRATION FORM
                  ===================================================== */}
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="Full Name"
                  type="text"
                  margin="normal"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  autoComplete="name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="e.g. jane.doe@example.com"
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
                  helperText="Minimum 6 characters (Please include a capital letter and a special symbol) "
                  autoComplete="new-password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Register button */}
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
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Login navigation */}
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
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={() => navigate("/")}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Log In
                  </Button>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Security information */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  color: "text.secondary",
                }}
              >
                <SecurityIcon
                  sx={{
                    fontSize: 18,
                    color: "primary.main",
                  }}
                />

                <Typography variant="caption">
                  Your research workspace is protected
                </Typography>
              </Box>

              {/* Footer */}
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 2,
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

export default Register;