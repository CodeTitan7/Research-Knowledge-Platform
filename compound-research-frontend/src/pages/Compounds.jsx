import React, { useState, useEffect, useMemo } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScienceIcon from "@mui/icons-material/Science";
import FilterListIcon from "@mui/icons-material/FilterList";

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

  const [compoundsList, setCompoundsList] = useState([]);
  const [targetsList, setTargetsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [targetFilter, setTargetFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

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
          .catch(() => ({ success: true, data: [] })),
        categoryService
          .getAll()
          .catch(() => ({ success: true, data: [] })),
      ]);

      if (compRes.success && Array.isArray(compRes.data)) {
        setCompoundsList(compRes.data);
      }

      if (targetRes.success && Array.isArray(targetRes.data)) {
        setTargetsList(targetRes.data);
      }

      if (catRes.success && Array.isArray(catRes.data)) {
        setCategoriesList(catRes.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load compounds.");
    } finally {
      setLoading(false);
    }
  };

  const targetsOptions = useMemo(() => {
    const names = targetsList
      .map((t) => t.name)
      .filter(Boolean);

    return ["All", ...new Set(names)];
  }, [targetsList]);

  const categoriesOptions = useMemo(() => {
    const names = categoriesList
      .map((c) => c.name)
      .filter(Boolean);

    return ["All", ...new Set(names)];
  }, [categoriesList]);

  const filteredCompounds = useMemo(() => {
    return compoundsList.filter((compound) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        compound.name?.toLowerCase().includes(search) ||
        compound.synonym?.toLowerCase().includes(search) ||
        compound.molecularFormula
          ?.toLowerCase()
          .includes(search) ||
        compound.description?.toLowerCase().includes(search);

      const matchesTarget =
        targetFilter === "All" ||
        (compound.targets &&
          compound.targets.includes(targetFilter));

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

  const clearFilters = () => {
    setSearchTerm("");
    setTargetFilter("All");
    setCategoryFilter("All");
  };

  const hasActiveFilters =
    searchTerm ||
    targetFilter !== "All" ||
    categoryFilter !== "All";

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
            Manage, search and explore compound records
            within the research knowledge base.
          </Typography>
        </Box>

        {canEditContent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/compounds/add")}
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
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                md: "minmax(280px, 1.5fr) minmax(180px, 0.8fr) minmax(180px, 0.8fr) auto",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* Search */}
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

            {/* Target */}
            <FormControl fullWidth>
              <InputLabel>Target</InputLabel>

              <Select
                value={targetFilter}
                label="Target"
                onChange={(e) =>
                  setTargetFilter(e.target.value)
                }
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#FAFBFD",
                }}
              >
                {targetsOptions.map((target) => (
                  <MenuItem
                    key={target}
                    value={target}
                  >
                    {target}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>

              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#FAFBFD",
                }}
              >
                {categoriesOptions.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear filters */}
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
        {/* Table Header */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E5EAF2",
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
              Research compounds currently available
              in the knowledge base
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

        {/* Loading */}
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
                minWidth: 900,
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      py: 1.8,
                    }}
                  >
                    Compound
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Formula / Synonym
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Targets
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Category
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCompounds.map((compound) => (
                  <TableRow
                    key={compound.id}
                    hover
                    sx={{
                      transition:
                        "background-color 0.15s ease",

                      "&:hover": {
                        backgroundColor: "#F8FBFF",
                      },

                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* Compound */}
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

                    {/* Formula / Synonym */}
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
                    </TableCell>

                    {/* Targets */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.7,
                          flexWrap: "wrap",
                          maxWidth: 250,
                        }}
                      >
                        {compound.targets &&
                        compound.targets.length > 0 ? (
                          compound.targets.map(
                            (target) => (
                              <Chip
                                key={target}
                                label={target}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    "#EFF6FF",
                                  color: "#2563EB",
                                  fontWeight: 500,
                                  borderRadius: 1.5,
                                  fontSize: "11px",
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

                    {/* Category */}
                    <TableCell>
                      {compound.categoryName ? (
                        <Chip
                          label={compound.categoryName}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "#475569",
                            borderColor: "#CBD5E1",
                            backgroundColor: "#FFFFFF",
                            fontSize: "11px",
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

                    {/* Action */}
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          <VisibilityIcon
                            sx={{ fontSize: 17 }}
                          />
                        }
                        onClick={() =>
                          navigate(
                            `/compounds/${compound.id}`
                          )
                        }
                        sx={{
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          color: "#2563EB",
                          borderColor: "#BFDBFE",
                          px: 1.5,

                          "&:hover": {
                            borderColor: "#2563EB",
                            backgroundColor:
                              "#EFF6FF",
                          },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Empty state */}
                {filteredCompounds.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              "#F1F5F9",
                            color: "#94A3B8",
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
                          Try changing your search
                          terms or filters.
                        </Typography>

                        {hasActiveFilters && (
                          <Button
                            onClick={clearFilters}
                            sx={{
                              mt: 2,
                              textTransform:
                                "none",
                              fontWeight: 600,
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
    </Box>
  );
}

export default Compounds;