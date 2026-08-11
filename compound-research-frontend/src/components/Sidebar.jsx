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

import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Sidebar() {
  const navigate = useNavigate();

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
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          paddingX: 2,
        }}
      >
        <ScienceIcon
          color="primary"
          sx={{ marginRight: 1 }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Compound Research
        </Typography>
      </Box>

      <Divider />

      {/* Main menu */}
      <List sx={{ padding: 1 }}>
        {mainMenuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 2,
                marginBottom: 0.5,
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Administration */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          paddingX: 2,
          paddingTop: 2,
          paddingBottom: 1,
        }}
      >
        ADMINISTRATION
      </Typography>

      <List sx={{ padding: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/users"
            sx={{
              borderRadius: 2,
            }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>

            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Logout at bottom */}
      <Box sx={{ marginTop: "auto", padding: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
}

export default Sidebar;