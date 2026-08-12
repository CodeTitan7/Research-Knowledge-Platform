import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import ScienceIcon from "@mui/icons-material/Science";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate, useParams } from "react-router-dom";
import { documentService } from "../services/api";

function DocumentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await documentService.getById(id);

      if (res.success && res.data) {
        setDocument(res.data);
      }
    } catch (err) {
      setError(
        err.message || "Failed to load document details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const chunkCount =
    document?.chunksCount ||
    document?.chunks?.length ||
    0;

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={40} />

          <Typography
            sx={{
              mt: 2,
              color: "#64748B",
              fontSize: "0.9rem",
            }}
          >
            Loading document information...
          </Typography>
        </Box>
      </Box>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!document || error) {
    return (
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          py: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 7,
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: 60,
                color: "#CBD5E1",
                mb: 1,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#12355B",
              }}
            >
              Document Not Found
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                mt: 1,
                mb: 3,
              }}
            >
              {error ||
                "The document you're looking for does not exist in the knowledge base."}
            </Typography>

            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/documents")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Back to Documents
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        pb: 5,
      }}
    >
      {/* =========================================================
          BACK NAVIGATION
      ========================================================= */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/documents")}
        sx={{
          mb: 2.5,
          color: "#64748B",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#F1F5F9",
            color: "#1976D2",
          },
        }}
      >
        Back to Documents
      </Button>

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
          DOCUMENT HERO
      ========================================================= */}

      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #DCE6F0",
          background:
            "linear-gradient(135deg, #FFFFFF 0%, #F5F9FE 100%)",
        }}
      >
        {/* Accent line */}

        <Box
          sx={{
            height: 5,
            background:
              "linear-gradient(90deg, #1565C0, #42A5F5)",
          }}
        />

        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },
          }}
        >
          {/* Document identity */}

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                flexShrink: 0,
                borderRadius: 2,
                backgroundColor: "#E8F1FB",
                color: "#1976D2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DescriptionIcon
                sx={{
                  fontSize: 30,
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1.6rem",
                    md: "2.1rem",
                  },
                  fontWeight: 800,
                  color: "#12355B",
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                  wordBreak: "break-word",
                }}
              >
                {document.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.8,
                  color: "#64748B",
                  fontSize: "0.9rem",
                  wordBreak: "break-word",
                }}
              >
                {document.fileName || "Reference document"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Metadata */}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {document.relatedCompoundName && (
              <Chip
                icon={<ScienceIcon />}
                label={`Compound: ${document.relatedCompoundName}`}
                sx={{
                  backgroundColor: "#E8F1FB",
                  color: "#1565C0",
                  fontWeight: 600,
                  border: "1px solid #D3E3F5",
                  borderRadius: 1.5,
                }}
              />
            )}

            <Chip
              label={`${chunkCount} Vector ${
                chunkCount === 1 ? "Chunk" : "Chunks"
              }`}
              sx={{
                backgroundColor: "#F1F5F9",
                color: "#334155",
                fontWeight: 600,
                border: "1px solid #E2E8F0",
                borderRadius: 1.5,
              }}
            />
          </Box>

          {/* Upload information */}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: {
                xs: 1.5,
                md: 4,
              },
              mt: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#94A3B8",
                  mb: 0.3,
                }}
              >
                Uploaded By
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                {document.uploadedByName || "System"}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#94A3B8",
                  mb: 0.3,
                }}
              >
                Uploaded
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                {formatDate(document.uploadedAt)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* =========================================================
          INDEXING OVERVIEW
      ========================================================= */}

      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid #E2E8F0",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 3.5,
            },
          }}
        >
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
                borderRadius: 2,
                backgroundColor: "#E8F1FB",
                color: "#1976D2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DescriptionIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#12355B",
                }}
              >
                Research Document
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#94A3B8",
                }}
              >
                Indexed content available to the research
                knowledge base.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            {/* Chunk count */}

            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#94A3B8",
                }}
              >
                Indexed Evidence
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#12355B",
                }}
              >
                {chunkCount}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  mt: 0.3,
                }}
              >
                searchable text{" "}
                {chunkCount === 1
                  ? "chunk"
                  : "chunks"}
              </Typography>
            </Box>

            {/* Compound */}

            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#94A3B8",
                }}
              >
                Knowledge Scope
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#12355B",
                }}
              >
                {document.relatedCompoundName ||
                  "General Research"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  mt: 0.5,
                }}
              >
                {document.relatedCompoundName
                  ? "Linked to this compound for focused retrieval."
                  : "Available as general research evidence."}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* =========================================================
          EXTRACTED CHUNKS
      ========================================================= */}

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#12355B",
          }}
        >
          Indexed Evidence Chunks
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748B",
            mt: 0.5,
          }}
        >
          Extracted sections used by Catalyst when retrieving
          evidence for research questions.
        </Typography>
      </Box>

      {(!document.chunks ||
        document.chunks.length === 0) && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: 48,
                color: "#CBD5E1",
                mb: 1,
              }}
            />

            <Typography
              sx={{
                fontWeight: 700,
                color: "#334155",
              }}
            >
              No indexed chunks available
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#94A3B8",
                mt: 0.5,
              }}
            >
              No text chunks were extracted from this
              document.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* =========================================================
          CHUNK LIST
      ========================================================= */}

      {document.chunks &&
        document.chunks.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {document.chunks.map((chunk, index) => (
              <Card
                key={chunk.id || index}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#90CAF9",
                    boxShadow:
                      "0 6px 20px rgba(15, 76, 129, 0.06)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 2.5,
                      md: 3,
                    },
                  }}
                >
                  {/* Chunk header */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: {
                        xs: "flex-start",
                        md: "center",
                      },
                      gap: 2,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={`Chunk #${
                          chunk.chunkIndex + 1
                        }`}
                        size="small"
                        sx={{
                          backgroundColor: "#E8F1FB",
                          color: "#1565C0",
                          fontWeight: 700,
                          borderRadius: 1.5,
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94A3B8",
                        }}
                      >
                        ID: {chunk.id}
                      </Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94A3B8",
                      }}
                    >
                      Evidence segment
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Chunk text */}

                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.8,
                      color: "#475569",
                      fontSize: "0.94rem",
                    }}
                  >
                    {chunk.chunkText}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

      {/* =========================================================
          CATALYST ACTION
      ========================================================= */}

      {document.relatedCompoundId && (
        <Card
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: "1px solid #BBD7F2",
            background:
              "linear-gradient(135deg, #F8FBFF 0%, #EDF6FF 100%)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                justifyContent: "space-between",
                gap: 3,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 2,
                    backgroundColor: "#1976D2",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SmartToyIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#12355B",
                      fontSize: "1.05rem",
                    }}
                  >
                    Investigate with Catalyst
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748B",
                      lineHeight: 1.6,
                      mt: 0.4,
                    }}
                  >
                    Ask research questions about{" "}
                    <strong>
                      {document.relatedCompoundName ||
                        "this compound"}
                    </strong>{" "}
                    using this document as part of the
                    retrieved evidence base.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<SmartToyIcon />}
                endIcon={<ArrowForwardIcon />}
                onClick={() =>
                  navigate(
                    `/research?compound=${document.relatedCompoundId}`
                  )
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  boxShadow:
                    "0 6px 16px rgba(25, 118, 210, 0.2)",
                }}
              >
                Ask Catalyst
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default DocumentDetails;