
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { documents } from "../data/mockData";


function Documents() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");


  /*
   * Filter documents using the search term.
   */
  const filteredDocuments = useMemo(() => {

    const search = searchTerm.toLowerCase();

    return documents.filter((document) => {

      return (
        document.name
          .toLowerCase()
          .includes(search) ||

        document.fileName
          .toLowerCase()
          .includes(search)
      );

    });

  }, [searchTerm]);


  /*
   * Format the date for display.
   */
  const formatDate = (date) => {

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

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

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Reference Documents
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage the research documents used by
            the knowledge base.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/documents/upload")
          }
        >
          Upload Document
        </Button>

      </Box>


      {/* Search */}
      <Card sx={{ mb: 3 }}>

        <CardContent>

          <TextField
            fullWidth
            label="Search documents"
            placeholder="Search by document name or file name"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{
                    mr: 1,
                    color: "text.secondary",
                  }}
                />
              ),
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

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Research Documents
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {filteredDocuments.length} documents
            </Typography>

          </Box>


          <TableContainer>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    <strong>Document</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Size</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Uploaded</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Related Compounds</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredDocuments.map(
                  (document) => (

                    <TableRow
                      key={document.id}
                      hover
                    >

                      {/* Document */}
                      <TableCell>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >

                          <DescriptionIcon
                            color="primary"
                          />

                          <Box>

                            <Typography
                              fontWeight="bold"
                            >
                              {document.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {document.fileName}
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* Type */}
                      <TableCell>

                        <Chip
                          label={document.type}
                          size="small"
                        />

                      </TableCell>


                      {/* Size */}
                      <TableCell>
                        {document.size}
                      </TableCell>


                      {/* Date */}
                      <TableCell>
                        {formatDate(
                          document.uploadedDate
                        )}
                      </TableCell>


                      {/* Related compounds */}
                      <TableCell>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                          }}
                        >

                          {document.relatedCompounds.map(
                            (compound) => (

                              <Chip
                                key={compound}
                                label={compound}
                                size="small"
                                variant="outlined"
                              />

                            )
                          )}

                        </Box>

                      </TableCell>


                      {/* Actions */}
                      <TableCell align="right">

                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/documents/${document.id}`
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>


                        <IconButton
                          color="error"
                          onClick={() =>
                            alert(
                              "Delete functionality will be connected to the backend later."
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>

                      </TableCell>

                    </TableRow>

                  )
                )}


                {/* Empty state */}
                {filteredDocuments.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      align="center"
                    >

                      <Typography
                        color="text.secondary"
                        sx={{ py: 4 }}
                      >
                        No documents found.
                      </Typography>

                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </TableContainer>

        </CardContent>

      </Card>

    </Box>
  );
}


export default Documents;
