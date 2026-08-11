import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";

function Navbar() {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
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
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
            }}
          >
            R
          </Avatar>

          <Typography variant="body2">
            Researcher
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;