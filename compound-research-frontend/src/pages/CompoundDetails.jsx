import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionIcon from "@mui/icons-material/Description";

import { useNavigate, useParams } from "react-router-dom";
import { compoundService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function CompoundDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userRole, canEditContent, canDeleteContent } = useAuth();

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
    if (window.confirm("Are you sure you want to delete this compound?")) {
      try {
        await compoundService.delete(id);
        navigate("/compounds");
      } catch (err) {
        setError(err.message || "Failed to delete compound.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!compound || error) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Compound Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error || "The compound you are looking for does not exist in the current knowledge base."}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/compounds")}
        >
          Back to Compounds
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/compounds")}
        sx={{ mb: 2 }}
      >
        Back to Compounds
      </Button>

      {/* Compound Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {compound.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Formula / Synonym: {compound.molecularFormula || compound.synonym || `CMP-${String(compound.id).padStart(3, '0')}`}
              </Typography>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {canEditContent && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/compounds/${compound.id}/edit`)}
                >
                  Edit
                </Button>
              )}

              {canDeleteContent && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Remove Record
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main information */}
      <Grid container spacing={3}>
        {/* Description */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Description
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {compound.description || "No description provided."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Targets */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Associated Targets
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {compound.targets && compound.targets.length > 0 ? (
                  compound.targets.map((target) => (
                    <Chip key={target} label={target} color="primary" />
                  ))
                ) : (
                  <Typography color="text.secondary">No targets linked yet.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Category
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {compound.categoryName ? (
                  <Chip label={compound.categoryName} variant="outlined" color="secondary" />
                ) : (
                  <Typography color="text.secondary">Uncategorized</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <DescriptionIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Reference Documents
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Explore indexed research documents and vector chunks.
              </Typography>
              <Button variant="outlined" onClick={() => navigate("/documents")}>
                View Documents
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Research AI */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <SmartToyIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Research AI Agent
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Ask AI questions about {compound.name} based on the vector knowledge base.
              </Typography>
              <Button
                variant="contained"
                startIcon={<SmartToyIcon />}
                onClick={() => navigate(`/research?compound=${compound.id}`)}
              >
                Ask About {compound.name}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CompoundDetails;
