import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  Chip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Research Knowledge Platform
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {user?.role && (
            <Chip
              label={user.role}
              size="small"
              color={
                user.role === "Administrator"
                  ? "primary"
                  : user.role === "Reviewer"
                  ? "secondary"
                  : "info"
              }
              variant="outlined"
            />
          )}

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
            }}
          >
            {getInitial()}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" fontWeight="bold">
              {user?.fullName || "Researcher"}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;