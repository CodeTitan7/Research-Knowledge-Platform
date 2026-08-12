import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import DescriptionIcon from "@mui/icons-material/Description";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 250;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userRole } = useAuth();

  const mainMenuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Compounds",
      icon: <ScienceIcon />,
      path: "/compounds",
    },
    {
      text: "Documents",
      icon: <DescriptionIcon />,
      path: "/documents",
    },
    {
      text: "Research AI",
      icon: <SmartToyIcon />,
      path: "/research",
    },
    {
      text: "Query History",
      icon: <HistoryIcon />,
      path: "/history",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #E5EAF2",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          px: 2.5,
          borderBottom: "1px solid #E5EAF2",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            MoleQuery
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              color: "#7A8799",
              mt: 0.3,
              letterSpacing: "0.2px",
            }}
          >
            Research Knowledge Platform
          </Typography>
        </Box>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ px: 1.5, pt: 2 }}>
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            fontSize: "10px",
            fontWeight: 700,
            color: "#94A3B8",
            letterSpacing: "1.1px",
            textTransform: "uppercase",
          }}
        >
          Workspace
        </Typography>

        <List disablePadding>
          {mainMenuItems.map((item) => {
            const selected = location.pathname.startsWith(item.path);

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selected}
                  sx={{
                    minHeight: 46,
                    px: 1.5,
                    borderRadius: 2,

                    position: "relative",

                    color: selected ? "#2563EB" : "#475569",

                    transition: "all 0.2s ease",

                    "& .MuiListItemIcon-root": {
                      minWidth: 38,
                      color: selected ? "#2563EB" : "#64748B",
                      transition: "color 0.2s ease",
                    },

                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: selected ? 600 : 500,
                    },

                    "&:hover": {
                      backgroundColor: "#F1F6FF",
                      color: "#2563EB",

                      "& .MuiListItemIcon-root": {
                        color: "#2563EB",
                      },
                    },

                    "&.Mui-selected": {
                      backgroundColor: "#EFF6FF",
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "#E8F1FF",
                    },

                    // Active blue indicator
                    "&::before": selected
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "9px",
                          bottom: "9px",
                          width: "3px",
                          borderRadius: "0 4px 4px 0",
                          backgroundColor: "#2563EB",
                        }
                      : {},
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Administration */}
      {userRole === "Administrator" && (
        <>
          <Divider
            sx={{
              mx: 2,
              my: 2,
              borderColor: "#E5EAF2",
            }}
          />

          <Box sx={{ px: 1.5 }}>
            <Typography
              sx={{
                px: 1.5,
                mb: 1,
                fontSize: "10px",
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "1.1px",
                textTransform: "uppercase",
              }}
            >
              Administration
            </Typography>

            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/users"
                  selected={location.pathname === "/users"}
                  sx={{
                    minHeight: 46,
                    px: 1.5,
                    borderRadius: 2,
                    position: "relative",

                    color:
                      location.pathname === "/users"
                        ? "#2563EB"
                        : "#475569",

                    "& .MuiListItemIcon-root": {
                      minWidth: 38,
                      color:
                        location.pathname === "/users"
                          ? "#2563EB"
                          : "#64748B",
                    },

                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight:
                        location.pathname === "/users" ? 600 : 500,
                    },

                    "&:hover": {
                      backgroundColor: "#F1F6FF",
                      color: "#2563EB",

                      "& .MuiListItemIcon-root": {
                        color: "#2563EB",
                      },
                    },

                    "&.Mui-selected": {
                      backgroundColor: "#EFF6FF",
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "#E8F1FF",
                    },

                    "&::before":
                      location.pathname === "/users"
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "9px",
                            bottom: "9px",
                            width: "3px",
                            borderRadius: "0 4px 4px 0",
                            backgroundColor: "#2563EB",
                          }
                        : {},
                  }}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>

                  <ListItemText primary="User Management" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </>
      )}

      {/* Bottom area */}
      <Box sx={{ mt: "auto" }}>
        <Divider
          sx={{
            mx: 2,
            borderColor: "#E5EAF2",
          }}
        />

        <Box sx={{ p: 1.5 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 46,
                px: 1.5,
                borderRadius: 2,
                color: "#64748B",

                "& .MuiListItemIcon-root": {
                  minWidth: 38,
                  color: "#64748B",
                },

                "& .MuiListItemText-primary": {
                  fontSize: "14px",
                  fontWeight: 500,
                },

                "&:hover": {
                  backgroundColor: "#FFF5F5",
                  color: "#DC2626",

                  "& .MuiListItemIcon-root": {
                    color: "#DC2626",
                  },
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;