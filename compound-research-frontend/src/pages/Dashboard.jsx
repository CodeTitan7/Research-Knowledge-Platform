import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Typography,
  Divider,
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/Science";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BiotechIcon from "@mui/icons-material/Biotech";

import { useNavigate } from "react-router-dom";
import { dashboardService } from "../services/api";
import MoleQueryLogo from "../assets/molequery_icon.svg";

function Dashboard() {
  const navigate = useNavigate();

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
      setError(
        err.message || "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Compounds",
      value: stats?.compounds ?? 0,
      description: "Registered compounds",
      icon: <ScienceIcon />,
      path: "/compounds",
    },
    {
      title: "Targets",
      value: stats?.targets ?? 0,
      description: "Associated biological targets",
      icon: <TrackChangesIcon />,
      path: "/compounds",
    },
    {
      title: "Documents",
      value: stats?.documents ?? 0,
      description: "Research references",
      icon: <DescriptionIcon />,
      path: "/documents",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
        mx: "auto",
      }}
    >
      {/* =========================================================
          PAGE HEADER
          ========================================================= */}

      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Roboto', sans-serif",
            fontSize: { xs: "1.9rem", md: "2.35rem" },
            fontWeight: 700,
            letterSpacing: "-0.7px",
            color: "#0f172a",
            mb: 0.8,
          }}
        >
          Research Dashboard
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Inter', 'Roboto', sans-serif",
            color: "#64748b",
            fontSize: "0.98rem",
            lineHeight: 1.6,
          }}
        >
          Explore compounds, biological targets, research documents,
          and evidence from your knowledge base.
        </Typography>
      </Box>

      {/* =========================================================
          ERROR
          ========================================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* =====================================================
              MOLEQUERY HERO / WELCOME PANEL
              ===================================================== */}

          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              background:
                "linear-gradient(115deg, #0d47a1 0%, #1565c0 48%, #1976d2 100%)",
              color: "white",
              boxShadow:
                "0 12px 35px rgba(21, 101, 192, 0.18)",
            }}
          >
            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.06)",
                right: -80,
                top: -130,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.05)",
                right: 180,
                bottom: -100,
              }}
            />

            <CardContent
              sx={{
                position: "relative",
                zIndex: 2,
                p: { xs: 3, md: 4 },
                "&:last-child": {
                  pb: { xs: 3, md: 4 },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {/* Logo */}

                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    minWidth: 76,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border:
                      "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Box
                    component="img"
                    src={MoleQueryLogo}
                    alt="MoleQuery"
                    sx={{
                      width: 58,
                      height: 58,
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontFamily:
                        "'Inter', 'Roboto', sans-serif",
                      fontSize: {
                        xs: "1.25rem",
                        md: "1.5rem",
                      },
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    Welcome to MoleQuery
                  </Typography>

                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.82)",
                      fontSize: "0.92rem",
                      maxWidth: 650,
                      lineHeight: 1.6,
                    }}
                  >
                    Your centralized workspace for compound
                    research, scientific evidence, and
                    knowledge discovery.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* =====================================================
              STATISTICS
              ===================================================== */}

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
                md={4}
                key={stat.title}
              >
                <Card
                  elevation={0}
                  onClick={() => navigate(stat.path)}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition:
                      "all 0.25s ease",
                    "&:hover": {
                      transform:
                        "translateY(-4px)",
                      borderColor: "#90caf9",
                      boxShadow:
                        "0 12px 30px rgba(15, 23, 42, 0.08)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      "&:last-child": {
                        pb: 3,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Icon */}

                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#e3f2fd",
                          color: "#1565c0",
                        }}
                      >
                        {stat.icon}
                      </Box>

                      <ArrowForwardIcon
                        sx={{
                          fontSize: 20,
                          color: "#94a3b8",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        mt: 2.5,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#64748b",
                        fontFamily:
                          "'Inter', 'Roboto', sans-serif",
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: "2rem",
                        lineHeight: 1.2,
                        fontWeight: 700,
                        color: "#0f172a",
                        fontFamily:
                          "'Inter', 'Roboto', sans-serif",
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.8,
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* =====================================================
              RECENT COMPOUNDS
              ===================================================== */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: 0,
                "&:last-child": {
                  pb: 0,
                },
              }}
            >
              {/* Section header */}

              <Box
                sx={{
                  px: { xs: 2.5, md: 3 },
                  py: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e3f2fd",
                      color: "#1565c0",
                    }}
                  >
                    <BiotechIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        fontFamily:
                          "'Inter', 'Roboto', sans-serif",
                      }}
                    >
                      Recent Compounds
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                        mt: 0.2,
                      }}
                    >
                      Recently added to the knowledge base
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Compound list */}

              {!stats?.recentCompounds ||
              stats.recentCompounds.length === 0 ? (
                <Box
                  sx={{
                    py: 7,
                    textAlign: "center",
                  }}
                >
                  <ScienceIcon
                    sx={{
                      fontSize: 42,
                      color: "#cbd5e1",
                      mb: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.9rem",
                    }}
                  >
                    No recent compounds recorded.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {stats.recentCompounds.map(
                    (compound, index) => (
                      <Box
                        key={compound.id}
                        sx={{
                          px: {
                            xs: 2.5,
                            md: 3,
                          },
                          py: 2.2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          gap: 3,
                          flexWrap: {
                            xs: "wrap",
                            md: "nowrap",
                          },
                          transition:
                            "background-color 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              "#f8fafc",
                          },
                          borderBottom:
                            index <
                            stats.recentCompounds
                              .length -
                              1
                              ? "1px solid #f1f5f9"
                              : "none",
                        }}
                      >
                        {/* Compound identity */}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            minWidth: 220,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              minWidth: 42,
                              borderRadius: 1.5,
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              backgroundColor:
                                "#f0f7ff",
                              color: "#1976d2",
                            }}
                          >
                            <ScienceIcon
                              sx={{
                                fontSize: 22,
                              }}
                            />
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize:
                                  "0.92rem",
                                fontWeight: 700,
                                color:
                                  "#1e293b",
                                fontFamily:
                                  "'Inter', 'Roboto', sans-serif",
                              }}
                            >
                              {compound.name}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize:
                                  "0.76rem",
                                color:
                                  "#94a3b8",
                                mt: 0.3,
                              }}
                            >
                              {compound.identifier}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Target */}

                        <Box
                          sx={{
                            minWidth: 170,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize:
                                "0.68rem",
                              textTransform:
                                "uppercase",
                              letterSpacing:
                                "0.7px",
                              color:
                                "#94a3b8",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            Target
                          </Typography>

                          <Typography
                            sx={{
                              fontSize:
                                "0.84rem",
                              color:
                                "#334155",
                              fontWeight: 500,
                            }}
                          >
                            {compound.target ||
                              "—"}
                          </Typography>
                        </Box>

                        {/* Category */}

                        <Box
                          sx={{
                            minWidth: 150,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize:
                                "0.68rem",
                              textTransform:
                                "uppercase",
                              letterSpacing:
                                "0.7px",
                              color:
                                "#94a3b8",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            Category
                          </Typography>

                          <Chip
                            label={
                              compound.category ||
                              "Uncategorized"
                            }
                            size="small"
                            sx={{
                              backgroundColor:
                                "#e3f2fd",
                              color:
                                "#1565c0",
                              fontSize:
                                "0.72rem",
                              fontWeight: 600,
                              borderRadius:
                                1.5,
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* =====================================================
              FOOTER
              ===================================================== */}

          <Box
            sx={{
              mt: 3,
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#94a3b8",
              }}
            >
              MoleQuery Research Platform
            </Typography>

            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#cbd5e1",
              }}
            >
              Research • Evidence • Discovery
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Dashboard;