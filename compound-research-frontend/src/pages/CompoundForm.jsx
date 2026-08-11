
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { compounds } from "../data/mockData";


const availableTargets = [
  "BCR-ABL1",
  "KIT",
  "PDGFR",
  "EGFR",
  "HER2",
  "BRAF",
];


const availableCategories = [
  "Cancer",
  "Kinase Inhibitor",
  "EGFR Inhibitor",
  "Monoclonal Antibody",
];


function CompoundForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);


  /*
   * Find the compound when editing.
   */
  const existingCompound = isEditMode
    ? compounds.find(
        (compound) =>
          compound.id === Number(id)
      )
    : null;


  /*
   * Form state.
   */
  const [name, setName] = useState(
    existingCompound?.name || ""
  );

  const [identifier, setIdentifier] =
    useState(
      existingCompound?.identifier || ""
    );

  const [description, setDescription] =
    useState(
      existingCompound?.description || ""
    );

  const [selectedTargets, setSelectedTargets] =
    useState(
      existingCompound?.targets || []
    );

  const [selectedCategories, setSelectedCategories] =
    useState(
      existingCompound?.categories || []
    );


  /*
   * Validation errors.
   */
  const [errors, setErrors] = useState({});


  /*
   * Handle target selection.
   */
  const handleTargetChange = (target) => {
    setSelectedTargets((previous) => {

      if (previous.includes(target)) {
        return previous.filter(
          (item) => item !== target
        );
      }

      return [
        ...previous,
        target,
      ];
    });
  };


  /*
   * Handle category selection.
   */
  const handleCategoryChange = (category) => {
    setSelectedCategories((previous) => {

      if (previous.includes(category)) {
        return previous.filter(
          (item) => item !== category
        );
      }

      return [
        ...previous,
        category,
      ];
    });
  };


  /*
   * Validate the form.
   */
  const validateForm = () => {

    const newErrors = {};


    if (!name.trim()) {
      newErrors.name =
        "Compound name is required.";
    }


    if (!identifier.trim()) {
      newErrors.identifier =
        "Identifier is required.";
    }


    if (!description.trim()) {
      newErrors.description =
        "Description is required.";
    }


    if (selectedTargets.length === 0) {
      newErrors.targets =
        "Select at least one target.";
    }


    if (selectedCategories.length === 0) {
      newErrors.categories =
        "Select at least one category.";
    }


    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;
  };


  /*
   * Handle form submission.
   */
  const handleSubmit = (event) => {

    event.preventDefault();


    if (!validateForm()) {
      return;
    }


    /*
     * For now we only simulate the operation.
     *
     * Later this will become:
     *
     * POST /api/compounds
     *
     * or
     *
     * PUT /api/compounds/{id}
     */

    const compoundData = {
      name: name.trim(),
      identifier: identifier.trim(),
      description: description.trim(),
      targets: selectedTargets,
      categories: selectedCategories,
    };


    console.log(
      isEditMode
        ? "Updating compound:"
        : "Creating compound:",
      compoundData
    );


    alert(
      isEditMode
        ? "Compound updated successfully."
        : "Compound created successfully."
    );


    navigate("/compounds");
  };


  /*
   * Invalid edit ID.
   */
  if (isEditMode && !existingCompound) {

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
          The compound you are trying to edit
          does not exist.
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate("/compounds")
          }
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
        onClick={() =>
          navigate(
            isEditMode
              ? `/compounds/${id}`
              : "/compounds"
          )
        }
        sx={{ mb: 2 }}
      >
        Back
      </Button>


      {/* Page heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        {isEditMode
          ? "Edit Compound"
          : "Add Compound"}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {isEditMode
          ? "Update the compound information."
          : "Add a new compound to the research knowledge base."}
      </Typography>


      {/* Form */}
      <Card>

        <CardContent>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >

            <Grid
              container
              spacing={3}
            >

              {/* Compound name */}
              <Grid
                item
                xs={12}
                md={6}
              >

                <TextField
                  fullWidth
                  label="Compound Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  required
                />

              </Grid>


              {/* Identifier */}
              <Grid
                item
                xs={12}
                md={6}
              >

                <TextField
                  fullWidth
                  label="Identifier"
                  placeholder="e.g. DB00619"
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(
                      event.target.value
                    )
                  }
                  error={Boolean(
                    errors.identifier
                  )}
                  helperText={errors.identifier}
                  required
                />

              </Grid>


              {/* Description */}
              <Grid
                item
                xs={12}
              >

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  error={Boolean(
                    errors.description
                  )}
                  helperText={errors.description}
                  required
                />

              </Grid>


              {/* Targets */}
              <Grid
                item
                xs={12}
                md={6}
              >

                <FormControl
                  component="fieldset"
                  error={Boolean(errors.targets)}
                  fullWidth
                >

                  <FormLabel
                    component="legend"
                    sx={{ mb: 1 }}
                  >
                    Targets
                  </FormLabel>


                  <FormGroup>

                    {availableTargets.map(
                      (target) => (

                        <FormControlLabel
                          key={target}
                          control={
                            <Checkbox
                              checked={selectedTargets.includes(
                                target
                              )}
                              onChange={() =>
                                handleTargetChange(
                                  target
                                )
                              }
                            />
                          }
                          label={target}
                        />

                      )
                    )}

                  </FormGroup>


                  {errors.targets && (
                    <FormHelperText>
                      {errors.targets}
                    </FormHelperText>
                  )}

                </FormControl>

              </Grid>


              {/* Categories */}
              <Grid
                item
                xs={12}
                md={6}
              >

                <FormControl
                  component="fieldset"
                  error={Boolean(
                    errors.categories
                  )}
                  fullWidth
                >

                  <FormLabel
                    component="legend"
                    sx={{ mb: 1 }}
                  >
                    Categories
                  </FormLabel>


                  <FormGroup>

                    {availableCategories.map(
                      (category) => (

                        <FormControlLabel
                          key={category}
                          control={
                            <Checkbox
                              checked={selectedCategories.includes(
                                category
                              )}
                              onChange={() =>
                                handleCategoryChange(
                                  category
                                )
                              }
                            />
                          }
                          label={category}
                        />

                      )
                    )}

                  </FormGroup>


                  {errors.categories && (
                    <FormHelperText>
                      {errors.categories}
                    </FormHelperText>
                  )}

                </FormControl>

              </Grid>


              {/* Form actions */}
              <Grid
                item
                xs={12}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        isEditMode
                          ? `/compounds/${id}`
                          : "/compounds"
                      )
                    }
                  >
                    Cancel
                  </Button>


                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    {isEditMode
                      ? "Save Changes"
                      : "Create Compound"}
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


export default CompoundForm;

