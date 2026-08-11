import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useNavigate, useParams } from "react-router-dom";
import { compoundService, targetService, categoryService } from "../services/api";

function CompoundForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [synonym, setSynonym] = useState("");
  const [molecularFormula, setMolecularFormula] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTargetIds, setSelectedTargetIds] = useState([]);

  const [availableTargets, setAvailableTargets] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMetaData();
    if (isEditMode) {
      loadCompoundData();
    }
  }, [id]);

  const loadMetaData = async () => {
    try {
      const [targetRes, catRes] = await Promise.all([
        targetService.getAll().catch(() => ({ success: true, data: [] })),
        categoryService.getAll().catch(() => ({ success: true, data: [] })),
      ]);

      if (targetRes.success && Array.isArray(targetRes.data)) {
        setAvailableTargets(targetRes.data);
      }
      if (catRes.success && Array.isArray(catRes.data)) {
        setAvailableCategories(catRes.data);
      }
    } catch (err) {
      console.error("Error loading targets/categories", err);
    }
  };

  const loadCompoundData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await compoundService.getById(id);
      if (res.success && res.data) {
        const c = res.data;
        setName(c.name || "");
        setSynonym(c.synonym || "");
        setMolecularFormula(c.molecularFormula || "");
        setDescription(c.description || "");
      }
    } catch (err) {
      setError(err.message || "Failed to load compound data for editing.");
    } finally {
      setLoading(false);
    }
  };

  const handleTargetToggle = (targetId) => {
    setSelectedTargetIds((prev) =>
      prev.includes(targetId) ? prev.filter((tid) => tid !== targetId) : [...prev, targetId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Compound name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: name.trim(),
        synonym: synonym.trim() || null,
        description: description.trim() || null,
        molecularFormula: molecularFormula.trim() || null,
        categoryId: selectedCategoryId ? Number(selectedCategoryId) : null,
        targetIds: selectedTargetIds,
      };

      if (isEditMode) {
        await compoundService.update(id, payload);
      } else {
        await compoundService.create(payload);
      }

      navigate("/compounds");
    } catch (err) {
      setError(err.message || "Failed to save compound.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(isEditMode ? `/compounds/${id}` : "/compounds")}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isEditMode ? "Edit Compound" : "Add Compound"}
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {isEditMode
          ? "Update the compound details in the research platform."
          : "Register a new compound into the knowledge base."}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Compound Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Molecular Formula"
                  placeholder="e.g. C29H31N7O"
                  value={molecularFormula}
                  onChange={(e) => setMolecularFormula(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Synonym / Trade Name"
                  placeholder="e.g. Dimethylbiguanide"
                  value={synonym}
                  onChange={(e) => setSynonym(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Category</FormLabel>
                  <Select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>None / Unassigned</em>
                    </MenuItem>
                    {availableCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description / Research Summary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              {availableTargets.length > 0 && (
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1 }}>
                      Biological Targets
                    </FormLabel>
                    <FormGroup row>
                      {availableTargets.map((target) => (
                        <FormControlLabel
                          key={target.id}
                          control={
                            <Checkbox
                              checked={selectedTargetIds.includes(target.id)}
                              onChange={() => handleTargetToggle(target.id)}
                            />
                          }
                          label={target.name}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(isEditMode ? `/compounds/${id}` : "/compounds")}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    disabled={submitting}
                  >
                    {isEditMode ? "Save Changes" : "Create Compound"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CompoundForm;
