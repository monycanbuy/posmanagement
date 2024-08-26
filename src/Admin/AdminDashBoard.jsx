import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { ManageAccounts, People } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, alpha } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUser,
  getUsers,
  logout,
  register,
  getAllCustomers,
  deleteCustomer,
  removeCustomer,
  searchCustomersByDate,
  selectUserRole,
} from "../features/accountusers/accountusers";
import { toast } from "react-toastify";
import EditUser from "../EditUser";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./EditUser/ChangePassword";
import ProfileDialog from "./EditUser/ProfileDialog";
import AddCustomers from "./Customer/AddCustomers";
import PdfGenerator from "../utils/PdfGenerator";
import CustomFooter from "../Component/CustomFooter";

const drawerWidth = 240;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f7f6f2",
  "&:hover": {
    backgroundColor: alpha("#f7f6f2", 0.8),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "150px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(2),
  width: "150px",
  borderRadius: "150px",
}));

const AdminDashBoard = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [currentView, setCurrentView] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  //const [userRole, setUserRole] = useState("");
  const [userRoleToEdit, setUserRoleToEdit] = useState("");

  // Add these states to `AdminDashBoard` component
  const [openEditUser, setOpenEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Inside your Dashboard component

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const email = useSelector((state) => state.auth.user?.email);
  const userId = useSelector((state) => state.auth.user.id);
  //const userRole = useSelector((state) => state.auth.userRole);
  const userRole = useSelector(selectUserRole);

  const [userEmail, setUserEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [openProfileDialog, setOpenProfileDialog] = useState(false); // State for the profile dialog

  const navigate = useNavigate();

  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [isHidden, setIsHidden] = useState(false);

  const [loading, setLoading] = useState(false); // New loading state

  const [openAddCustomer, setOpenAddCustomer] = useState(false);

  const {
    users = [],
    customers = [],
    status,
    error,
  } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  //const customers = useSelector((state) => state.auth.customers);

  //   const filteredCustomers = customers.filter(
  //     (customer) =>
  //       customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearchTerm =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const customerDate = new Date(customer.transactionDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Adjust end date to include the entire day
    if (end) {
      end.setHours(23, 59, 59, 999); // Set to the end of the day
    }

    const matchesDateRange =
      (!start || customerDate >= start) && (!end || customerDate <= end);

    return matchesSearchTerm && matchesDateRange;
  });

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setStartDate(value);
    if (!value) {
      // If the start date is cleared, fetch all customers
      dispatch(getAllCustomers());
    }
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    setEndDate(value);
    if (!value) {
      // If the end date is cleared, fetch all customers
      dispatch(getAllCustomers());
    }
  };

  /// search customers by date
  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        searchCustomersByDate({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          userName: token.name, // Adjust if token.name is incorrect
          role: userRole,
          token,
        })
      );
    } else if (!startDate || !endDate) {
      // Fetch all customers if either date is cleared
      dispatch(getAllCustomers());
    }
  }, [dispatch, startDate, endDate, userRole, token]);

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeProfileImageOpen = () => {
    setOpenProfileDialog(true);
    setSelectedUser(user);
    handleClose(); // Close the menu when opening the dialog
  };

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

  const handleChangeProfileImageClose = () => {
    setOpenProfileDialog(false);
  };

  const handleAddCustomerOpen = () => {
    setOpenAddCustomer(true);
  };

  const handleAddCustomerClose = () => {
    setOpenAddCustomer(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // State for delete confirmation dialog
  const handleDeleteCustomer = (userId) => {
    console.log("Preparing to delete customer with ID:", userId);
    setUserIdToDelete(userId); // Set the userId to be deleted
    setOpenConfirmDelete(true); // Open the confirmation dialog
  };

  // Confirm delete function
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      console.log("Confirming deletion of customer with ID:", userIdToDelete);
      await dispatch(deleteCustomer({ id: userIdToDelete, token })); // Call the delete function with token
      dispatch(removeCustomer(userIdToDelete)); // Update the state to remove the deleted customer
      toast.success("Customer deleted successfully!");
      console.log("Customer deleted successfully");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("Failed to delete customer: " + (error.message || error));
    } finally {
      setOpenConfirmDelete(false); // Close the confirmation dialog
    }
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false); // Close the confirmation dialog
    setUserIdToDelete(null); // Reset userId
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => {
          dispatch(getUsers()); // Refresh the user list after deletion
        })
        .catch((error) => {
          console.error("Error deleting user:", error); // Log error
          toast.error("Failed to delete user: " + (error.message || error)); // Show error toast
        });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // Clear token from storage
    navigate("/login"); // Redirect to login page

    // Optionally, redirect the user after logout
    // e.g., history.push('/login') or use useNavigate() from react-router
  };
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsEditMode(true);
    setOpen(true);
  };

  //   const handleCloses = () => {
  //     setOpen(false);
  //     setSelectedCustomer(null);
  //     setIsEditMode(false);
  //   };

  const handleOpen = () => {
    setSelectedCustomer(""); // Clear any selected customer
    setIsEditMode(false);
    setOpen(true);
  };

  const handleCloses = () => {
    setOpen(false);
    setSelectedCustomer(""); // Clear selected customer when closing
    setIsEditMode(false);
  };

  //const handleOpen = () => setOpen(true);
  //const handleCloses = () => setOpen(false);

  // State for Add User Dialog
  const [openAddUser, setOpenAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChangePasswordOpen = () => {
    setOpenChangePassword(true);
  };

  const handleChangePasswordClose = () => {
    setOpenChangePassword(false);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e) => {
    newUser({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setMobileOpen(false);
  };

  // Function to handle opening the edit dialog
  const handleEditUserOpen = (user) => {
    console.log("Editing User:", user);
    setSelectedUser(user); // Set the user to be edited
    setOpenEditUser(true); // Open the dialog
  };

  // Function to handle closing the edit dialog
  const handleEditUserClose = () => {
    setOpenEditUser(false); // Close the dialog
    setSelectedUser(null); // Clear the selected user
  };

  // Open and close Add User dialog
  const handleAddUserOpen = () => setOpenAddUser(true);
  const handleAddUserClose = () => {
    setOpenAddUser(false);
    setNewUser({ fullname: "", email: "", password: "" }); // Reset form
  };

  // Handle new user input changes
  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Save new user (mock implementation)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!newUser.fullname || !newUser.email || !newUser.password) {
      console.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Data being sent:", newUser); // Log the data
      await dispatch(register(newUser));
      toast.success("Registration successful!");
      // Reload users after successful registration
      await dispatch(getUsers());
      handleAddUserClose(); // Close dialog after successful registration
    } catch (error) {
      toast.error("Registration error:", error);
      // Handle the error, possibly by displaying it to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Log the email to the console
    console.log("User Email:", email);
  }, [email]);

  console.log("User Role:", userRole);
  const isAdmin = userRole === "Admin";
  const isUsers = userRole === "User";
  console.log("Is Admin:", isAdmin);
  const isUser = (role) => {
    return role === "User";
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {isAdmin && (
          <ListItem button onClick={() => handleViewChange("users")}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItem>
        )}
        <ListItem button onClick={() => handleViewChange("customers")}>
          <ListItemIcon>
            <ManageAccounts />
          </ListItemIcon>
          <ListItemText primary="Manage Customers" />
        </ListItem>
      </List>
    </div>
  );

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    console.log("User Role changed:", userRole);
  }, [userRole]);

  const userColumns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 200 },
    { field: "role", headerName: "Role", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="space-evenly">
          <IconButton
            color="primary"
            onClick={() => handleEditUserOpen(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const userRows =
    users.map((user) => ({
      id: user.id,
      name: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.roleName,
    })) || [];

  // Calculate total amount
  const totalAmount = customers.reduce(
    (sum, customer) => sum + customer.amount,
    0
  );

  const customerColumns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "createdby", headerName: "Created By", width: 200 },
    { field: "transactiontype", headerName: "Transaction Type", width: 150 },
    { field: "transactionDate", headerName: "Date", width: 150 },
    { field: "amount", headerName: "Amount", width: 200 },
    ...(isAdmin
      ? [
          {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-evenly"
              >
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(params.row)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteCustomer(params.row.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <Dialog
                  open={openConfirmDelete}
                  onClose={handleCloseConfirmDelete}
                >
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>
                    <Typography>
                      Are you sure you want to delete this customer?
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            ),
          },
        ]
      : []), // If not admin, don't include the "Action" column
  ];
  const customerRows =
    filteredCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      createdby: customer.createdBy,
      transactiontype: customer.transactionType.name,
      transactionDate: customer.transactionDate,
      amount: customer.amount,
    })) || [];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar src={user.profileImage} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleChangeProfileImageOpen}>
                Update Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              <ChangePassword
                open={openChangePassword}
                onClose={handleChangePasswordClose}
                email={email}
              />
              <MenuItem onClick={handleChangePasswordOpen}>
                Change Password
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {/* Render the ProfileDialog component */}
      <ProfileDialog
        open={openProfileDialog}
        onClose={handleChangeProfileImageClose}
        user={selectedUser} // Pass user ID
        setProfileImage={setProfileImage}
        // setProfileImage={(image) => {
        //   /* Function to update avatar in AppBar */
        // }} // Implement this function to update avatar in AppBar
      />
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="persistent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open={drawerOpen}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          transition: "width 0.3s ease",
        }}
      >
        <Toolbar />
        {isAdmin && currentView === "users" ? (
          <>
            <Typography variant="h5" gutterBottom>
              Manage Users
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddUserOpen} // Open the dialog on click
              >
                Add User
              </Button>
              <Box display="flex" alignItems="center">
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search Users…"
                    inputProps={{ "aria-label": "search" }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </Search>
              </Box>
            </Box>
            <Box style={{ height: 400, width: "100%" }}>
              {status === "loading" && <div>Loading...</div>}
              {status === "failed" && <div>Error: {error}</div>}
              <DataGrid
                rows={userRows}
                columns={userColumns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
                component={{
                  Footer: () => <CustomFooter totalAmount={totalAmount} />,
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiDataGrid-cell": { padding: "10px" },
                }}
              />
              {/* EditUser dialog component */}
              {selectedUser && (
                <EditUser
                  open={openEditUser}
                  user={selectedUser}
                  onClose={handleEditUserClose}
                />
              )}
            </Box>

            {/* Add User Dialog */}
            <Dialog open={openAddUser} onClose={handleAddUserClose}>
              <DialogTitle>Add New User</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSaveUser}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="fullname"
                    name="fullname"
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newUser.fullname || ""}
                    onChange={handleNewUserChange}
                  />
                  <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={newUser.email || ""}
                    onChange={handleNewUserChange}
                  />
                  <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    fullWidth
                    variant="outlined"
                    value={newUser.password || ""}
                    onChange={handleNewUserChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAddUserClose} color="primary">
                  Cancel
                </Button>
                <Button
                  aria-hidden={isHidden}
                  onClick={handleSaveUser}
                  color="primary"
                  disabled={
                    loading ||
                    !newUser.fullname ||
                    !newUser.email ||
                    !newUser.password
                  }
                  startIcon={loading && <CircularProgress size={20} />} // Show loading indicator
                >
                  {loading ? "Adding..." : "Add User"}{" "}
                  {/* Update button text */}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Manage Customers
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpen}
              >
                Add New Customer
              </Button>
              <AddCustomers
                open={open}
                onClose={handleCloses}
                customer={selectedCustomer}
                isEditMode={isEditMode}
              />
              {isAdmin && (
                <Box display="flex" alignItems="center">
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search Customers…"
                      inputProps={{ "aria-label": "search" }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Search>
                  <StyledTextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <StyledTextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => PdfGenerator.generatePDF()}
                  >
                    Download PDF
                  </Button>
                </Box>
              )}
            </Box>
            <Box style={{ height: 400, width: "100%" }} id="dataGrid">
              <DataGrid
                // rows={customerRows}
                rows={filteredCustomers.map((customer) => ({
                  id: customer.id,
                  name: customer.name,
                  phone: customer.phone,
                  createdby: customer.createdBy,
                  transactiontype: customer.transactionType.name,
                  transactionDate: customer.transactionDate,
                  amount: customer.amount,
                }))}
                columns={customerColumns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
                component={{
                  Footer: () => <CustomFooter totalAmount={totalAmount} />,
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiDataGrid-cell": { padding: "10px" },
                }}
              />
              <Box mt={2} sx={{ textAlign: "right", paddingRight: 2 }}>
                <Typography variant="h6">
                  Grand Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashBoard;
