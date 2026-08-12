import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
  Alert,
  Avatar,
} from "@mui/material";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

import { researchService } from "../services/api";
import { useAuth } from "../context/AuthContext";


function QueryHistory() {
  const { userRole } = useAuth();

  const isAuditor =
    userRole === "Reviewer" || userRole === "Administrator";


  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchHistory();
  }, []);


  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await researchService.getHistory();

      if (res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load query history.");
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
      }}
    >

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          {/* Header Icon */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              backgroundColor: "rgba(25, 118, 210, 0.10)",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HistoryOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#102A43",
              }}
            >
              {isAuditor
                ? "System AI Usage & Query History"
                : "My Research Query History"}
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                color: "text.secondary",
                fontSize: "0.95rem",
                fontFamily: "Inter, Arial, sans-serif",
              }}
            >
              {isAuditor
                ? "Review AI usage and query activity across the MoleQuery knowledge platform."
                : "Review your previous research questions and AI-generated insights."}
            </Typography>
          </Box>
        </Box>


        {/* History count */}
        {!loading && history.length > 0 && (
          <Chip
            icon={<HistoryOutlinedIcon />}
            label={`${history.length} ${
              history.length === 1 ? "Query" : "Queries"
            }`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              color: "primary.main",
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              border: "1px solid rgba(25, 118, 210, 0.15)",
            }}
          />
        )}
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


      {/* =========================================================
          LOADING
      ========================================================= */}
      {loading ? (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E6EEF5",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              minHeight: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress size={34} />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading query history...
            </Typography>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (

        /* =========================================================
            EMPTY STATE
        ========================================================= */
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E6EEF5",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 9,
              px: 3,
            }}
          >
            <Box
              sx={{
                width: 76,
                height: 76,
                mx: "auto",
                mb: 2.5,
                borderRadius: "50%",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HistoryOutlinedIcon
                sx={{
                  fontSize: 38,
                  color: "primary.main",
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#102A43",
                mb: 1,
              }}
            >
              No Query History Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Your research questions and AI-generated answers will
              appear here after you interact with the Research Assistant.
            </Typography>
          </CardContent>
        </Card>

      ) : (

        /* =========================================================
            QUERY HISTORY LIST
        ========================================================= */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {history.map((item, index) => (

            <Card
              key={item.id}
              elevation={0}
              sx={{
                border: "1px solid #E3ECF5",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.2s ease",

                "&:hover": {
                  borderColor: "rgba(25, 118, 210, 0.35)",
                  boxShadow: "0 8px 25px rgba(25, 118, 210, 0.08)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2.5, md: 3 },
                  "&:last-child": {
                    pb: { xs: 2.5, md: 3 },
                  },
                }}
              >

                {/* =================================================
                    QUERY HEADER
                ================================================= */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >

                  {/* Question */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >

                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "rgba(25, 118, 210, 0.10)",
                        color: "primary.main",
                        flexShrink: 0,
                      }}
                    >
                      <AutoAwesomeOutlinedIcon
                        sx={{ fontSize: 21 }}
                      />
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "primary.main",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          mb: 0.5,
                        }}
                      >
                        Research Query
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "1.05rem",
                          fontWeight: 650,
                          lineHeight: 1.5,
                          color: "#102A43",
                          wordBreak: "break-word",
                          fontFamily:
                            "Inter, Arial, sans-serif",
                        }}
                      >
                        {item.questionText}
                      </Typography>

                      {/* Auditor information */}
                      {isAuditor &&
                        (item.userFullName || item.userEmail) && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.7,
                              mt: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <PersonOutlineOutlinedIcon
                              sx={{
                                fontSize: 16,
                                color: "text.secondary",
                              }}
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Asked by{" "}
                              <strong>
                                {item.userFullName ||
                                  item.userEmail}
                              </strong>
                            </Typography>

                            {item.userFullName &&
                              item.userEmail && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ({item.userEmail})
                                </Typography>
                              )}
                          </Box>
                        )}
                    </Box>
                  </Box>


                  {/* Date */}
                  <Chip
                    icon={
                      <AccessTimeOutlinedIcon
                        sx={{ fontSize: 16 }}
                      />
                    }
                    label={formatDate(item.createdAt)}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#D7E3EE",
                      color: "text.secondary",
                      backgroundColor: "#FAFCFE",
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  />
                </Box>


                <Divider
                  sx={{
                    my: 2.5,
                    borderColor: "#EAF0F5",
                  }}
                />


                {/* =================================================
                    AI ANSWER
                ================================================= */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                  }}
                >

                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    <SmartToyOutlinedIcon
                      sx={{ fontSize: 21 }}
                    />
                  </Avatar>


                  <Box sx={{ flex: 1, minWidth: 0 }}>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "primary.main",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        mb: 0.7,
                      }}
                    >
                      MoleQuery AI
                    </Typography>

                    <Typography
                      sx={{
                        color: "#334E68",
                        fontSize: "0.96rem",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                        fontFamily:
                          "Inter, Arial, sans-serif",
                      }}
                    >
                      {item.answerText}
                    </Typography>

                  </Box>
                </Box>


                {/* =================================================
                    SOURCE INFORMATION
                ================================================= */}
                {item.sourceChunkIds && (
                  <Box
                    sx={{
                      mt: 2.5,
                      ml: { xs: 0, sm: 6.5 },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      Knowledge Sources
                    </Typography>

                    <Chip
                      label={`Vector Chunks #${item.sourceChunkIds}`}
                      size="small"
                      sx={{
                        backgroundColor:
                          "rgba(25, 118, 210, 0.07)",
                        color: "primary.main",
                        fontWeight: 600,
                        border:
                          "1px solid rgba(25, 118, 210, 0.12)",
                      }}
                    />
                  </Box>
                )}

              </CardContent>
            </Card>
          ))}
        </Box>
      )}

    </Box>
  );
}


export default QueryHistory;