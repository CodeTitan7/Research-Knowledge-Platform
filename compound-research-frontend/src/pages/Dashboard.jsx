import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/Science";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import { dashboardService } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await dashboardService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Compounds",
      value: stats?.compounds ?? 0,
      icon: <ScienceIcon />,
    },
    {
      title: "Targets",
      value: stats?.targets ?? 0,
      icon: <TrackChangesIcon />,
    },
    {
      title: "Documents",
      value: stats?.documents ?? 0,
      icon: <DescriptionIcon />,
    },
    {
      title: "Queries",
      value: stats?.queries ?? 0,
      icon: <QuestionAnswerIcon />,
    },
  ];

  return (
    <Box>
      {/* Page heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Welcome back. Explore compounds, research documents, and AI insights.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistics */}
          <Grid
            container
            spacing={3}
            sx={{ mb: 4 }}
          >
            {statCards.map((stat) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={stat.title}
              >
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {stat.title}
                        </Typography>

                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          sx={{ mt: 1 }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          color: "primary.main",
                          display: "flex",
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent compounds */}
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                Recent Compounds
              </Typography>

              {(!stats?.recentCompounds || stats.recentCompounds.length === 0) ? (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No recent compounds recorded.
                </Typography>
              ) : (
                stats.recentCompounds.map((compound) => (
                  <Box
                    key={compound.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 2,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold">
                        {compound.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {compound.identifier}
                      </Typography>
                    </Box>

                    <Typography variant="body2">
                      Target: {compound.target}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Category: {compound.category}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}

export default Dashboard;