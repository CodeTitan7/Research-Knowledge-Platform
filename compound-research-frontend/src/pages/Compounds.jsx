import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { compoundService, targetService, categoryService } from "../services/api";
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
        targetService.getAll().catch(() => ({ success: true, data: [] })),
        categoryService.getAll().catch(() => ({ success: true, data: [] })),
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
    const names = targetsList.map((t) => t.name);
    return ["All", ...new Set(names)];
  }, [targetsList]);

  const categoriesOptions = useMemo(() => {
    const names = categoriesList.map((c) => c.name);
    return ["All", ...new Set(names)];
  }, [categoriesList]);

  const filteredCompounds = useMemo(() => {
    return compoundsList.filter((compound) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        compound.name?.toLowerCase().includes(search) ||
        compound.synonym?.toLowerCase().includes(search) ||
        compound.molecularFormula?.toLowerCase().includes(search);

      const matchesTarget =
        targetFilter === "All" ||
        (compound.targets && compound.targets.includes(targetFilter));

      const matchesCategory =
        categoryFilter === "All" ||
        compound.categoryName === categoryFilter;

      return matchesSearch && matchesTarget && matchesCategory;
    });
  }, [compoundsList, searchTerm, targetFilter, categoryFilter]);

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Compounds
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage and explore compound records in the knowledge platform.
          </Typography>
        </Box>

        {canEditContent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/compounds/add")}
          >
            Add Compound
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Search and filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Search & Filter
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Search by name, synonym or formula"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{ minWidth: 280, flexGrow: 1 }}
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Target</InputLabel>
              <Select
                value={targetFilter}
                label="Target"
                onChange={(e) => setTargetFilter(e.target.value)}
              >
                {targetsOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categoriesOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Compound Records
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {filteredCompounds.length} results
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Compound</strong></TableCell>
                    <TableCell><strong>Formula / Synonym</strong></TableCell>
                    <TableCell><strong>Targets</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredCompounds.map((compound) => (
                    <TableRow key={compound.id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {compound.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {compound.description}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {compound.molecularFormula || compound.synonym || "-"}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {compound.targets && compound.targets.length > 0 ? (
                            compound.targets.map((t) => (
                              <Chip key={t} label={t} size="small" />
                            ))
                          ) : (
                            <Typography variant="caption" color="text.secondary">None</Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        {compound.categoryName ? (
                          <Chip label={compound.categoryName} size="small" variant="outlined" />
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/compounds/${compound.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredCompounds.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          No compounds found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Compounds;