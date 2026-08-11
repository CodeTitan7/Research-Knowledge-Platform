import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
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
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import { documentService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Documents() {
  const navigate = useNavigate();
  const { userRole, canEditContent, canDeleteContent } = useAuth();

  const [documentsList, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await documentService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setDocumentsList(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load reference documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await documentService.delete(id);
        fetchDocuments();
      } catch (err) {
        setError(err.message || "Failed to delete document.");
      }
    }
  };

  const filteredDocuments = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return documentsList.filter((doc) => {
      return (
        doc.title?.toLowerCase().includes(search) ||
        doc.fileName?.toLowerCase().includes(search) ||
        doc.relatedCompoundName?.toLowerCase().includes(search)
      );
    });
  }, [documentsList, searchTerm]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Reference Documents
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage and upload research documents indexed for AI RAG search.
          </Typography>
        </Box>

        {canEditContent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/documents/upload")}
          >
            Upload Document
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Search documents"
            placeholder="Search by document title, file name, or related compound"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        </CardContent>
      </Card>

      {/* Documents table */}
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
              Research Documents
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {filteredDocuments.length} documents
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
                    <TableCell><strong>Document Title</strong></TableCell>
                    <TableCell><strong>File Name</strong></TableCell>
                    <TableCell><strong>Uploaded Date</strong></TableCell>
                    <TableCell><strong>Related Compound</strong></TableCell>
                    <TableCell><strong>Uploaded By</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <DescriptionIcon color="primary" />
                          <Typography fontWeight="bold">
                            {doc.title}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>{doc.fileName}</TableCell>
                      <TableCell>{formatDate(doc.uploadedAt)}</TableCell>

                      <TableCell>
                        {doc.relatedCompoundName ? (
                          <Chip label={doc.relatedCompoundName} size="small" variant="outlined" color="primary" />
                        ) : (
                          <Typography variant="caption" color="text.secondary">General</Typography>
                        )}
                      </TableCell>

                      <TableCell>{doc.uploadedByName || "System"}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {canDeleteContent && (
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          No documents found.
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

export default Documents;
