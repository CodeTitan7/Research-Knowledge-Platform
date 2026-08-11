import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import ScienceIcon from "@mui/icons-material/Science";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useSearchParams } from "react-router-dom";
import { researchService } from "../services/api";

function Research() {
  const [searchParams] = useSearchParams();
  const compoundId = searchParams.get("compound");
  const documentId = searchParams.get("document");

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a research question.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const res = await researchService.ask(question.trim(), compoundId);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to query the Research AI Agent.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <Box>
      {/* Page heading */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SmartToyIcon
            color="primary"
            sx={{ fontSize: 32 }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            AI Research Assistant
          </Typography>
        </Box>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Ask questions using vector-indexed research documents and grounded AI generation.
        </Typography>
      </Box>

      {/* Context information */}
      {(compoundId || documentId) && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
        >
          {compoundId && (
            <>
              Narrowing search scope to compound{" "}
              <strong>#{compoundId}</strong>.
            </>
          )}
          {documentId && (
            <>
              {" "}Focused on document <strong>#{documentId}</strong>.
            </>
          )}
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Question section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                Ask a Research Question
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Queries embed your prompt and perform vector similarity search against uploaded reference documents, grounding the response strictly in real evidence.
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Example: How does Metformin lower blood sugar and activate AMPK?"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleKeyDown}
                error={Boolean(error)}
                helperText="Press Enter to submit question."
                disabled={loading}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <SendIcon />
                    )
                  }
                  onClick={handleAsk}
                  disabled={loading}
                >
                  {loading ? "RAG Vector Searching..." : "Ask Research AI"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Loading state */}
        {loading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgress />
                  <Box>
                    <Typography fontWeight="bold">
                      Searching knowledge base & generating AI response...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Computing embeddings, calculating cosine similarities, and retrieving evidence chunks.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Answer */}
        {result && !loading && (
          <>
            <Grid item xs={12} md={7}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SmartToyIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        AI Grounded Answer
                      </Typography>
                    </Box>

                    <Chip
                      icon={result.hasSufficientEvidence ? <CheckCircleIcon /> : <WarningAmberIcon />}
                      label={result.hasSufficientEvidence ? "Grounded in Evidence" : "Low Evidence"}
                      color={result.hasSufficientEvidence ? "success" : "warning"}
                      size="small"
                    />
                  </Box>

                  <Typography sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {result.answer}
                  </Typography>

                  <Alert
                    severity={result.hasSufficientEvidence ? "info" : "warning"}
                    icon={<WarningAmberIcon />}
                    sx={{ mt: 3 }}
                  >
                    This response was dynamically computed by AI using retrieved vector evidence chunks from your research database.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            {/* Sources */}
            <Grid item xs={12} md={5}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Retrieved Vector Sources
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Evidence chunks retrieved from the vector store.
                  </Typography>

                  {(!result.sources || result.sources.length === 0) ? (
                    <Typography color="text.secondary">
                      No matching vector chunks were found in the database for this query.
                    </Typography>
                  ) : (
                    result.sources.map((source, index) => (
                      <Paper key={source.chunkId || index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", justifyContent: "space-between" }}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <DescriptionIcon color="primary" fontSize="small" />
                            <Typography fontWeight="bold" variant="body2">
                              [{index + 1}] {source.documentTitle}
                            </Typography>
                          </Box>

                          {source.relevanceScore !== undefined && (
                            <Chip
                              label={`Similarity: ${(source.relevanceScore * 100).toFixed(1)}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          "{source.excerptText}"
                        </Typography>
                      </Paper>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <ScienceIcon sx={{ fontSize: 55, color: "text.secondary", mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Research Knowledge Base Search
                  </Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mt: 1 }}>
                    Type any research question about compounds, mechanisms of action, targets, or clinical reviews. The AI agent will query vector embeddings and summarize evidence for you.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Research;
