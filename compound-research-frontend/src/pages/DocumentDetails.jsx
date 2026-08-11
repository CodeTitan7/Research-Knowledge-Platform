import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import ScienceIcon from "@mui/icons-material/Science";
import SmartToyIcon from "@mui/icons-material/SmartToy";

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
      setError(err.message || "Failed to load document details.");
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!document || error) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Document Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error || "The document you are looking for does not exist."}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/documents")}
        >
          Back to Documents
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/documents")}
        sx={{ mb: 2 }}
      >
        Back to Documents
      </Button>

      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {document.title}
              </Typography>
              <Typography color="text.secondary">
                File: {document.fileName} | Uploaded by: {document.uploadedByName || "System"} on {formatDate(document.uploadedAt)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            {document.relatedCompoundName && (
              <Chip
                icon={<ScienceIcon />}
                label={`Compound: ${document.relatedCompoundName}`}
                color="primary"
                variant="outlined"
              />
            )}
            <Chip
              label={`${document.chunksCount || document.chunks?.length || 0} Vector Chunks`}
              color="secondary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Extracted Chunks */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Indexed Text Chunks for RAG Vector Search
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            These chunk segments are embedded into high-dimensional vectors and searched when researchers submit queries to the AI Agent.
          </Typography>

          {!document.chunks || document.chunks.length === 0 ? (
            <Typography color="text.secondary">No text chunks extracted from this document.</Typography>
          ) : (
            document.chunks.map((chunk) => (
              <Paper key={chunk.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Chunk #{chunk.chunkIndex + 1} (ID: {chunk.id})
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {chunk.chunkText}
                </Typography>
              </Paper>
            ))
          )}
        </CardContent>
      </Card>

      {/* Action */}
      {document.relatedCompoundId && (
        <Button
          variant="contained"
          startIcon={<SmartToyIcon />}
          onClick={() => navigate(`/research?compound=${document.relatedCompoundId}`)}
        >
          Query AI Agent About This Compound
        </Button>
      )}
    </Box>
  );
}

export default DocumentDetails;
