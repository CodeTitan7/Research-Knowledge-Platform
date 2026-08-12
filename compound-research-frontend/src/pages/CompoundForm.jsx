import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ScienceIcon from "@mui/icons-material/Science";
import CategoryIcon from "@mui/icons-material/Category";
import BiotechIcon from "@mui/icons-material/Biotech";
import DescriptionIcon from "@mui/icons-material/Description";

import { useNavigate, useParams } from "react-router-dom";
import {
  compoundService,
  targetService,
  categoryService,
} from "../services/api";

function CompoundForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [name, setName] = useState("");
  const [synonym, setSynonym] = useState("");
  const [molecularFormula, setMolecularFormula] = useState("");
  const [description, setDescription] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTargetIds, setSelectedTargetIds] = useState([]);

  /* =========================================================
     META DATA
  ========================================================= */

  const [availableTargets, setAvailableTargets] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  /* =========================================================
     STATUS
  ========================================================= */

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const initializePage = async () => {
      await loadMetaData();

      if (isEditMode) {
        await loadCompoundData();
      }
    };

    initializePage();
  }, [id]);

  /* =========================================================
     LOAD TARGETS + CATEGORIES
  ========================================================= */

  const loadMetaData = async () => {
    try {
      const [targetRes, catRes] = await Promise.all([
        targetService
          .getAll()
          .catch(() => ({ success: true, data: [] })),

        categoryService
          .getAll()
          .catch(() => ({ success: true, data: [] })),
      ]);

      if (
        targetRes.success &&
        Array.isArray(targetRes.data)
      ) {
        setAvailableTargets(targetRes.data);
      }

      if (
        catRes.success &&
        Array.isArray(catRes.data)
      ) {
        setAvailableCategories(catRes.data);
      }
    } catch (err) {
      console.error(
        "Error loading targets/categories:",
        err
      );
    }
  };

  /* =========================================================
     LOAD EXISTING COMPOUND
  ========================================================= */

  const loadCompoundData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await compoundService.getById(id);

      if (res.success && res.data) {
        const compound = res.data;

        setName(compound.name || "");
        setSynonym(compound.synonym || "");
        setMolecularFormula(
          compound.molecularFormula || ""
        );
        setDescription(compound.description || "");

        /*
         * Existing category
         *
         * Depending on the backend response this may be:
         * categoryId
         * category?.id
         */
        if (compound.categoryId) {
          setSelectedCategoryId(compound.categoryId);
        } else if (compound.category?.id) {
          setSelectedCategoryId(compound.category.id);
        } else {
          setSelectedCategoryId("");
        }

        /*
         * Existing targets
         *
         * Backend may return:
         *
         * targets: [
         *   { id: 1, name: "..." }
         * ]
         *
         * or:
         *
         * targetIds: [1, 2]
         */
        if (Array.isArray(compound.targetIds)) {
          setSelectedTargetIds(
            compound.targetIds.map(Number)
          );
        } else if (Array.isArray(compound.targets)) {
          setSelectedTargetIds(
            compound.targets
              .map((target) => target.id)
              .filter(
                (targetId) =>
                  targetId !== undefined &&
                  targetId !== null
              )
              .map(Number)
          );
        } else {
          setSelectedTargetIds([]);
        }
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to load compound data for editing."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     TARGET SELECTION
  ========================================================= */

  const handleTargetToggle = (targetId) => {
    const numericId = Number(targetId);

    setSelectedTargetIds((previous) =>
      previous.includes(numericId)
        ? previous.filter(
            (id) => id !== numericId
          )
        : [...previous, numericId]
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Compound name is required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: name.trim(),

        synonym:
          synonym.trim() || null,

        description:
          description.trim() || null,

        molecularFormula:
          molecularFormula.trim() || null,

        categoryId: selectedCategoryId
          ? Number(selectedCategoryId)
          : null,

        targetIds: selectedTargetIds,
      };

      if (isEditMode) {
        await compoundService.update(
          id,
          payload
        );
      } else {
        await compoundService.create(
          payload
        );
      }

      navigate("/compounds");
    } catch (err) {
      setError(
        err.message ||
          "Failed to save compound."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={40} />

          <Typography
            sx={{
              mt: 2,
              color: "#64748B",
              fontSize: "0.9rem",
            }}
          >
            Loading compound information...
          </Typography>
        </Box>
      </Box>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        pb: 6,
      }}
    >
      {/* =====================================================
          BACK NAVIGATION
      ===================================================== */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate(
            isEditMode
              ? `/compounds/${id}`
              : "/compounds"
          )
        }
        sx={{
          mb: 2.5,
          color: "#64748B",
          textTransform: "none",
          fontWeight: 600,
          px: 1,

          "&:hover": {
            backgroundColor: "#F1F5F9",
            color: "#1976D2",
          },
        }}
      >
        {isEditMode
          ? "Back to Compound"
          : "Back to Compounds"}
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
          {isEditMode
            ? "Edit Compound"
            : "Add New Compound"}
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            mt: 0.7,
            fontSize: "0.97rem",
          }}
        >
          {isEditMode
            ? "Update the compound's scientific information, classification, and biological targets."
            : "Register a new compound and associate it with relevant research information."}
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
          FORM
      ===================================================== */}

      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >
            {/* Section heading */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#E8F1FB",
                  color: "#1976D2",
                }}
              >
                <ScienceIcon fontSize="small" />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  Basic Information
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  Core scientific identity
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2.5,
              }}
            >
              {/* Compound name */}

              <TextField
                fullWidth
                label="Compound Name"
                placeholder="e.g. Metformin"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

              {/* Molecular formula */}

              <TextField
                fullWidth
                label="Molecular Formula"
                placeholder="e.g. C4H11N5"
                value={molecularFormula}
                onChange={(event) =>
                  setMolecularFormula(
                    event.target.value
                  )
                }
              />

              {/* Synonym */}

              <TextField
                fullWidth
                label="Synonym / Trade Name"
                placeholder="e.g. Dimethylbiguanide"
                value={synonym}
                onChange={(event) =>
                  setSynonym(
                    event.target.value
                  )
                }
              />

              {/* Category */}

              <FormControl fullWidth>
                <FormLabel
                  sx={{
                    mb: 1,
                    color: "#334155",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Category
                </FormLabel>

                <Select
                  value={selectedCategoryId}
                  onChange={(event) =>
                    setSelectedCategoryId(
                      event.target.value
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None / Unassigned</em>
                  </MenuItem>

                  {availableCategories.map(
                    (category) => (
                      <MenuItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#E8F1FB",
                  color: "#1976D2",
                }}
              >
                <DescriptionIcon fontSize="small" />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  Research Description
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  Scientific overview and context
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Description / Research Summary"
              placeholder="Describe the compound, its mechanism, applications, biological activity, or other relevant research information..."
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "#94A3B8",
              }}
            >
              Keep this description concise and
              scientifically relevant. It can be used
              as contextual information within the
              research knowledge base.
            </Typography>
          </CardContent>
        </Card>

        {/* ===================================================
            TARGETS
        =================================================== */}

        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#E8F1FB",
                  color: "#1976D2",
                }}
              >
                <BiotechIcon fontSize="small" />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  Biological Targets
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  Associate relevant biological targets
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {availableTargets.length === 0 ? (
              <Box
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 2,
                  backgroundColor: "#F8FAFC",
                  border:
                    "1px dashed #CBD5E1",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                  }}
                >
                  No biological targets are
                  currently available.
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    mb: 2,
                  }}
                >
                  Select all targets associated
                  with this compound.
                </Typography>

                {/* Selected target summary */}

                {selectedTargetIds.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 2.5,
                    }}
                  >
                    {selectedTargetIds.map(
                      (targetId) => {
                        const target =
                          availableTargets.find(
                            (item) =>
                              Number(item.id) ===
                              Number(targetId)
                          );

                        return target ? (
                          <Chip
                            key={targetId}
                            label={target.name}
                            color="primary"
                            size="small"
                            onDelete={() =>
                              handleTargetToggle(
                                targetId
                              )
                            }
                          />
                        ) : null;
                      }
                    )}
                  </Box>
                )}

                <FormControl
                  component="fieldset"
                  fullWidth
                >
                  <FormGroup
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "1fr 1fr 1fr",
                      },
                      gap: 0.5,
                    }}
                  >
                    {availableTargets.map(
                      (target) => (
                        <FormControlLabel
                          key={target.id}
                          control={
                            <Checkbox
                              checked={selectedTargetIds.includes(
                                Number(target.id)
                              )}
                              onChange={() =>
                                handleTargetToggle(
                                  target.id
                                )
                              }
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#334155",
                              }}
                            >
                              {target.name}
                            </Typography>
                          }
                          sx={{
                            m: 0,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1.5,

                            "&:hover": {
                              backgroundColor:
                                "#F8FAFC",
                            },
                          }}
                        />
                      )
                    )}
                  </FormGroup>
                </FormControl>
              </>
            )}
          </CardContent>
        </Card>

        {/* ===================================================
            FORM ACTIONS
        =================================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            backgroundColor: "#F8FAFC",
          }}
        >
          <CardContent
            sx={{
              px: {
                xs: 2.5,
                md: 3,
              },
              py: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
                gap: 2,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                }}
              >
                {isEditMode
                  ? "Review the changes before saving the compound."
                  : "Review the information before adding the compound to the knowledge base."}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  justifyContent: {
                    xs: "stretch",
                    sm: "flex-end",
                  },
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
                  disabled={submitting}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    minWidth: 100,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    submitting ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={submitting}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    minWidth: 150,
                  }}
                >
                  {submitting
                    ? "Saving..."
                    : isEditMode
                    ? "Save Changes"
                    : "Create Compound"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default CompoundForm;