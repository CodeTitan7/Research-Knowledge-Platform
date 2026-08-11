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
import ScienceIcon from "@mui/icons-material/Science";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@compoundresearch.local");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const demoAccounts = [
    { label: "Admin", email: "admin@compoundresearch.local", pass: "Admin@12345", color: "primary" },
    { label: "Reviewer", email: "reviewer@compoundresearch.local", pass: "Reviewer@12345", color: "secondary" },
    { label: "Researcher", email: "researcher@compoundresearch.local", pass: "Researcher@12345", color: "info" },
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
      setError(err.message || "Invalid credentials or login server offline.");
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
        backgroundColor: "background.default",
        padding: 2,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* Logo and title */}
          <Box
            sx={{
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            <ScienceIcon
              sx={{
                fontSize: 55,
                color: "primary.main",
                marginBottom: 1,
              }}
            />

            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
            >
              Compound Research
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Research Knowledge & Discovery Platform
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
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
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                marginTop: 3,
                padding: 1.5,
                borderRadius: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

          {/* Navigation to Register */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => navigate("/register")}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Register here
              </Button>
            </Typography>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Demo Accounts Quick Selector */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Quick Demo Login Accounts:
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
              {demoAccounts.map((acc) => (
                <Chip
                  key={acc.label}
                  label={acc.label}
                  color={acc.color}
                  variant={email === acc.email ? "filled" : "outlined"}
                  size="small"
                  onClick={() => handleQuickFill(acc.email, acc.pass)}
                  sx={{ cursor: "pointer", fontWeight: "medium" }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;