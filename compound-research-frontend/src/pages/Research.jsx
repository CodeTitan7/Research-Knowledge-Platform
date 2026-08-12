import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { useSearchParams } from "react-router-dom";
import { researchService } from "../services/api";

// ------------------------------------------------------------
// Catalyst image
// Change this filename if your image has a different name.
// Example:
// import catalystImage from "../assets/catalyst.png";
// ------------------------------------------------------------
import catalystImage from "../assets/catalyst_avatar.svg";

function Research() {
  const [searchParams] = useSearchParams();

  const compoundId = searchParams.get("compound");
  const documentId = searchParams.get("document");

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ------------------------------------------------------------
  // Ask Catalyst
  // ------------------------------------------------------------
  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a research question.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const res = await researchService.ask(
        question.trim(),
        compoundId
      );

      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(
        err.message || "Failed to query the Catalyst research agent."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Enter = submit
  // Shift + Enter = new line
  // ------------------------------------------------------------
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        pb: 6,
      }}
    >
      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <Box
        sx={{
          textAlign: "center",
          maxWidth: 900,
          mx: "auto",
          mb: 4,
        }}
      >
        {/* Catalyst image */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={catalystImage}
            alt="Catalyst AI Research Agent"
            sx={{
              width: 105,
              height: 105,
              objectFit: "cover",
              borderRadius: "28px",
              boxShadow:
                "0 12px 35px rgba(25, 118, 210, 0.18)",
            }}
          />
        </Box>

        {/* Small badge */}

        <Chip
          icon={<AutoAwesomeOutlinedIcon />}
          label="AI-POWERED RESEARCH AGENT"
          size="small"
          sx={{
            mb: 1.5,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "primary.main",
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            border: "1px solid rgba(25, 118, 210, 0.15)",
          }}
        />

        <Typography
          sx={{
            fontFamily: "'Inter', 'Roboto', sans-serif",
            fontWeight: 800,
            fontSize: {
              xs: "2rem",
              md: "2.7rem",
            },
            letterSpacing: "-0.04em",
            color: "#12304A",
            mb: 1,
          }}
        >
          Meet Catalyst
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Inter', 'Roboto', sans-serif",
            fontSize: "1.05rem",
            color: "text.secondary",
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Your AI research companion for exploring compounds,
          mechanisms, targets, and scientific evidence.
        </Typography>
      </Box>

      {/* ======================================================
          CONTEXT INFORMATION
      ====================================================== */}

      {(compoundId || documentId) && (
        <Alert
          severity="info"
          sx={{
            maxWidth: 900,
            mx: "auto",
            mb: 3,
            borderRadius: 3,
            border: "1px solid rgba(25, 118, 210, 0.15)",
          }}
        >
          {compoundId && (
            <>
              Search scope narrowed to compound{" "}
              <strong>#{compoundId}</strong>.
            </>
          )}

          {documentId && (
            <>
              {" "}
              Research context focused on document{" "}
              <strong>#{documentId}</strong>.
            </>
          )}
        </Alert>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            maxWidth: 900,
            mx: "auto",
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* ======================================================
          QUESTION CARD
      ====================================================== */}

      <Card
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "rgba(25, 118, 210, 0.12)",
          boxShadow:
            "0 10px 40px rgba(15, 70, 120, 0.08)",
          overflow: "hidden",
          mb: 4,
        }}
      >
        {/* Blue top accent */}

        <Box
          sx={{
            height: 5,
            background:
              "linear-gradient(90deg, #1976D2, #42A5F5, #90CAF9)",
          }}
        />

        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
          }}
        >
          {/* Heading */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                color: "primary.main",
              }}
            >
              <SearchRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 750,
                  fontSize: "1.15rem",
                }}
              >
                Ask a question about your research.
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2.5,
              mt: 2,
              lineHeight: 1.7,
            }}
          >
            Catalyst searches your indexed research documents,
            retrieves relevant evidence, and generates an answer
            grounded in the available scientific sources.
          </Typography>

          {/* Question input */}

          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            placeholder="Example: How does Metformin lower blood glucose and activate AMPK?"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);

              if (error) {
                setError("");
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            error={Boolean(error)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#FAFCFF",
                fontSize: "1rem",
                lineHeight: 1.6,
              },
            }}
          />

          {/* Bottom controls */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Press Enter to ask • Shift + Enter for a new line
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              endIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <SendRoundedIcon />
                )
              }
              sx={{
                minWidth: 155,
                borderRadius: 2.5,
                px: 3,
                py: 1.3,
                textTransform: "none",
                fontWeight: 700,
                boxShadow:
                  "0 6px 18px rgba(25, 118, 210, 0.25)",
              }}
            >
              {loading ? "Analyzing..." : "Ask Catalyst"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ======================================================
          LOADING STATE
      ====================================================== */}

      {loading && (
        <Card
          elevation={0}
          sx={{
            maxWidth: 900,
            mx: "auto",
            borderRadius: 4,
            border: "1px solid rgba(25, 118, 210, 0.12)",
            backgroundColor: "#F8FBFF",
          }}
        >
          <CardContent
            sx={{
              py: 4,
              textAlign: "center",
            }}
          >
            <CircularProgress
              size={38}
              thickness={4}
              sx={{ mb: 2 }}
            />

            <Typography
              fontWeight={700}
              sx={{ mb: 0.5 }}
            >
              Catalyst is researching...
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Searching the knowledge base, comparing evidence,
              and generating a grounded response.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ======================================================
          RESULTS
      ====================================================== */}

      {result && !loading && (
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* Result heading */}

          <Box
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#12304A",
              }}
            >
              Catalyst's Analysis
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Generated from retrieved research evidence
            </Typography>
          </Box>

          {/* ==================================================
              ANSWER
          ================================================== */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid rgba(25, 118, 210, 0.12)",
              boxShadow:
                "0 8px 30px rgba(15, 70, 120, 0.06)",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 2.5,
                  flexWrap: "wrap",
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
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        "rgba(25, 118, 210, 0.08)",
                      color: "primary.main",
                    }}
                  >
                    <SmartToyOutlinedIcon />
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={800}
                      fontSize="1.15rem"
                    >
                      Grounded Answer
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Catalyst AI response
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  icon={
                    result.hasSufficientEvidence ? (
                      <CheckCircleRoundedIcon />
                    ) : (
                      <WarningAmberRoundedIcon />
                    )
                  }
                  label={
                    result.hasSufficientEvidence
                      ? "Evidence Supported"
                      : "Limited Evidence"
                  }
                  color={
                    result.hasSufficientEvidence
                      ? "success"
                      : "warning"
                  }
                  sx={{
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography
                sx={{
                  lineHeight: 1.85,
                  whiteSpace: "pre-wrap",
                  fontSize: "1rem",
                  color: "#263746",
                }}
              >
                {result.answer}
              </Typography>

              <Alert
                severity={
                  result.hasSufficientEvidence
                    ? "info"
                    : "warning"
                }
                icon={
                  result.hasSufficientEvidence ? (
                    <CheckCircleRoundedIcon />
                  ) : (
                    <WarningAmberRoundedIcon />
                  )
                }
                sx={{
                  mt: 3,
                  borderRadius: 2.5,
                }}
              >
                This response was generated using retrieved
                evidence from the research knowledge base.
              </Alert>
            </CardContent>
          </Card>

          {/* ==================================================
              SOURCES
          ================================================== */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid rgba(25, 118, 210, 0.12)",
              boxShadow:
                "0 8px 30px rgba(15, 70, 120, 0.06)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        "rgba(25, 118, 210, 0.08)",
                      color: "primary.main",
                    }}
                  >
                    <DescriptionOutlinedIcon />
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={800}
                      fontSize="1.15rem"
                    >
                      Research Sources
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Retrieved evidence used by Catalyst
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {(!result.sources ||
                result.sources.length === 0) ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                  }}
                >
                  <DescriptionOutlinedIcon
                    sx={{
                      fontSize: 45,
                      color: "text.disabled",
                      mb: 1,
                    }}
                  />

                  <Typography
                    fontWeight={700}
                    sx={{ mb: 0.5 }}
                  >
                    No matching sources
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Catalyst could not find relevant evidence
                    chunks for this question.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {result.sources.map((source, index) => (
                    <Paper
                      key={
                        source.chunkId || index
                      }
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border:
                          "1px solid rgba(25, 118, 210, 0.12)",
                        backgroundColor: "#FBFDFF",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.2,
                            alignItems: "center",
                          }}
                        >
                          <DescriptionOutlinedIcon
                            color="primary"
                            fontSize="small"
                          />

                          <Typography
                            fontWeight={700}
                            variant="body2"
                          >
                            [{index + 1}]{" "}
                            {source.documentTitle}
                          </Typography>
                        </Box>

                        {source.relevanceScore !==
                          undefined && (
                          <Chip
                            label={`Similarity: ${(
                              source.relevanceScore *
                              100
                            ).toFixed(1)}%`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                        }}
                      >
                        "{source.excerptText}"
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!result && !loading && (
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border:
                "1px solid rgba(25, 118, 210, 0.10)",
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%)",
            }}
          >
            <CardContent
              sx={{
                py: 5,
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    "rgba(25, 118, 210, 0.08)",
                }}
              >
                <ScienceOutlinedIcon
                  sx={{
                    fontSize: 34,
                    color: "primary.main",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  mb: 1,
                }}
              >
                Explore Your Research Knowledge Base
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  maxWidth: 650,
                  mx: "auto",
                  lineHeight: 1.7,
                }}
              >
                Ask Catalyst about compounds, mechanisms of
                action, molecular targets, diseases, clinical
                findings, or anything contained within your
                indexed research documents.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Research;