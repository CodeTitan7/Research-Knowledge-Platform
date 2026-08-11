import {
  Box,
  Toolbar,
} from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;