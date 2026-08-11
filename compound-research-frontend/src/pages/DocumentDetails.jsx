
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { useNavigate, useParams } from "react-router-dom";

import { documents } from "../data/mockData";


function DocumentDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const document = documents.find(
    (item) => item.id === Number(id)
  );


  /*
   * Handle invalid document ID.
   */
  if (!document) {

    return (
      <Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          Document Not Found
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          The requested document does not exist
          in the current knowledge base.
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate("/documents")
          }
        >
          Back to Documents
        </Button>

      </Box>
    );
  }


  return (
    <Box>

      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate("/documents")
        }
        sx={{ mb: 2 }}
      >
        Back to Documents
      </Button>


      {/* Header */}
      <Card sx={{ mb: 3 }}>

        <CardContent>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
            }}
          >

            <DescriptionIcon
              color="primary"
              sx={{
                fontSize: 45,
              }}
            />

            <Box>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {document.name}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {document.fileName}
              </Typography>

            </Box>

          </Box>

        </CardContent>

      </Card>


      {/* Information */}
      <Card sx={{ mb: 3 }}>

        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            Document Information
          </Typography>

          <Divider sx={{ mb: 2 }} />


          <Typography
            sx={{ mb: 2 }}
          >
            {document.description}
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            File type: {document.type}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            File size: {document.size}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Uploaded: {document.uploadedDate}
          </Typography>

        </CardContent>

      </Card>


      {/* Related compounds */}
      <Card sx={{ mb: 3 }}>

        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            Related Compounds
          </Typography>

          <Divider sx={{ mb: 2 }} />


          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >

            {document.relatedCompounds.map(
              (compound) => (

                <Chip
                  key={compound}
                  label={compound}
                  variant="outlined"
                />

              )
            )}

          </Box>

        </CardContent>

      </Card>


      {/* Research AI */}
      <Card>

        <CardContent>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >

            <SmartToyIcon
              color="primary"
            />

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Research AI
            </Typography>

          </Box>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Ask questions using the research
            evidence contained in this document.
          </Typography>

          <Button
            variant="contained"
            startIcon={<SmartToyIcon />}
            onClick={() =>
              navigate(
                `/research?document=${document.id}`
              )
            }
          >
            Ask About This Document
          </Button>

        </CardContent>

      </Card>

    </Box>
  );
}


export default DocumentDetails;
