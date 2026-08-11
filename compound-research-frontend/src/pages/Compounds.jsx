import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { compounds } from "../data/mockData";


function Compounds() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [targetFilter, setTargetFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");


  /*
   * Create a list of all available targets.
   */
  const targets = useMemo(() => {
    const allTargets = compounds.flatMap(
      (compound) => compound.targets
    );

    return ["All", ...new Set(allTargets)];
  }, []);


  /*
   * Create a list of all available categories.
   */
  const categories = useMemo(() => {
    const allCategories = compounds.flatMap(
      (compound) => compound.categories
    );

    return ["All", ...new Set(allCategories)];
  }, []);


  /*
   * Filter compounds based on:
   * 1. Search term
   * 2. Target
   * 3. Category
   */
  const filteredCompounds = useMemo(() => {
    return compounds.filter((compound) => {

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        compound.name.toLowerCase().includes(search) ||
        compound.identifier.toLowerCase().includes(search);

      const matchesTarget =
        targetFilter === "All" ||
        compound.targets.includes(targetFilter);

      const matchesCategory =
        categoryFilter === "All" ||
        compound.categories.includes(categoryFilter);

      return (
        matchesSearch &&
        matchesTarget &&
        matchesCategory
      );
    });
  }, [
    searchTerm,
    targetFilter,
    categoryFilter,
  ]);


  return (
    <Box>

      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Compounds
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage and explore compound records.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/compounds/add")}
        >
          Add Compound
        </Button>

      </Box>


      {/* Search and filters */}
      <Card sx={{ mb: 3 }}>

        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Search & Filter
          </Typography>


          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >

            {/* Search */}
            <TextField
              label="Search by name or identifier"
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
              sx={{
                minWidth: 280,
                flexGrow: 1,
              }}
            />


            {/* Target filter */}
            <FormControl
              sx={{ minWidth: 200 }}
            >

              <InputLabel>
                Target
              </InputLabel>

              <Select
                value={targetFilter}
                label="Target"
                onChange={(event) =>
                  setTargetFilter(event.target.value)
                }
              >

                {targets.map((target) => (
                  <MenuItem
                    key={target}
                    value={target}
                  >
                    {target}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>


            {/* Category filter */}
            <FormControl
              sx={{ minWidth: 220 }}
            >

              <InputLabel>
                Category
              </InputLabel>

              <Select
                value={categoryFilter}
                label="Category"
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >

                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Box>

        </CardContent>

      </Card>


      {/* Results */}
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
              Compound Records
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {filteredCompounds.length} results
            </Typography>

          </Box>


          <TableContainer>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    <strong>Compound</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Identifier</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Targets</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Categories</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Action</strong>
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredCompounds.map(
                  (compound) => (

                    <TableRow
                      key={compound.id}
                      hover
                    >

                      {/* Name */}
                      <TableCell>

                        <Typography
                          fontWeight="bold"
                        >
                          {compound.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {compound.description}
                        </Typography>

                      </TableCell>


                      {/* Identifier */}
                      <TableCell>
                        {compound.identifier}
                      </TableCell>


                      {/* Targets */}
                      <TableCell>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                          }}
                        >

                          {compound.targets.map(
                            (target) => (

                              <Chip
                                key={target}
                                label={target}
                                size="small"
                              />

                            )
                          )}

                        </Box>

                      </TableCell>


                      {/* Categories */}
                      <TableCell>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                          }}
                        >

                          {compound.categories.map(
                            (category) => (

                              <Chip
                                key={category}
                                label={category}
                                size="small"
                                variant="outlined"
                              />

                            )
                          )}

                        </Box>

                      </TableCell>


                      {/* View */}
                      <TableCell align="right">

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={
                            <VisibilityIcon />
                          }
                          onClick={() =>
                            navigate(
                              `/compounds/${compound.id}`
                            )
                          }
                        >
                          View
                        </Button>

                      </TableCell>

                    </TableRow>

                  )
                )}


                {/* No results */}
                {filteredCompounds.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={5}
                      align="center"
                    >

                      <Typography
                        color="text.secondary"
                        sx={{ py: 4 }}
                      >
                        No compounds found.
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


export default Compounds;