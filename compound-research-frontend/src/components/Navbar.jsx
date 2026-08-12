import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/molequery_icon.svg";

function Navbar() {
  const { user } = useAuth();

  const getInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  const getRoleLabel = () => {
    if (user?.role === "Administrator") {
      return "Administrator";
    }

    if (user?.role === "Reviewer") {
      return "Reviewer";
    }

    return "Research User";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e5eaf1",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* ================================
            BRAND
        ================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="MoleQuery"
            sx={{
              width: 42,
              height: 42,
              objectFit: "contain",
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "1.05rem",
                  sm: "1.2rem",
                },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              MoleQuery
            </Typography>

            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "#64748b",
                letterSpacing: "0.02em",
                mt: 0.3,
              }}
            >
              Research Knowledge Platform
            </Typography>
          </Box>
        </Box>

        {/* ================================
            USER AREA
        ================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1,
              sm: 1.5,
            },
          }}
        >
          {/* Role badge */}

          {user?.role && (
            <Chip
              label={getRoleLabel()}
              size="small"
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                height: 28,
                borderRadius: "7px",
                fontSize: "0.72rem",
                fontWeight: 600,

                color:
                  user.role === "Administrator"
                    ? "#155eef"
                    : user.role === "Reviewer"
                    ? "#475467"
                    : "#175cd3",

                backgroundColor:
                  user.role === "Administrator"
                    ? "#eff6ff"
                    : user.role === "Reviewer"
                    ? "#f8fafc"
                    : "#f0f7ff",

                border:
                  user.role === "Administrator"
                    ? "1px solid #d1e0ff"
                    : "1px solid #e2e8f0",
              }}
            />
          )}

          {/* Divider */}

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: 32,
              alignSelf: "center",
              display: {
                xs: "none",
                sm: "block",
              },
              borderColor: "#e2e8f0",
            }}
          />

          {/* User details */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              textAlign: "right",
              mr: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#1e293b",
                lineHeight: 1.3,
              }}
            >
              {user?.fullName || "Researcher"}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#64748b",
                lineHeight: 1.3,
                mt: 0.2,
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || ""}
            </Typography>
          </Box>

          {/* Avatar */}

          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: "0.9rem",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow:
                "0 3px 10px rgba(37, 99, 235, 0.25)",
              border: "2px solid #ffffff",
            }}
          >
            {getInitial()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;