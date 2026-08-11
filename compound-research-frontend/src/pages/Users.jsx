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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { userService } from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create User dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ResearchUser");
  const [creating, setCreating] = useState(false);

  const rolesList = ["Administrator", "ResearchUser", "Reviewer"];

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
      setSuccess(`Updated role for user.`);
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
      setSuccess(`User status updated.`);
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

    try {
      setCreating(true);
      setError("");
      await userService.create({
        fullName: newFullName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
      });

      setSuccess(`User '${newFullName}' created successfully with role '${newRole}'.`);
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

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              User Management
            </Typography>
            <Typography color="text.secondary">
              Manage system users, role authorizations, and active states.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          Create New User
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Active Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const currentRole = user.roles?.[0] || "ResearchUser";
                    return (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Typography fontWeight="bold">{user.fullName || "User"}</Typography>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <FormControl size="small">
                            <Select
                              value={currentRole}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                              {rolesList.map((r) => (
                                <MenuItem key={r} value={r}>
                                  {r}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Switch
                              checked={Boolean(user.isActive)}
                              onChange={() => handleActiveToggle(user.id, user.isActive)}
                              color="success"
                            />
                            <Chip
                              label={user.isActive ? "Active" : "Disabled"}
                              color={user.isActive ? "success" : "default"}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary" sx={{ py: 3 }}>
                          No users found.
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

      {/* Dialog for Creating User */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateUser}>
          <DialogTitle fontWeight="bold">Create New System User</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Initial Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                helperText="Minimum 6 characters"
              />
              <FormControl fullWidth>
                <InputLabel>Assigned Role</InputLabel>
                <Select
                  value={newRole}
                  label="Assigned Role"
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <MenuItem value="ResearchUser">Research User (Read & Ask AI)</MenuItem>
                  <MenuItem value="Reviewer">Reviewer (Curator & Content Editor)</MenuItem>
                  <MenuItem value="Administrator">Administrator (System & User Management)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenCreate(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? <CircularProgress size={20} color="inherit" /> : "Create User"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Users;
