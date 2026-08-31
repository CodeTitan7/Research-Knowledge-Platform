import React, { useState, useEffect, useMemo } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Paper,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScienceIcon from "@mui/icons-material/Science";
import FilterListIcon from "@mui/icons-material/FilterList";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";

import {
  compoundService,
  targetService,
  categoryService,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function Compounds() {
  const navigate = useNavigate();
  const { canEditContent } = useAuth();

  // ============================================================
  // DATA STATE
  // ============================================================

  const [compoundsList, setCompoundsList] = useState([]);
  const [targetsList, setTargetsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FILTER STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [targetFilter, setTargetFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ============================================================
  // COMPARISON STATE
  // ============================================================

  const [selectedCompoundIds, setSelectedCompoundIds] = useState([]);

  const MAX_COMPARISON_SELECTIONS = 3;
  const MIN_COMPARISON_SELECTIONS = 2;

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [compRes, targetRes, catRes] = await Promise.all([
        compoundService.getAll(),

        targetService
          .getAll()
          .catch(() => ({
            success: true,
            data: [],
          })),

        categoryService
          .getAll()
          .catch(() => ({
            success: true,
            data: [],
          })),
      ]);

      if (
        compRes.success &&
        Array.isArray(compRes.data)
      ) {
        setCompoundsList(compRes.data);
      }

      if (
        targetRes.success &&
        Array.isArray(targetRes.data)
      ) {
        setTargetsList(targetRes.data);
      }

      if (
        catRes.success &&
        Array.isArray(catRes.data)
      ) {
        setCategoriesList(catRes.data);
      }
    } catch (err) {
      setError(
        err.message || "Failed to load compounds."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TARGET OPTIONS
  // ============================================================

  const targetsOptions = useMemo(() => {
    const names = targetsList
      .map((target) => target.name)
      .filter(Boolean);

    return [
      "All",
      ...new Set(names),
    ];
  }, [targetsList]);

  // ============================================================
  // CATEGORY OPTIONS
  // ============================================================

  const categoriesOptions = useMemo(() => {
    const names = categoriesList
      .map((category) => category.name)
      .filter(Boolean);

    return [
      "All",
      ...new Set(names),
    ];
  }, [categoriesList]);

  // ============================================================
  // FILTER COMPOUNDS
  // ============================================================

  const filteredCompounds = useMemo(() => {
    return compoundsList.filter((compound) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        !search ||
        compound.name
          ?.toLowerCase()
          .includes(search) ||
        compound.synonym
          ?.toLowerCase()
          .includes(search) ||
        compound.molecularFormula
          ?.toLowerCase()
          .includes(search) ||
        compound.description
          ?.toLowerCase()
          .includes(search);

      const matchesTarget =
        targetFilter === "All" ||
        (
          Array.isArray(compound.targets) &&
          compound.targets.includes(targetFilter)
        );

      const matchesCategory =
        categoryFilter === "All" ||
        compound.categoryName === categoryFilter;

      return (
        matchesSearch &&
        matchesTarget &&
        matchesCategory
      );
    });
  }, [
    compoundsList,
    searchTerm,
    targetFilter,
    categoryFilter,
  ]);

  // ============================================================
  // SELECTED COMPOUND OBJECTS
  // ============================================================

  const selectedCompounds = useMemo(() => {
    return selectedCompoundIds
      .map((id) =>
        compoundsList.find(
          (compound) => compound.id === id
        )
      )
      .filter(Boolean);
  }, [
    selectedCompoundIds,
    compoundsList,
  ]);

  // ============================================================
  // TOGGLE COMPOUND SELECTION
  // ============================================================

  const handleCompoundSelection = (compoundId) => {
    setSelectedCompoundIds((prev) => {
      // Remove if already selected
      if (prev.includes(compoundId)) {
        return prev.filter(
          (id) => id !== compoundId
        );
      }

      // Prevent selecting more than 3
      if (
        prev.length >=
        MAX_COMPARISON_SELECTIONS
      ) {
        return prev;
      }

      return [
        ...prev,
        compoundId,
      ];
    });
  };

  // ============================================================
  // CHECK WHETHER COMPOUND IS SELECTED
  // ============================================================

  const isCompoundSelected = (compoundId) => {
    return selectedCompoundIds.includes(
      compoundId
    );
  };

  // ============================================================
  // REMOVE ONE COMPOUND FROM COMPARISON
  // ============================================================

  const removeFromComparison = (compoundId) => {
    setSelectedCompoundIds((prev) =>
      prev.filter(
        (id) => id !== compoundId
      )
    );
  };

  // ============================================================
  // CLEAR COMPARISON SELECTION
  // ============================================================

  const clearComparisonSelection = () => {
    setSelectedCompoundIds([]);
  };

  // ============================================================
  // OPEN COMPARISON PAGE
  // ============================================================

  const handleCompare = () => {
    if (
      selectedCompoundIds.length <
      MIN_COMPARISON_SELECTIONS
    ) {
      return;
    }

    const ids = encodeURIComponent(
      selectedCompoundIds.join(",")
    );

    navigate(
      `/compounds/compare?ids=${ids}`
    );
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearchTerm("");
    setTargetFilter("All");
    setCategoryFilter("All");
  };

  // ============================================================
  // ACTIVE FILTER STATE
  // ============================================================

  const hasActiveFilters =
    Boolean(searchTerm) ||
    targetFilter !== "All" ||
    categoryFilter !== "All";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box
      sx={{
        maxWidth: "1600px",
        mx: "auto",
      }}
    >

      {/* ===================================================== */}
      {/* PAGE HEADER */}
      {/* ===================================================== */}

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
              <ScienceIcon />
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
              Compounds
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
              maxWidth: 650,
            }}
          >
            Manage, search and explore compound
            records within the research knowledge base.
          </Typography>
        </Box>

        {/* ADD COMPOUND */}

        {canEditContent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              navigate("/compounds/add")
            }
            sx={{
              minHeight: 44,
              px: 2.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#2563EB",
              boxShadow:
                "0 4px 12px rgba(37, 99, 235, 0.20)",

              "&:hover": {
                backgroundColor: "#1D4ED8",
                boxShadow:
                  "0 6px 16px rgba(37, 99, 235, 0.25)",
              },
            }}
          >
            Add Compound
          </Button>
        )}
      </Box>

      {/* ===================================================== */}
      {/* ERROR */}
      {/* ===================================================== */}

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

      {/* ===================================================== */}
      {/* COMPARISON SELECTION PANEL */}
      {/* ===================================================== */}

      {selectedCompoundIds.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid #BFDBFE",
            backgroundColor: "#F8FBFF",
          }}
        >
          <CardContent
            sx={{
              py: 2.2,
              px: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {/* Panel Header */}

            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                justifyContent: "space-between",
                gap: 2,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#E0EDFF",
                    color: "#2563EB",
                  }}
                >
                  <CompareArrowsIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#172033",
                    }}
                  >
                    Compound Comparison
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#64748B",
                      mt: 0.3,
                    }}
                  >
                    Select 2–3 compounds to compare
                    their scientific properties.
                  </Typography>
                </Box>
              </Box>

              {/* Selected Counter */}

              <Chip
                label={`${selectedCompoundIds.length}/${MAX_COMPARISON_SELECTIONS} selected`}
                size="small"
                sx={{
                  backgroundColor: "#EFF6FF",
                  color: "#2563EB",
                  fontWeight: 700,
                  borderRadius: 1.5,
                }}
              />
            </Box>

            {/* Selected Compounds */}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 2,
              }}
            >
              {selectedCompounds.map(
                (compound) => (
                  <Chip
                    key={compound.id}
                    label={compound.name}
                    onDelete={() =>
                      removeFromComparison(
                        compound.id
                      )
                    }
                    deleteIcon={<CloseIcon />}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      border:
                        "1px solid #BFDBFE",
                      color: "#2563EB",
                      fontWeight: 600,
                      borderRadius: 1.5,

                      "& .MuiChip-deleteIcon": {
                        color: "#64748B",
                        fontSize: 17,

                        "&:hover": {
                          color: "#DC2626",
                        },
                      },
                    }}
                  />
                )
              )}
            </Box>

            {/* Actions */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="text"
                onClick={
                  clearComparisonSelection
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#64748B",
                }}
              >
                Clear Selection
              </Button>

              <Tooltip
                title={
                  selectedCompoundIds.length <
                  MIN_COMPARISON_SELECTIONS
                    ? "Select at least 2 compounds"
                    : ""
                }
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={
                      <CompareArrowsIcon />
                    }
                    disabled={
                      selectedCompoundIds.length <
                      MIN_COMPARISON_SELECTIONS
                    }
                    onClick={handleCompare}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      backgroundColor: "#2563EB",
                      boxShadow:
                        "0 4px 12px rgba(37, 99, 235, 0.18)",

                      "&:hover": {
                        backgroundColor: "#1D4ED8",
                      },

                      "&.Mui-disabled": {
                        backgroundColor: "#CBD5E1",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    Compare Selected
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ===================================================== */}
      {/* SEARCH / FILTER PANEL */}
      {/* ===================================================== */}

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2.5,
            }}
          >
            <FilterListIcon
              sx={{
                color: "#2563EB",
                fontSize: 21,
              }}
            />

            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Search & Filter
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md:
                  "minmax(280px, 1.5fr) minmax(180px, 0.8fr) minmax(180px, 0.8fr) auto",
              },
              gap: 2,
              alignItems: "center",
            }}
          >

            {/* SEARCH */}

            <TextField
              fullWidth
              label="Search compounds"
              placeholder="Name, synonym, formula or description"
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#FAFBFD",
                },
              }}
            />

            {/* TARGET */}

            <FormControl fullWidth>
              <InputLabel>
                Target
              </InputLabel>

              <Select
                value={targetFilter}
                label="Target"
                onChange={(e) =>
                  setTargetFilter(
                    e.target.value
                  )
                }
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#FAFBFD",
                }}
              >
                {targetsOptions.map(
                  (target) => (
                    <MenuItem
                      key={target}
                      value={target}
                    >
                      {target}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* CATEGORY */}

            <FormControl fullWidth>
              <InputLabel>
                Category
              </InputLabel>

              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#FAFBFD",
                }}
              >
                {categoriesOptions.map(
                  (category) => (
                    <MenuItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* CLEAR FILTERS */}

            {hasActiveFilters && (
              <Button
                variant="text"
                onClick={clearFilters}
                sx={{
                  height: 44,
                  whiteSpace: "nowrap",
                  textTransform: "none",
                  color: "#2563EB",
                  fontWeight: 600,
                }}
              >
                Clear filters
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ===================================================== */}
      {/* COMPOUND RECORDS */}
      {/* ===================================================== */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #E5EAF2",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >

        {/* TABLE HEADER */}

        <Box
          sx={{
            px: {
              xs: 2,
              md: 3,
            },
            py: 2.2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom:
              "1px solid #E5EAF2",
            backgroundColor: "#FFFFFF",
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
              Compound Records
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#94A3B8",
                mt: 0.4,
              }}
            >
              Research compounds currently
              available in the knowledge base
            </Typography>
          </Box>

          <Chip
            label={`${filteredCompounds.length} ${
              filteredCompounds.length === 1
                ? "result"
                : "results"
            }`}
            size="small"
            sx={{
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          />
        </Box>

        {/* LOADING */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 9,
            }}
          >
            <CircularProgress
              size={32}
              thickness={4}
            />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 0,
            }}
          >
            <Table
              sx={{
                minWidth: 1000,
              }}
            >

              {/* TABLE HEAD */}

              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#F8FAFC",
                  }}
                >

                  {/* COMPARE */}

                  <TableCell
                    sx={{
                      width: 80,
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Compare
                  </TableCell>

                  {/* COMPOUND */}

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.5px",
                      py: 1.8,
                    }}
                  >
                    Compound
                  </TableCell>

                  {/* FORMULA */}

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Formula / Synonym
                  </TableCell>

                  {/* TARGETS */}

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Targets
                  </TableCell>

                  {/* CATEGORY */}

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Category
                  </TableCell>

                  {/* ACTION */}

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Action
                  </TableCell>

                </TableRow>
              </TableHead>

              {/* TABLE BODY */}

              <TableBody>
                {filteredCompounds.map(
                  (compound) => {
                    const selected =
                      isCompoundSelected(
                        compound.id
                      );

                    const maximumReached =
                      selectedCompoundIds.length >=
                      MAX_COMPARISON_SELECTIONS;

                    return (
                      <TableRow
                        key={compound.id}
                        hover
                        selected={selected}
                        sx={{
                          transition:
                            "background-color 0.15s ease",

                          "&:hover": {
                            backgroundColor:
                              "#F8FBFF",
                          },

                          "&.Mui-selected": {
                            backgroundColor:
                              "#F0F7FF",
                          },

                          "&.Mui-selected:hover": {
                            backgroundColor:
                              "#EAF4FF",
                          },

                          "&:last-child td": {
                            borderBottom: 0,
                          },
                        }}
                      >

                        {/* COMPARE CHECKBOX */}

                        <TableCell
                          sx={{
                            py: 2,
                          }}
                        >
                          <Tooltip
                            title={
                              maximumReached &&
                              !selected
                                ? "Maximum of 3 compounds can be compared"
                                : "Select for comparison"
                            }
                          >
                            <span>
                              <Checkbox
                                checked={selected}
                                disabled={
                                  maximumReached &&
                                  !selected
                                }
                                onChange={() =>
                                  handleCompoundSelection(
                                    compound.id
                                  )
                                }
                                sx={{
                                  color:
                                    "#94A3B8",

                                  "&.Mui-checked": {
                                    color:
                                      "#2563EB",
                                  },
                                }}
                              />
                            </span>
                          </Tooltip>
                        </TableCell>

                        {/* COMPOUND */}

                        <TableCell
                          sx={{
                            py: 2.2,
                            maxWidth: 320,
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
                              fontSize: "12px",
                              color: "#7A8799",
                              mt: 0.5,
                              lineHeight: 1.5,
                            }}
                          >
                            {compound.description ||
                              "No description available."}
                          </Typography>
                        </TableCell>

                        {/* FORMULA / SYNONYM */}

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#475569",
                            }}
                          >
                            {compound.molecularFormula ||
                              compound.synonym ||
                              "-"}
                          </Typography>

                          {compound.molecularFormula &&
                            compound.synonym && (
                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  color: "#94A3B8",
                                  mt: 0.4,
                                }}
                              >
                                {compound.synonym}
                              </Typography>
                            )}
                        </TableCell>

                        {/* TARGETS */}

                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.7,
                              flexWrap: "wrap",
                              maxWidth: 250,
                            }}
                          >
                            {Array.isArray(
                              compound.targets
                            ) &&
                            compound.targets.length >
                              0 ? (
                              compound.targets.map(
                                (target) => (
                                  <Chip
                                    key={target}
                                    label={target}
                                    size="small"
                                    sx={{
                                      backgroundColor:
                                        "#EFF6FF",
                                      color:
                                        "#2563EB",
                                      fontWeight: 500,
                                      borderRadius:
                                        1.5,
                                      fontSize:
                                        "11px",
                                    }}
                                  />
                                )
                              )
                            ) : (
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: "#94A3B8",
                                }}
                              >
                                No targets
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        {/* CATEGORY */}

                        <TableCell>
                          {compound.categoryName ? (
                            <Chip
                              label={
                                compound.categoryName
                              }
                              size="small"
                              variant="outlined"
                              sx={{
                                color:
                                  "#475569",
                                borderColor:
                                  "#CBD5E1",
                                backgroundColor:
                                  "#FFFFFF",
                                fontSize:
                                  "11px",
                                fontWeight: 500,
                              }}
                            />
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#94A3B8",
                              }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>

                        {/* ACTION */}

                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                              <VisibilityIcon
                                sx={{
                                  fontSize: 17,
                                }}
                              />
                            }
                            onClick={() =>
                              navigate(
                                `/compounds/${compound.id}`
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
                              px: 1.5,

                              "&:hover": {
                                borderColor:
                                  "#2563EB",
                                backgroundColor:
                                  "#EFF6FF",
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>

                      </TableRow>
                    );
                  }
                )}

                {/* ================================================= */}
                {/* EMPTY STATE */}
                {/* ================================================= */}

                {filteredCompounds.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                    >
                      <Box
                        sx={{
                          py: 8,
                          px: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            mx: "auto",
                            mb: 2,
                            borderRadius:
                              "50%",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            backgroundColor:
                              "#F1F5F9",
                            color:
                              "#94A3B8",
                          }}
                        >
                          <ScienceIcon />
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "15px",
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
                          Try changing your
                          search terms or
                          filters.
                        </Typography>

                        {hasActiveFilters && (
                          <Button
                            onClick={
                              clearFilters
                            }
                            sx={{
                              mt: 2,
                              textTransform:
                                "none",
                              fontWeight:
                                600,
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* ===================================================== */}
      {/* COMPARISON INFORMATION */}
      {/* ===================================================== */}

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            color: "#94A3B8",
          }}
        >
          Select 2–3 compounds to compare their
          scientific properties, targets and
          classification.
        </Typography>

        {selectedCompoundIds.length > 0 && (
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#2563EB",
            }}
          >
            {selectedCompoundIds.length}/
            {MAX_COMPARISON_SELECTIONS} selected
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Compounds;