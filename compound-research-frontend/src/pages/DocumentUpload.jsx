import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useNavigate } from "react-router-dom";
import { documentService, compoundService } from "../services/api";

function DocumentUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [relatedCompoundId, setRelatedCompoundId] = useState("");
  const [compoundsList, setCompoundsList] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompounds();
  }, []);

  const loadCompounds = async () => {
    try {
      const res = await compoundService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setCompoundsList(res.data);
      }
    } catch (err) {
      console.error("Failed to load compounds for dropdown", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        // Default title to original filename without extension
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload (.txt, .pdf, or .docx).");
      return;
    }

    try {
      setUploading(true);
      setError("");
      await documentService.upload(
        file,
        title.trim() || file.name,
        relatedCompoundId ? Number(relatedCompoundId) : null
      );

      navigate("/documents");
    } catch (err) {
      setError(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/documents")}
        sx={{ mb: 2 }}
      >
        Back to Documents
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Upload Reference Document
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Upload research notes or papers. Plain text (.txt) files will be automatically parsed, chunked, and vector-indexed for AI RAG queries.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    bgcolor: "background.paper",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                  <Typography variant="h6">
                    {file ? file.name : "Click or drag & drop to choose a file"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported formats: .txt, .pdf, .docx (Max 10MB)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Document Title"
                  placeholder="e.g. Metformin Mechanism of Action Study"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Related Compound (Optional)</FormLabel>
                  <Select
                    value={relatedCompoundId}
                    onChange={(e) => setRelatedCompoundId(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>General / All Compounds</em>
                    </MenuItem>
                    {compoundsList.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name} ({c.molecularFormula || `CMP-${c.id}`})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Linking a compound restricts vector searches when asking about specific compounds.
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/documents")}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
                    disabled={uploading}
                  >
                    {uploading ? "Indexing & Uploading..." : "Upload & Index"}
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

export default DocumentUpload;
