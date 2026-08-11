import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/Science";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Temporary mock login
    navigate("/dashboard");
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
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* Logo and title */}
          <Box
            sx={{
              textAlign: "center",
              marginBottom: 4,
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
              Research Knowledge & Discovery
            </Typography>
          </Box>

          {/* Login form */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{
              marginTop: 3,
              padding: 1.5,
              borderRadius: 2,
            }}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;