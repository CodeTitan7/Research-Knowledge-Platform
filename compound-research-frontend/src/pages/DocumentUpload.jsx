
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { compounds } from "../data/mockData";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


function DocumentUpload() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);


  /*
   * Form state
   */
  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [selectedCompounds, setSelectedCompounds] =
    useState([]);


  /*
   * Validation errors
   */
  const [errors, setErrors] = useState({});


  /*
   * Handle file selection
   */
  const handleFileChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    /*
     * Clear previous file error.
     */
    setErrors((previous) => ({
      ...previous,
      file: undefined,
    }));
  };


  /*
   * Handle compound selection
   */
  const handleCompoundChange = (compoundName) => {

    setSelectedCompounds((previous) => {

      if (previous.includes(compoundName)) {

        return previous.filter(
          (item) => item !== compoundName
        );
      }

      return [
        ...previous,
        compoundName,
      ];
    });
  };


  /*
   * Validate form
   */
  const validateForm = () => {

    const newErrors = {};


    if (!title.trim()) {

      newErrors.title =
        "Document title is required.";
    }


    if (!description.trim()) {

      newErrors.description =
        "Description is required.";
    }


    if (!selectedFile) {

      newErrors.file =
        "Please select a PDF document.";

    } else {

      /*
       * Only PDF files are accepted.
       */
      if (
        selectedFile.type !==
        "application/pdf"
      ) {

        newErrors.file =
          "Only PDF documents are allowed.";
      }


      /*
       * Maximum file size.
       */
      if (
        selectedFile.size >
        MAX_FILE_SIZE
      ) {

        newErrors.file =
          "File size must not exceed 10 MB.";
      }
    }


    if (
      selectedCompounds.length === 0
    ) {

      newErrors.compounds =
        "Select at least one related compound.";
    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };


  /*
   * Submit
   */
  const handleSubmit = (event) => {

    event.preventDefault();


    if (!validateForm()) {
      return;
    }


    /*
     * This is the data that will eventually
     * be sent to ASP.NET Core.
     *
     * For example:
     *
     * POST /api/documents
     *
     * using multipart/form-data
     */

    const documentData = {
      title: title.trim(),

      description:
        description.trim(),

      fileName:
        selectedFile.name,

      fileSize:
        selectedFile.size,

      relatedCompounds:
        selectedCompounds,
    };


    console.log(
      "Document upload:",
      documentData
    );


    alert(
      "Document uploaded successfully."
    );


    navigate("/documents");
  };


  return (
    <Box>

      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate("/documents")
        }
        sx={{ mb: 2 }}
      >
        Back to Documents
      </Button>


      {/* Heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Upload Research Document
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Add a research document to the controlled
        knowledge base.
      </Typography>


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

              {/* Title */}
              <Grid
                item
                xs={12}
              >

                <TextField
                  fullWidth
                  label="Document Title"
                  placeholder="Enter the research document title"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  error={Boolean(
                    errors.title
                  )}
                  helperText={errors.title}
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
                  placeholder="Describe what this document contains..."
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  error={Boolean(
                    errors.description
                  )}
                  helperText={
                    errors.description
                  }
                  required
                />

              </Grid>


              {/* File upload */}
              <Grid
                item
                xs={12}
              >

                <FormControl
                  fullWidth
                  error={Boolean(
                    errors.file
                  )}
                >

                  <FormLabel
                    sx={{ mb: 1 }}
                  >
                    Research File
                  </FormLabel>


                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={
                      handleFileChange
                    }
                    style={{
                      display: "none",
                    }}
                  />


                  <Box
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    sx={{
                      border: "2px dashed",
                      borderColor: errors.file
                        ? "error.main"
                        : "divider",
                      borderRadius: 2,
                      p: 4,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "0.2s",

                      "&:hover": {
                        borderColor:
                          "primary.main",
                        backgroundColor:
                          "action.hover",
                      },
                    }}
                  >

                    {selectedFile ? (

                      <>
                        <InsertDriveFileIcon
                          color="primary"
                          sx={{
                            fontSize: 48,
                            mb: 1,
                          }}
                        />

                        <Typography
                          fontWeight="bold"
                        >
                          {selectedFile.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {(
                            selectedFile.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </Typography>

                        <Button
                          sx={{ mt: 2 }}
                          onClick={(event) => {
                            event.stopPropagation();

                            fileInputRef.current.value =
                              "";

                            setSelectedFile(null);
                          }}
                        >
                          Remove File
                        </Button>
                      </>

                    ) : (

                      <>
                        <CloudUploadIcon
                          color="primary"
                          sx={{
                            fontSize: 48,
                            mb: 1,
                          }}
                        />

                        <Typography
                          fontWeight="bold"
                        >
                          Select a PDF document
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Click here to browse
                          files
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          PDF only • Maximum
                          10 MB
                        </Typography>
                      </>

                    )}

                  </Box>


                  {errors.file && (
                    <FormHelperText>
                      {errors.file}
                    </FormHelperText>
                  )}

                </FormControl>

              </Grid>


              {/* Related compounds */}
              <Grid
                item
                xs={12}
              >

                <FormControl
                  component="fieldset"
                  error={Boolean(
                    errors.compounds
                  )}
                  fullWidth
                >

                  <FormLabel
                    component="legend"
                    sx={{ mb: 1 }}
                  >
                    Related Compounds
                  </FormLabel>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Select the compounds that
                    are discussed in this
                    document.
                  </Typography>


                  <FormGroup>

                    {compounds.map(
                      (compound) => (

                        <FormControlLabel
                          key={compound.id}
                          control={
                            <Checkbox
                              checked={selectedCompounds.includes(
                                compound.name
                              )}
                              onChange={() =>
                                handleCompoundChange(
                                  compound.name
                                )
                              }
                            />
                          }
                          label={
                            `${compound.name} (${compound.identifier})`
                          }
                        />

                      )
                    )}

                  </FormGroup>


                  {errors.compounds && (
                    <FormHelperText>
                      {errors.compounds}
                    </FormHelperText>
                  )}

                </FormControl>

              </Grid>


              <Grid
                item
                xs={12}
              >

                <Divider />

              </Grid>


              {/* Actions */}
              <Grid
                item
                xs={12}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    gap: 2,
                  }}
                >

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        "/documents"
                      )
                    }
                  >
                    Cancel
                  </Button>


                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      <CloudUploadIcon />
                    }
                  >
                    Upload Document
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

