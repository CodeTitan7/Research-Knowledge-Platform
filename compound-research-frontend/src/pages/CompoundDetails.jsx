import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
  Alert,
  Avatar,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionIcon from "@mui/icons-material/Description";
import ScienceIcon from "@mui/icons-material/Science";
import CategoryIcon from "@mui/icons-material/Category";
import BiotechIcon from "@mui/icons-material/Biotech";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate, useParams } from "react-router-dom";
import { compoundService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function CompoundDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canEditContent, canDeleteContent } = useAuth();

  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompound();
  }, [id]);

  const fetchCompound = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await compoundService.getById(id);

      if (res.success && res.data) {
        setCompound(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load compound details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${compound?.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await compoundService.delete(id);
        navigate("/compounds");
      } catch (err) {
        setError(err.message || "Failed to delete compound.");
      }
    }
  };

  /* =========================================================
     LOADING STATE
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
            Loading compound information...
          </Typography>
        </Box>
      </Box>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!compound || error) {
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
            <ScienceIcon
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
              Compound Not Found
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                mt: 1,
                mb: 3,
              }}
            >
              {error ||
                "The compound you're looking for does not exist in the current knowledge base."}
            </Typography>

            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/compounds")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Back to Compounds
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const compoundIdentifier =
    compound.molecularFormula ||
    compound.synonym ||
    `CMP-${String(compound.id).padStart(3, "0")}`;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1280,
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
        pb: 5,
      }}
    >
      {/* =========================================================
          BACK NAVIGATION
      ========================================================= */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/compounds")}
        sx={{
          mb: 2.5,
          color: "#64748B",
          textTransform: "none",
          fontWeight: 600,
          px: 1,
          "&:hover": {
            backgroundColor: "#F1F5F9",
            color: "#1976D2",
          },
        }}
      >
        Back to Compounds
      </Button>

      {/* =========================================================
          COMPOUND HERO
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
        {/* Top accent */}
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
              sm: 3,
              md: 4,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              gap: 3,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            {/* Compound identity */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                minWidth: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#E8F1FB",
                  color: "#1976D2",
                  border: "1px solid #D3E3F5",
                  flexShrink: 0,
                }}
              >
                <BiotechIcon sx={{ fontSize: 34 }} />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.7rem",
                      md: "2.2rem",
                    },
                    fontWeight: 800,
                    color: "#12355B",
                    lineHeight: 1.15,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {compound.name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.7,
                    color: "#64748B",
                    fontSize: "0.95rem",
                  }}
                >
                  {compoundIdentifier}
                </Typography>
              </Box>
            </Box>

            {/* Actions */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              {canEditContent && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() =>
                    navigate(
                      `/compounds/${compound.id}/edit`
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 2,
                  }}
                >
                  Edit Compound
                </Button>
              )}

              {canDeleteContent && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

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
          COMPOUND OVERVIEW
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
              gap: 1.2,
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#E8F1FB",
                color: "#1976D2",
              }}
            >
              <ScienceIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#12355B",
                }}
              >
                Compound Overview
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#94A3B8",
                }}
              >
                Scientific description
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          <Typography
            sx={{
              color: "#475569",
              lineHeight: 1.9,
              fontSize: "0.97rem",
              maxWidth: 1100,
            }}
          >
            {compound.description ||
              "No description has been provided for this compound."}
          </Typography>
        </CardContent>
      </Card>

      {/* =========================================================
          CLASSIFICATION & TARGETS
      ========================================================= */}

      <Card
        elevation={0}
        sx={{
          mb: 4,
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
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#12355B",
              mb: 0.5,
            }}
          >
            Classification & Targets
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              mb: 3,
            }}
          >
            Biological targets and classification associated with
            this compound.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: {
                xs: 3,
                md: 5,
              },
            }}
          >
            {/* Targets */}

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <BiotechIcon
                  sx={{
                    color: "#1976D2",
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Associated Targets
                </Typography>
              </Box>

              {compound.targets &&
              compound.targets.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {compound.targets.map((target) => (
                    <Chip
                      key={target}
                      label={target}
                      sx={{
                        backgroundColor: "#E8F1FB",
                        color: "#1565C0",
                        fontWeight: 600,
                        borderRadius: 1.5,
                        border: "1px solid #D3E3F5",
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  No biological targets linked yet.
                </Typography>
              )}
            </Box>

            {/* Category */}

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <CategoryIcon
                  sx={{
                    color: "#1976D2",
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Category
                </Typography>
              </Box>

              {compound.categoryName ? (
                <Chip
                  label={compound.categoryName}
                  sx={{
                    backgroundColor: "#F1F5F9",
                    color: "#334155",
                    fontWeight: 600,
                    borderRadius: 1.5,
                    border: "1px solid #E2E8F0",
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  This compound has not been categorized yet.
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* =========================================================
          RESEARCH & EVIDENCE
      ========================================================= */}

      <Box
        sx={{
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#12355B",
          }}
        >
          Research & Evidence
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748B",
            mt: 0.5,
          }}
        >
          Explore supporting documents and investigate this
          compound with Catalyst.
        </Typography>
      </Box>

      {/* Two equal cards */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* =====================================================
            REFERENCE DOCUMENTS
        ===================================================== */}

        <Card
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease",

            "&:hover": {
              borderColor: "#90CAF9",
              boxShadow:
                "0 8px 25px rgba(15, 76, 129, 0.08)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent
            sx={{
              p: 3.5,
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#E8F1FB",
                color: "#1976D2",
                mb: 2,
              }}
            >
              <DescriptionIcon />
            </Avatar>

            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#12355B",
              }}
            >
              Reference Documents
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                lineHeight: 1.7,
                mt: 1,
                mb: 3,
              }}
            >
              Explore indexed research documents and supporting
              evidence available in the knowledge base.
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/documents")}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              View Documents
            </Button>
          </CardContent>
        </Card>

        {/* =====================================================
            CATALYST
        ===================================================== */}

        <Card
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: 3,
            border: "1px solid #BBD7F2",
            background:
              "linear-gradient(135deg, #F8FBFF 0%, #EDF6FF 100%)",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease",

            "&:hover": {
              borderColor: "#64B5F6",
              boxShadow:
                "0 10px 30px rgba(25, 118, 210, 0.12)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent
            sx={{
              p: 3.5,
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#1976D2",
                color: "#FFFFFF",
                mb: 2,
              }}
            >
              <SmartToyIcon />
            </Avatar>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#12355B",
                }}
              >
                Ask Catalyst
              </Typography>

              <Chip
                label="AI"
                size="small"
                sx={{
                  height: 22,
                  backgroundColor: "#DCEEFF",
                  color: "#1565C0",
                  fontWeight: 700,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                lineHeight: 1.7,
                mt: 1,
                mb: 3,
              }}
            >
              Ask Catalyst questions about{" "}
              <strong>{compound.name}</strong> using the
              platform's research knowledge base and retrieved
              evidence.
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              startIcon={<SmartToyIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() =>
                navigate(
                  `/research?compound=${compound.id}`
                )
              }
              sx={{
                alignSelf: "flex-start",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                boxShadow:
                  "0 6px 16px rgba(25, 118, 210, 0.2)",
              }}
            >
              Ask Catalyst
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default CompoundDetails;