
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

import { useSearchParams } from "react-router-dom";
import { useState } from "react";


const mockAnswer = {
  answer:
    "Based on the available research evidence, Imatinib is associated with several protein targets, most notably BCR-ABL1. The available references also describe activity involving KIT and PDGFR. These findings are based only on the documents currently available in the research knowledge base.",

  evidence: [
    {
      source: "BCR-ABL1 and Tyrosine Kinase Inhibitors",
      page: 4,
      excerpt:
        "The document describes BCR-ABL1 as a primary molecular target of imatinib.",
    },

    {
      source: "Imatinib Research Review",
      page: 7,
      excerpt:
        "Imatinib also demonstrates activity against KIT and PDGFR-associated signaling.",
    },
  ],
};


function Research() {
  const [searchParams] = useSearchParams();

  const compoundId =
    searchParams.get("compound");

  const documentId =
    searchParams.get("document");


  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");


  /*
   * Ask the research assistant.
   *
   * For now this simulates an API call.
   */
  const handleAsk = () => {

    if (!question.trim()) {

      setError(
        "Please enter a research question."
      );

      return;
    }


    setError("");

    setLoading(true);

    setResult(null);


    /*
     * Simulate API response.
     *
     * Later this will become:
     *
     * POST /api/research/query
     */
    setTimeout(() => {

      setLoading(false);

      setResult(mockAnswer);

    }, 1500);
  };


  /*
   * Allow Enter to submit.
   */
  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

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
            Research Assistant
          </Typography>

        </Box>


        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Ask questions using the controlled
          research knowledge base.
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
              You are asking about compound{" "}
              <strong>
                #{compoundId}
              </strong>
              .
            </>
          )}

          {documentId && (
            <>
              You are asking about document{" "}
              <strong>
                #{documentId}
              </strong>
              .
            </>
          )}

        </Alert>

      )}


      <Grid
        container
        spacing={3}
      >

        {/* Question section */}
        <Grid
          item
          xs={12}
        >

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
                Questions are answered using
                information retrieved from the
                available research documents.
              </Typography>


              <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Example: What targets are associated with Imatinib?"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                error={Boolean(error)}
                helperText={
                  error ||
                  "Press Enter to ask or use the button below."
                }
              />


              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  mt: 2,
                }}
              >

                <Button
                  variant="contained"
                  startIcon={
                    loading
                      ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      )
                      : (
                        <SendIcon />
                      )
                  }
                  onClick={handleAsk}
                  disabled={loading}
                >
                  {loading
                    ? "Searching Evidence..."
                    : "Ask Research AI"}
                </Button>

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* Loading state */}
        {loading && (

          <Grid
            item
            xs={12}
          >

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

                    <Typography
                      fontWeight="bold"
                    >
                      Searching the knowledge base...
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Retrieving relevant research
                      evidence.
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
            <Grid
              item
              xs={12}
              md={8}
            >

              <Card>

                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >

                    <SmartToyIcon
                      color="primary"
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      AI-Assisted Answer
                    </Typography>

                  </Box>


                  <Typography
                    sx={{
                      lineHeight: 1.8,
                    }}
                  >
                    {result.answer}
                  </Typography>


                  <Alert
                    severity="warning"
                    icon={
                      <WarningAmberIcon />
                    }
                    sx={{ mt: 3 }}
                  >
                    This answer is generated from
                    retrieved research evidence.
                    Always verify important
                    research claims against the
                    cited sources.
                  </Alert>

                </CardContent>

              </Card>

            </Grid>


            {/* Sources */}
            <Grid
              item
              xs={12}
              md={4}
            >

              <Card>

                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Sources
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Evidence retrieved from the
                    research knowledge base.
                  </Typography>


                  {result.evidence.map(
                    (source, index) => (

                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 2,
                        }}
                      >

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems:
                              "flex-start",
                          }}
                        >

                          <DescriptionIcon
                            color="primary"
                            fontSize="small"
                          />

                          <Box>

                            <Typography
                              fontWeight="bold"
                              variant="body2"
                            >
                              [{index + 1}]{" "}
                              {source.source}
                            </Typography>


                            <Chip
                              label={`Page ${source.page}`}
                              size="small"
                              sx={{ mt: 1 }}
                            />

                          </Box>

                        </Box>


                        <Divider
                          sx={{ my: 1.5 }}
                        />


                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                          }}
                        >
                          {source.excerpt}
                        </Typography>

                      </Paper>

                    )
                  )}

                </CardContent>

              </Card>

            </Grid>
          </>

        )}


        {/* Empty state */}
        {!result &&
          !loading && (

            <Grid
              item
              xs={12}
            >

              <Card>

                <CardContent>

                  <Box
                    sx={{
                      textAlign: "center",
                      py: 5,
                    }}
                  >

                    <ScienceIcon
                      sx={{
                        fontSize: 55,
                        color:
                          "text.secondary",
                        mb: 1,
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      Research Evidence Search
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        maxWidth: 600,
                        mx: "auto",
                        mt: 1,
                      }}
                    >
                      Ask a question about a
                      compound, target, disease,
                      or research topic. The system
                      will retrieve relevant evidence
                      from the available documents.
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
