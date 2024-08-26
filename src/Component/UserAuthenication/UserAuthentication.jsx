import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  selectAllUsers,
  registerUser,
  deleteUser,
  editUser,
} from "../../features/manageusers/usersSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TablePagination,
} from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const UserAuthentication = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const token = useSelector((state) => state.customers.token); // Adjust according to your state structure

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullname: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) {
      dispatch(getAllUsers(token)); // Fetch users when token is available
    }
  }, [dispatch, token]);

  if (userStatus === "loading") {
    return (
      <Paper>
        <CircularProgress />
      </Paper>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(newUser)).unwrap();
      dispatch(getAllUsers(token));
      // Fetch the updated list of users
      dispatch(getAllUsers(token));
      // Close the dialog and reset the form
      setOpen(false);
      setNewUser({
        email: "",
        password: "",
        fullname: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Failed to register user:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editUser({ updatedUser: userToEdit, token })).unwrap();
      // Show success notification
      toast.success("User updated successfully!");
      // Fetch the updated list of users
      dispatch(getAllUsers(token));
      // Close the edit dialog and reset the form
      setEditDialogOpen(false);
      setUserToEdit(null);
    } catch (err) {
      // Show error notification
      toast.error("Failed to update user.");
      console.error("Failed to update user:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUserToEdit((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await dispatch(deleteUser({ id: userIdToDelete, token })).unwrap();
      // Show success notification
      toast.success("User deleted successfully!");
      dispatch(getAllUsers(token));
      setDeleteDialogOpen(false);
    } catch (err) {
      // Show error notification
      toast.error("Failed to delete user.");
      console.error("Failed to delete user:", err);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserIdToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (userStatus === "failed") {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
          style={{ minWidth: "200px", padding: "13px", marginLeft: "10px" }}
          aria-label="Add User"
        >
          Add User
        </Button>
        <Box>
          <TextField
            label="Search users by name"
            variant="outlined"
            margin="normal"
            // value={searchTerm}
            // onChange={handleSearch}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: "15px" }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="User Table">
          <TableHead style={{ backgroundColor: "darkblue" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(user)}
                    >
                      <EditIcon /> {/* Edit icon */}
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteClick(user.userId)}
                    >
                      <DeleteIcon /> {/* Delete icon */}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="add-user-dialog-title"
        aria-describedby="add-user-dialog-description"
      >
        <DialogTitle id="add-user-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Full Name"
              name="fullname"
              value={newUser.fullname}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={newUser.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} color="primary">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {userToEdit && (
            <form onSubmit={handleEditSubmit}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Full Name"
                type="text"
                fullWidth
                value={userToEdit.name}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={userToEdit.email}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                name="role"
                label="Role"
                type="text"
                fullWidth
                value={userToEdit.role}
                onChange={handleEditChange}
              />
              <DialogActions>
                <Button
                  onClick={() => setEditDialogOpen(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-user-dialog-title"
        aria-describedby="delete-user-dialog-description"
      >
        <DialogTitle id="delete-user-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserAuthentication;
