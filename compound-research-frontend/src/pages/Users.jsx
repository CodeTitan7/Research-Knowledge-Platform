import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Avatar,
  InputAdornment,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

import { userService } from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Create User dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ResearchUser");
  const [creating, setCreating] = useState(false);

  const rolesList = ["Administrator", "ResearchUser", "Reviewer"];

  // Protected main administrator account
  const MAIN_ADMIN_EMAIL = "admin@compoundresearch.local";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userService.getAll();

      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setError("");
      setSuccess("");

      await userService.changeRole(userId, role);

      setSuccess("User role updated successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to change role.");
    }
  };

  const handleActiveToggle = async (userId, currentActive) => {
    try {
      setError("");
      setSuccess("");

      await userService.setActive(userId, !currentActive);

      setSuccess("User status updated successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update active status.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!newFullName || !newEmail || !newPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      await userService.create({
        fullName: newFullName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
      });

      setSuccess(
        `User '${newFullName}' was created successfully.`
      );

      setOpenCreate(false);

      setNewFullName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("ResearchUser");

      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const getInitial = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Administrator":
        return <AdminPanelSettingsOutlinedIcon fontSize="small" />;
      case "Reviewer":
        return <ShieldOutlinedIcon fontSize="small" />;
      default:
        return <ScienceOutlinedIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Administrator":
        return "primary";
      case "Reviewer":
        return "info";
      default:
        return "default";
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user.fullName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.roles?.some((role) =>
        role.toLowerCase().includes(search)
      )
    );
  });

  const activeUsers = users.filter((user) => user.isActive).length;

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto" }}>

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#12355B",
              letterSpacing: "-0.5px",
              fontFamily: "'Inter', 'Roboto', sans-serif",
            }}
          >
            User Management
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#64748B",
              fontSize: "0.95rem",
              fontFamily: "'Inter', 'Roboto', sans-serif",
            }}
          >
            Manage researchers, reviewers, administrators, and
            platform access.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{
            borderRadius: 2.5,
            px: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "0 6px 16px rgba(25, 118, 210, 0.20)",
          }}
        >
          Create New User
        </Button>
      </Box>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        {/* Total Users */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#64748B",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                  }}
                >
                  Total Users
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  {users.length}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#E8F1FB",
                  color: "#1976D2",
                }}
              >
                <PeopleIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#64748B",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                  }}
                >
                  Active Users
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  {activeUsers}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#EAF7F0",
                  color: "#198754",
                }}
              >
                <ShieldOutlinedIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#64748B",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                  }}
                >
                  System Roles
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#12355B",
                  }}
                >
                  3
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#EEF2FF",
                  color: "#3F51B5",
                }}
              >
                <AdminPanelSettingsOutlinedIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* =========================================================
          ALERTS
      ========================================================= */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2.5,
            borderRadius: 2,
          }}
        >
          {success}
        </Alert>
      )}

      {/* =========================================================
          USERS TABLE CARD
      ========================================================= */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>

          {/* Table Header */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "1.15rem",
                  fontWeight: 750,
                  color: "#12355B",
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                }}
              >
                Platform Users
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.3,
                  color: "#64748B",
                }}
              >
                Manage roles and account access.
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#F8FAFC",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "#64748B",
                        fontSize: 20,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Table */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>

                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        py: 1.8,
                      }}
                    >
                      USER
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                      }}
                    >
                      EMAIL
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                      }}
                    >
                      ROLE
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                      }}
                    >
                      STATUS
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredUsers.map((user) => {
                    const currentRole =
                      user.roles?.[0] || "ResearchUser";

                    const isMainAdministrator =
                      user.email?.toLowerCase() ===
                      MAIN_ADMIN_EMAIL.toLowerCase();

                    return (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                          "&:hover": {
                            backgroundColor: "#F8FBFF",
                          },
                        }}
                      >

                        {/* USER */}
                        <TableCell sx={{ py: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: isMainAdministrator
                                  ? "#1976D2"
                                  : "#E8F1FB",
                                color: isMainAdministrator
                                  ? "#FFFFFF"
                                  : "#1976D2",
                                fontWeight: 700,
                              }}
                            >
                              {getInitial(
                                user.fullName,
                                user.email
                              )}
                            </Avatar>

                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#1E293B",
                                }}
                              >
                                {user.fullName || "User"}
                              </Typography>

                              {isMainAdministrator && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#1976D2",
                                    fontWeight: 600,
                                  }}
                                >
                                  Primary Administrator
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        {/* EMAIL */}
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                            }}
                          >
                            {user.email}
                          </Typography>
                        </TableCell>

                        {/* ROLE */}
                        <TableCell>
                          <FormControl size="small">
                            <Select
                              value={currentRole}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value
                                )
                              }
                              disabled={isMainAdministrator}
                              sx={{
                                minWidth: 165,
                                borderRadius: 2,
                                backgroundColor: "#FFFFFF",
                                "& .MuiSelect-select": {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.8,
                                },
                              }}
                              renderValue={(role) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.8,
                                  }}
                                >
                                  {getRoleIcon(role)}

                                  <Typography variant="body2">
                                    {role}
                                  </Typography>
                                </Box>
                              )}
                            >
                              {rolesList.map((role) => (
                                <MenuItem
                                  key={role}
                                  value={role}
                                >
                                  {role}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>

                        {/* STATUS */}
                        <TableCell>
                          {isMainAdministrator ? (
                            <Chip
                              label="Active"
                              color="success"
                              size="small"
                              sx={{
                                fontWeight: 600,
                                borderRadius: 1.5,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Switch
                                checked={Boolean(
                                  user.isActive
                                )}
                                onChange={() =>
                                  handleActiveToggle(
                                    user.id,
                                    user.isActive
                                  )
                                }
                                color="success"
                              />

                              <Chip
                                label={
                                  user.isActive
                                    ? "Active"
                                    : "Disabled"
                                }
                                color={
                                  user.isActive
                                    ? "success"
                                    : "default"
                                }
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  borderRadius: 1.5,
                                }}
                              />
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 7 }}
                      >
                        <PeopleIcon
                          sx={{
                            fontSize: 48,
                            color: "#CBD5E1",
                            mb: 1,
                          }}
                        />

                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#475569",
                          }}
                        >
                          No users found
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#94A3B8",
                            mt: 0.5,
                          }}
                        >
                          Try changing your search query.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* =========================================================
          CREATE USER DIALOG
      ========================================================= */}
      <Dialog
        open={openCreate}
        onClose={() => !creating && setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <form onSubmit={handleCreateUser}>

          <DialogTitle
            sx={{
              px: 3,
              pt: 3,
              pb: 1,
              fontWeight: 800,
              color: "#12355B",
            }}
          >
            Create New System User

            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mt: 0.5,
                fontWeight: 400,
              }}
            >
              Add a researcher or administrator to the platform.
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{
              px: 3,
              pt: "20px !important",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Full Name"
                value={newFullName}
                onChange={(e) =>
                  setNewFullName(e.target.value)
                }
                required
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newEmail}
                onChange={(e) =>
                  setNewEmail(e.target.value)
                }
                required
              />

              <TextField
                fullWidth
                label="Initial Password"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
                helperText="Minimum 6 characters"
              />

              <FormControl fullWidth>
                <InputLabel>Assigned Role</InputLabel>

                <Select
                  value={newRole}
                  label="Assigned Role"
                  onChange={(e) =>
                    setNewRole(e.target.value)
                  }
                >
                  <MenuItem value="ResearchUser">
                    Research User — Read & Ask AI
                  </MenuItem>

                  <MenuItem value="Reviewer">
                    Reviewer — Curate & Edit Content
                  </MenuItem>

                  <MenuItem value="Administrator">
                    Administrator — System Management
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2.5,
              borderTop: "1px solid #E2E8F0",
              gap: 1,
            }}
          >
            <Button
              onClick={() => setOpenCreate(false)}
              disabled={creating}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={creating}
              startIcon={
                !creating && <PersonAddIcon />
              }
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
              }}
            >
              {creating ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                />
              ) : (
                "Create User"
              )}
            </Button>
          </DialogActions>

        </form>
      </Dialog>
    </Box>
  );
}

export default Users;