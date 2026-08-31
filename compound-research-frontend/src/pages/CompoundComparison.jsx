import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ScienceIcon from "@mui/icons-material/Science";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import { useNavigate } from "react-router-dom";

import { compoundService } from "../services/api";

function CompoundComparison() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [compoundsList, setCompoundsList] = useState([]);

  const [selectedCompounds, setSelectedCompounds] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // LOAD COMPOUNDS
  // =========================================================

  useEffect(() => {
    fetchCompounds();
  }, []);

  const fetchCompounds = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await compoundService.getAll();

      if (res.success && Array.isArray(res.data)) {
        setCompoundsList(res.data);
      } else {
        setCompoundsList([]);
      }
    } catch (err) {
      setError(
        err.message || "Failed to load compounds for comparison."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FILTER COMPOUNDS
  // =========================================================

  const filteredCompounds = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return compoundsList;
    }

    return compoundsList.filter((compound) => {
      return (
        compound.name?.toLowerCase().includes(search) ||
        compound.synonym?.toLowerCase().includes(search) ||
        compound.molecularFormula
          ?.toLowerCase()
          .includes(search) ||
        compound.categoryName
          ?.toLowerCase()
          .includes(search) ||
        compound.description
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [compoundsList, searchTerm]);

  // =========================================================
  // CHECK WHETHER COMPOUND IS SELECTED
  // =========================================================

  const isSelected = (compoundId) => {
    return selectedCompounds.some(
      (compound) => compound.id === compoundId
    );
  };

  // =========================================================
  // ADD COMPOUND
  // =========================================================

  const handleAddCompound = (compound) => {
    if (isSelected(compound.id)) {
      return;
    }

    if (selectedCompounds.length >= 3) {
      setError(
        "You can compare a maximum of 3 compounds at a time."
      );
      return;
    }

    setError("");

    setSelectedCompounds((prev) => [
      ...prev,
      compound,
    ]);
  };

  // =========================================================
  // REMOVE COMPOUND
  // =========================================================

  const handleRemoveCompound = (compoundId) => {
    setSelectedCompounds((prev) =>
      prev.filter(
        (compound) => compound.id !== compoundId
      )
    );

    setError("");
  };

  // =========================================================
  // CLEAR ALL
  // =========================================================

  const handleClearAll = () => {
    setSelectedCompounds([]);
    setError("");
  };

  // =========================================================
  // VIEW DETAILS
  // =========================================================

  const handleViewDetails = (compoundId) => {
    navigate(`/compounds/${compoundId}`);
  };

  // =========================================================
  // TARGET RENDERING
  // =========================================================

  const renderTargets = (compound) => {
    if (
      !compound.targets ||
      compound.targets.length === 0
    ) {
      return (
        <Typography
          sx={{
            fontSize: "13px",
            color: "#94A3B8",
          }}
        >
          No targets
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          gap: 0.7,
          flexWrap: "wrap",
        }}
      >
        {compound.targets.map((target) => (
          <Chip
            key={target}
            label={target}
            size="small"
            sx={{
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 600,
              borderRadius: 1.5,
              fontSize: "11px",
            }}
          />
        ))}
      </Box>
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

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
          <CircularProgress size={36} />

          <Typography
            sx={{
              mt: 2,
              color: "#718096",
              fontSize: "14px",
            }}
          >
            Loading compounds...
          </Typography>
        </Box>
      </Box>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <Box
      sx={{
        maxWidth: "1600px",
        mx: "auto",
      }}
    >
      {/* =====================================================
          BACK NAVIGATION
      ===================================================== */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/compounds")}
        sx={{
          mb: 2.5,
          color: "#64748B",
          textTransform: "none",
          fontWeight: 600,

          "&:hover": {
            backgroundColor: "#F1F5F9",
            color: "#2563EB",
          },
        }}
      >
        Back to Compounds
      </Button>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.8,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EFF6FF",
                color: "#2563EB",
              }}
            >
              <CompareArrowsIcon />
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: "28px",
                  md: "32px",
                },
                fontWeight: 700,
                color: "#172033",
                letterSpacing: "-0.6px",
              }}
            >
              Compound Comparison
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#718096",
              fontSize: "14px",
              ml: {
                xs: 0,
                md: 6.8,
              },
              maxWidth: 700,
            }}
          >
            Select up to three compounds to compare their
            molecular information, biological targets,
            classifications and research descriptions.
          </Typography>
        </Box>

        {selectedCompounds.length > 0 && (
          <Button
            variant="outlined"
            onClick={handleClearAll}
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "#64748B",
              borderColor: "#CBD5E1",

              "&:hover": {
                borderColor: "#94A3B8",
                backgroundColor: "#F8FAFC",
              },
            }}
          >
            Clear Selection
          </Button>
        )}
      </Box>

      {/* =====================================================
          ERROR
      ===================================================== */}

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

      {/* =====================================================
          COMPOUND SELECTION
      ===================================================== */}

      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid #E5EAF2",
          borderRadius: 3,
          overflow: "visible",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          {/* Selection Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#172033",
                }}
              >
                Select Compounds
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#94A3B8",
                  mt: 0.4,
                }}
              >
                Choose 2 or 3 compounds for a side-by-side
                comparison.
              </Typography>
            </Box>

            <Chip
              label={`${selectedCompounds.length} / 3 selected`}
              size="small"
              sx={{
                backgroundColor:
                  selectedCompounds.length > 0
                    ? "#EFF6FF"
                    : "#F1F5F9",
                color:
                  selectedCompounds.length > 0
                    ? "#2563EB"
                    : "#64748B",
                fontWeight: 600,
                borderRadius: 1.5,
              }}
            />
          </Box>

          {/* Search */}

          <TextField
            fullWidth
            label="Search compounds"
            placeholder="Search by name, synonym, formula or category"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#94A3B8",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,

              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#FAFBFD",
              },
            }}
          />

          {/* Available Compounds */}

          {filteredCompounds.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <ScienceIcon
                sx={{
                  fontSize: 42,
                  color: "#CBD5E1",
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                No compounds found
              </Typography>

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#94A3B8",
                  mt: 0.5,
                }}
              >
                Try another search term.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                  lg: "1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {filteredCompounds.map((compound) => {
                const selected = isSelected(
                  compound.id
                );

                return (
                  <Paper
                    key={compound.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: selected
                        ? "1px solid #93C5FD"
                        : "1px solid #E5EAF2",
                      borderRadius: 2.5,
                      backgroundColor: selected
                        ? "#F8FBFF"
                        : "#FFFFFF",
                      transition:
                        "all 0.15s ease",

                      "&:hover": {
                        borderColor: "#93C5FD",
                        backgroundColor: "#F8FBFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#172033",
                          }}
                        >
                          {compound.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#7A8799",
                            mt: 0.4,
                          }}
                        >
                          {compound.molecularFormula ||
                            compound.synonym ||
                            "No formula available"}
                        </Typography>
                      </Box>

                      {selected && (
                        <Chip
                          label="Selected"
                          size="small"
                          sx={{
                            height: 23,
                            backgroundColor:
                              "#DBEAFE",
                            color: "#2563EB",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>

                    <Divider
                      sx={{
                        my: 1.5,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#64748B",
                        lineHeight: 1.5,
                        minHeight: 36,
                      }}
                    >
                      {compound.description ||
                        "No description available."}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Button
                        fullWidth
                        variant={
                          selected
                            ? "outlined"
                            : "contained"
                        }
                        size="small"
                        startIcon={
                          selected ? (
                            <CloseIcon />
                          ) : (
                            <AddIcon />
                          )
                        }
                        onClick={() =>
                          selected
                            ? handleRemoveCompound(
                                compound.id
                              )
                            : handleAddCompound(
                                compound
                              )
                        }
                        sx={{
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 600,

                          ...(selected && {
                            color: "#64748B",
                            borderColor:
                              "#CBD5E1",
                          }),

                          ...(!selected && {
                            backgroundColor:
                              "#2563EB",

                            "&:hover": {
                              backgroundColor:
                                "#1D4ED8",
                            },
                          }),
                        }}
                      >
                        {selected
                          ? "Remove"
                          : "Add to Comparison"}
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          SELECTED COMPOUNDS
      ===================================================== */}

      {selectedCompounds.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #E5EAF2",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: {
                xs: 2,
                md: 3,
              },
              py: 2.2,
              borderBottom: "1px solid #E5EAF2",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Selected Compounds
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#94A3B8",
                mt: 0.4,
              }}
            >
              {selectedCompounds.length < 2
                ? "Select at least one more compound to begin comparison."
                : "Your selected compounds are ready for comparison."}
            </Typography>
          </Box>

          <CardContent
            sx={{
              p: {
                xs: 2,
                md: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md:
                    selectedCompounds.length === 2
                      ? "1fr 1fr"
                      : "1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {selectedCompounds.map(
                (compound) => (
                  <Paper
                    key={compound.id}
                    elevation={0}
                    sx={{
                      p: 2.2,
                      border:
                        "1px solid #BFDBFE",
                      borderRadius: 2.5,
                      backgroundColor:
                        "#F8FBFF",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            backgroundColor:
                              "#EFF6FF",
                            color: "#2563EB",
                          }}
                        >
                          <ScienceIcon
                            fontSize="small"
                          />
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#172033",
                          }}
                        >
                          {compound.name}
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        onClick={() =>
                          handleRemoveCompound(
                            compound.id
                          )
                        }
                        sx={{
                          minWidth: 0,
                          width: 30,
                          height: 30,
                          color: "#94A3B8",
                          borderRadius: 1.5,

                          "&:hover": {
                            color: "#DC2626",
                            backgroundColor:
                              "#FEF2F2",
                          },
                        }}
                      >
                        <CloseIcon
                          fontSize="small"
                        />
                      </Button>
                    </Box>

                    <Divider
                      sx={{
                        my: 2,
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize:
                              "10px",
                            fontWeight: 700,
                            color:
                              "#94A3B8",
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.5px",
                          }}
                        >
                          Formula
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "13px",
                            color:
                              "#475569",
                            mt: 0.3,
                          }}
                        >
                          {compound.molecularFormula ||
                            "-"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize:
                              "10px",
                            fontWeight: 700,
                            color:
                              "#94A3B8",
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.5px",
                          }}
                        >
                          Synonym
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "13px",
                            color:
                              "#475569",
                            mt: 0.3,
                          }}
                        >
                          {compound.synonym ||
                            "-"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize:
                              "10px",
                            fontWeight: 700,
                            color:
                              "#94A3B8",
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.5px",
                          }}
                        >
                          Category
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "13px",
                            color:
                              "#475569",
                            mt: 0.3,
                          }}
                        >
                          {compound.categoryName ||
                            "-"}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={
                        <VisibilityIcon />
                      }
                      onClick={() =>
                        handleViewDetails(
                          compound.id
                        )
                      }
                      sx={{
                        mt: 2,
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#2563EB",
                        borderColor:
                          "#BFDBFE",

                        "&:hover": {
                          borderColor:
                            "#2563EB",
                          backgroundColor:
                            "#EFF6FF",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Paper>
                )
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* =====================================================
          COMPARISON TABLE
      ===================================================== */}

      {selectedCompounds.length >= 2 && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E5EAF2",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Table Header */}

          <Box
            sx={{
              px: {
                xs: 2,
                md: 3,
              },
              py: 2.2,
              borderBottom:
                "1px solid #E5EAF2",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <CompareArrowsIcon
                sx={{
                  color: "#2563EB",
                  fontSize: 21,
                }}
              />

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#172033",
                }}
              >
                Comparison
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#94A3B8",
              }}
            >
              Side-by-side comparison of selected
              compound records.
            </Typography>
          </Box>

          {/* Comparison Table */}

          <Box
            sx={{
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                minWidth:
                  selectedCompounds.length === 2
                    ? 850
                    : 1100,
              }}
            >
              {/* Column Headers */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs:
                      "180px repeat(" +
                      selectedCompounds.length +
                      ", minmax(250px, 1fr))",
                  },
                  backgroundColor:
                    "#F8FAFC",
                  borderBottom:
                    "1px solid #E5EAF2",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    fontWeight: 700,
                    fontSize: "12px",
                    color: "#475569",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.5px",
                  }}
                >
                  Attribute
                </Box>

                {selectedCompounds.map(
                  (compound) => (
                    <Box
                      key={compound.id}
                      sx={{
                        p: 2,
                        borderLeft:
                          "1px solid #E5EAF2",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#172033",
                        }}
                      >
                        {compound.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#94A3B8",
                          mt: 0.4,
                        }}
                      >
                        CMP-{compound.id}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>

              {/* Name */}

              <ComparisonRow
                label="Compound Name"
                compounds={selectedCompounds}
                renderValue={(compound) =>
                  compound.name || "-"
                }
              />

              {/* Formula */}

              <ComparisonRow
                label="Molecular Formula"
                compounds={selectedCompounds}
                renderValue={(compound) =>
                  compound.molecularFormula ||
                  "-"
                }
              />

              {/* Synonym */}

              <ComparisonRow
                label="Synonym / Trade Name"
                compounds={selectedCompounds}
                renderValue={(compound) =>
                  compound.synonym || "-"
                }
              />

              {/* Category */}

              <ComparisonRow
                label="Category"
                compounds={selectedCompounds}
                renderValue={(compound) =>
                  compound.categoryName ||
                  "Uncategorized"
                }
              />

              {/* Targets */}

              <ComparisonRow
                label="Biological Targets"
                compounds={selectedCompounds}
                renderValue={(compound) =>
                  renderTargets(compound)
                }
              />

              {/* Description */}

              <ComparisonRow
                label="Research Description"
                compounds={selectedCompounds}
                renderValue={(compound) =>
                  compound.description ||
                  "No description available."
                }
                multiline
              />

              {/* Action */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs:
                      "180px repeat(" +
                      selectedCompounds.length +
                      ", minmax(250px, 1fr))",
                  },
                  borderBottom: 0,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#475569",
                  }}
                >
                  Action
                </Box>

                {selectedCompounds.map(
                  (compound) => (
                    <Box
                      key={compound.id}
                      sx={{
                        p: 2,
                        borderLeft:
                          "1px solid #E5EAF2",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          <VisibilityIcon />
                        }
                        onClick={() =>
                          handleViewDetails(
                            compound.id
                          )
                        }
                        sx={{
                          borderRadius: 1.5,
                          textTransform:
                            "none",
                          fontWeight: 600,
                          color: "#2563EB",
                          borderColor:
                            "#BFDBFE",

                          "&:hover": {
                            borderColor:
                              "#2563EB",
                            backgroundColor:
                              "#EFF6FF",
                          },
                        }}
                      >
                        View Compound
                      </Button>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Box>
        </Card>
      )}

      {/* =====================================================
          EMPTY COMPARISON STATE
      ===================================================== */}

      {selectedCompounds.length < 2 && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E5EAF2",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EFF6FF",
                color: "#2563EB",
              }}
            >
              <CompareArrowsIcon
                sx={{
                  fontSize: 32,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Start Comparing Compounds
            </Typography>

            <Typography
              sx={{
                maxWidth: 500,
                mx: "auto",
                mt: 0.8,
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#94A3B8",
              }}
            >
              Select at least two compounds above to
              generate a side-by-side comparison of
              their research information.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

// =============================================================
// REUSABLE COMPARISON ROW
// =============================================================

function ComparisonRow({
  label,
  compounds,
  renderValue,
  multiline = false,
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs:
            "180px repeat(" +
            compounds.length +
            ", minmax(250px, 1fr))",
        },
        borderBottom:
          "1px solid #E5EAF2",
      }}
    >
      {/* Attribute */}

      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "flex-start",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#475569",
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Values */}

      {compounds.map((compound) => (
        <Box
          key={compound.id}
          sx={{
            p: 2,
            borderLeft:
              "1px solid #E5EAF2",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "13px",
              color: "#475569",
              lineHeight: multiline
                ? 1.7
                : 1.5,
              whiteSpace: multiline
                ? "normal"
                : "normal",
            }}
          >
            {renderValue(compound)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default CompoundComparison;