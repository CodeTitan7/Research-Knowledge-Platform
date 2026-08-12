import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { useNavigate } from "react-router-dom";
import { documentService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Documents() {
  const navigate = useNavigate();
  const { canEditContent, canDeleteContent } = useAuth();

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
        setError("");

        await documentService.delete(id);

        fetchDocuments();
      } catch (err) {
        setError(err.message || "Failed to delete document.");
      }
    }
  };

  const filteredDocuments = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

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
    <Box
      sx={{
        width: "100%",
        pb: 4,
      }}
    >
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 4,
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
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
                background:
                  "linear-gradient(135deg, rgba(25,118,210,0.14), rgba(25,118,210,0.05))",
                color: "primary.main",
              }}
            >
              <DescriptionOutlinedIcon />
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "1.8rem", md: "2.15rem" },
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "#102A43",
              }}
            >
              Reference Documents
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#6B7C93",
              fontSize: "0.95rem",
              maxWidth: 650,
              lineHeight: 1.7,
            }}
          >
            Manage and explore research documents indexed for AI-powered
            knowledge retrieval and RAG search.
          </Typography>
        </Box>

        {canEditContent && (
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => navigate("/documents/upload")}
            sx={{
              px: 2.5,
              py: 1.25,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 6px 18px rgba(25,118,210,0.20)",
              "&:hover": {
                boxShadow: "0 8px 22px rgba(25,118,210,0.28)",
              },
            }}
          >
            Upload Document
          </Button>
        )}
      </Box>

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
          SEARCH PANEL
      ========================================================= */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid #E4ECF5",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 18px rgba(16,42,67,0.04)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <SearchIcon
              sx={{
                color: "primary.main",
                fontSize: 22,
              }}
            />

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#102A43",
              }}
            >
              Search Research Library
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Search by document title, file name, or related compound..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8A9BAD" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F8FAFD",

                "& fieldset": {
                  borderColor: "#DCE6F0",
                },

                "&:hover fieldset": {
                  borderColor: "#90CAF9",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                  borderWidth: 1,
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* =========================================================
          DOCUMENTS CARD
      ========================================================= */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E4ECF5",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 20px rgba(16,42,67,0.05)",
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: 0,
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              px: { xs: 2.5, md: 3 },
              py: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #E8EEF5",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 750,
                  color: "#102A43",
                }}
              >
                Research Documents
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: "0.82rem",
                  color: "#7B8B9A",
                }}
              >
                Reference material available to the research knowledge base
              </Typography>
            </Box>

            <Chip
              label={`${filteredDocuments.length} ${
                filteredDocuments.length === 1 ? "document" : "documents"
              }`}
              size="small"
              sx={{
                backgroundColor: "#EAF3FF",
                color: "#1565C0",
                fontWeight: 700,
                borderRadius: 1.5,
              }}
            />
          </Box>

          {/* Loading */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                py: 9,
                gap: 2,
              }}
            >
              <CircularProgress size={34} />

              <Typography
                sx={{
                  color: "#7B8B9A",
                  fontSize: "0.9rem",
                }}
              >
                Loading research documents...
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#F8FAFD",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#52667A",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        py: 1.8,
                      }}
                    >
                      Document
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#52667A",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      File Name
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#52667A",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Uploaded
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#52667A",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Related Compound
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#52667A",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Uploaded By
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 800,
                        color: "#52667A",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      hover
                      sx={{
                        transition: "background-color 0.2s ease",

                        "&:hover": {
                          backgroundColor: "#F8FBFF",
                        },

                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      {/* Document */}
                      <TableCell sx={{ py: 2.2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 200,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              minWidth: 40,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#EAF3FF",
                              color: "#1976D2",
                            }}
                          >
                            <DescriptionOutlinedIcon fontSize="small" />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#102A43",
                                fontSize: "0.92rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 260,
                              }}
                            >
                              {doc.title || "Untitled Document"}
                            </Typography>

                            <Typography
                              sx={{
                                color: "#8292A6",
                                fontSize: "0.75rem",
                                mt: 0.25,
                              }}
                            >
                              Research reference
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* File name */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "#52667A",
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.fileName || "-"}
                        </Typography>
                      </TableCell>

                      {/* Uploaded date */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "#52667A",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(doc.uploadedAt)}
                        </Typography>
                      </TableCell>

                      {/* Related compound */}
                      <TableCell>
                        {doc.relatedCompoundName ? (
                          <Chip
                            label={doc.relatedCompoundName}
                            size="small"
                            sx={{
                              backgroundColor: "#EAF3FF",
                              color: "#1565C0",
                              fontWeight: 600,
                              borderRadius: 1.5,
                              maxWidth: 180,
                            }}
                          />
                        ) : (
                          <Chip
                            label="General"
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "#718096",
                              borderColor: "#D8E1EA",
                              borderRadius: 1.5,
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Uploaded by */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "#52667A",
                          }}
                        >
                          {doc.uploadedByName || "System"}
                        </Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="View document">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(`/documents/${doc.id}`)
                              }
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                backgroundColor: "#F0F7FF",

                                "&:hover": {
                                  backgroundColor: "#DCEEFF",
                                },
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {canDeleteContent && (
                            <Tooltip title="Delete document">
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(doc.id)}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 1.5,

                                  "&:hover": {
                                    backgroundColor: "#FFF1F1",
                                  },
                                }}
                              >
                               <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Empty state */}
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box
                          sx={{
                            py: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#F0F6FC",
                              color: "#90A4B8",
                              mb: 2,
                            }}
                          >
                            <DescriptionOutlinedIcon sx={{ fontSize: 30 }} />
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#34495E",
                              mb: 0.5,
                            }}
                          >
                            No documents found
                          </Typography>

                          <Typography
                            sx={{
                              color: "#8493A5",
                              fontSize: "0.85rem",
                              textAlign: "center",
                              maxWidth: 400,
                            }}
                          >
                            {searchTerm
                              ? "Try changing your search terms or clearing the search."
                              : "There are currently no reference documents in the knowledge base."}
                          </Typography>

                          {searchTerm && (
                            <Button
                              size="small"
                              onClick={() => setSearchTerm("")}
                              sx={{
                                mt: 2,
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              Clear Search
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
        </CardContent>
      </Card>
    </Box>
  );
}

export default Documents;