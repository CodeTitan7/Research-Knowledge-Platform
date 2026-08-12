import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import SaveIcon from "@mui/icons-material/Save";

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
      console.error("Failed to load compounds:", err);
    }
  };

  const handleFileChange = (event) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const selectedFile = event.target.files[0];

    // 10 MB validation
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);

    // Automatically create a title from filename
    if (!title.trim()) {
      const nameWithoutExtension = selectedFile.name.replace(
        /\.[^/.]+$/,
        ""
      );

      setTitle(nameWithoutExtension);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError(
        "Please select a file to upload (.txt, .pdf, or .docx)."
      );
      return;
    }

    if (!title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      await documentService.upload(
        file,
        title.trim(),
        relatedCompoundId
          ? Number(relatedCompoundId)
          : null
      );

      navigate("/documents");
    } catch (err) {
      setError(
        err.message || "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        pb: 5,
      }}
    >
      {/* =====================================================
          BACK NAVIGATION
      ===================================================== */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/documents")}
        sx={{
          mb: 2.5,
          color: "#64748B",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#F1F5F9",
            color: "#1976D2",
          },
        }}
      >
        Back to Documents
      </Button>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: {
              xs: "1.8rem",
              md: "2.2rem",
            },
            fontWeight: 800,
            color: "#12355B",
            letterSpacing: "-0.5px",
          }}
        >
          Upload Reference Document
        </Typography>

        <Typography
          sx={{
            mt: 0.7,
            color: "#64748B",
            fontSize: "0.95rem",
            maxWidth: 800,
            lineHeight: 1.7,
          }}
        >
          Add research papers, notes, and supporting material
          to the knowledge base. Uploaded documents can be
          processed, chunked, and indexed for Catalyst's
          research queries.
        </Typography>
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
          MAIN UPLOAD CARD
      ===================================================== */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Top accent */}
        <Box
          sx={{
            height: 5,
            background:
              "linear-gradient(90deg, #1565C0, #42A5F5)",
          }}
        />

        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            {/* =================================================
                SECTION HEADER
            ================================================= */}

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
                  backgroundColor: "#E8F1FB",
                  color: "#1976D2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  Document Information
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  Add the document and connect it to the
                  research knowledge base.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* =================================================
                FILE UPLOAD AREA
            ================================================= */}

            <Box sx={{ mb: 3 }}>
              <FormLabel
                sx={{
                  display: "block",
                  mb: 1.2,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                Reference File
              </FormLabel>

              <Box
                component="label"
                sx={{
                  display: "block",
                  border: "2px dashed",
                  borderColor: file
                    ? "#90CAF9"
                    : "#CBD5E1",
                  borderRadius: 3,
                  backgroundColor: file
                    ? "#F8FBFF"
                    : "#FAFCFE",
                  cursor: uploading
                    ? "default"
                    : "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": uploading
                    ? {}
                    : {
                        borderColor: "#1976D2",
                        backgroundColor: "#F5F9FE",
                      },
                }}
              >
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileChange}
                  disabled={uploading}
                  style={{
                    display: "none",
                  }}
                />

                <Box
                  sx={{
                    textAlign: "center",
                    py: {
                      xs: 4,
                      md: 5,
                    },
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      backgroundColor: "#E8F1FB",
                      color: "#1976D2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CloudUploadIcon
                      sx={{
                        fontSize: 30,
                      }}
                    />
                  </Box>

                  {file ? (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#12355B",
                          fontSize: "1rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {file.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Chip
                          label={`${(
                            file.size /
                            (1024 * 1024)
                          ).toFixed(2)} MB`}
                          size="small"
                          sx={{
                            backgroundColor:
                              "#E8F1FB",
                            color: "#1565C0",
                            fontWeight: 600,
                          }}
                        />

                        <Chip
                          label="Selected"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          mt: 1.5,
                        }}
                      >
                        Click to choose a different file
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#334155",
                          fontSize: "1rem",
                        }}
                      >
                        Choose a research document
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          mt: 0.7,
                        }}
                      >
                        Click here to browse your computer
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#94A3B8",
                          mt: 1.5,
                        }}
                      >
                        Supported formats: .TXT, .PDF,
                        .DOCX • Maximum size: 10 MB
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* =================================================
                TITLE + COMPOUND
            ================================================= */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 3,
              }}
            >
              {/* Document title */}

              <TextField
                fullWidth
                label="Document Title"
                placeholder="e.g. Metformin Mechanism of Action Study"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                disabled={uploading}
                required
              />

              {/* Related compound */}

              <FormControl
                fullWidth
                disabled={uploading}
              >
                <FormLabel
                  sx={{
                    mb: 1,
                    color: "#334155",
                  }}
                >
                  Related Compound
                </FormLabel>

                <Select
                  value={relatedCompoundId}
                  onChange={(event) =>
                    setRelatedCompoundId(
                      event.target.value
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>General / All Compounds</em>
                  </MenuItem>

                  {compoundsList.map((compound) => (
                    <MenuItem
                      key={compound.id}
                      value={compound.id}
                    >
                      {compound.name}{" "}
                      {compound.molecularFormula
                        ? `(${compound.molecularFormula})`
                        : `(CMP-${compound.id})`}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>
                  Link this document to a specific compound
                  for more focused research retrieval.
                </FormHelperText>
              </FormControl>
            </Box>

            {/* =================================================
                INDEXING INFORMATION
            ================================================= */}

            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 2.5,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <LinkIcon
                  sx={{
                    color: "#1976D2",
                    mt: 0.2,
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                      mb: 0.5,
                    }}
                  >
                    AI Knowledge Indexing
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748B",
                      lineHeight: 1.7,
                    }}
                  >
                    After upload, the document can be
                    processed into searchable evidence
                    chunks and vector embeddings. Catalyst
                    can then use these sources when answering
                    research questions.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/documents")
                }
                disabled={uploading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 2.5,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={uploading}
                startIcon={
                  uploading ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 2.5,
                  boxShadow:
                    "0 6px 16px rgba(25, 118, 210, 0.18)",
                }}
              >
                {uploading
                  ? "Indexing & Uploading..."
                  : "Upload & Index"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DocumentUpload;