
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionIcon from "@mui/icons-material/Description";

import { useNavigate, useParams } from "react-router-dom";

import { compounds } from "../data/mockData";


function CompoundDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const compound = compounds.find(
    (item) => item.id === Number(id)
  );


  /*
   * Handle an invalid compound ID.
   */
  if (!compound) {
    return (
      <Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          Compound Not Found
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          The compound you are looking for does not
          exist in the current knowledge base.
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

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {compound.name}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Identifier: {compound.identifier}
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

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() =>
                  navigate(
                    `/compounds/${compound.id}/edit`
                  )
                }
              >
                Edit
              </Button>


              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() =>
                  alert(
                    "Delete functionality will be connected to the backend later."
                  )
                }
              >
                Delete
              </Button>

            </Box>

          </Box>

        </CardContent>

      </Card>


      {/* Main information */}
      <Grid
        container
        spacing={3}
      >

        {/* Description */}
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
                Description
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {compound.description}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* Targets */}
        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{ height: "100%" }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                Targets
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >

                {compound.targets.map(
                  (target) => (

                    <Chip
                      key={target}
                      label={target}
                    />

                  )
                )}

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* Categories */}
        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{ height: "100%" }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                Categories
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >

                {compound.categories.map(
                  (category) => (

                    <Chip
                      key={category}
                      label={category}
                      variant="outlined"
                    />

                  )
                )}

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* Research Documents */}
        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{ height: "100%" }}
          >

            <CardContent>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >

                <DescriptionIcon
                  color="primary"
                />

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Research Documents
                </Typography>

              </Box>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Reference documents related to this
                compound will appear here.
              </Typography>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/documents")
                }
              >
                View Documents
              </Button>

            </CardContent>

          </Card>

        </Grid>


        {/* Research AI */}
        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{ height: "100%" }}
          >

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
                Ask questions about this compound
                using the available research knowledge
                base.
              </Typography>

              <Button
                variant="contained"
                startIcon={<SmartToyIcon />}
                onClick={() =>
                  navigate(
                    `/research?compound=${compound.id}`
                  )
                }
              >
                Ask About This Compound
              </Button>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>
  );
}


export default CompoundDetails;

