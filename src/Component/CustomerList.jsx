import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  fetchTransactionTypes,
  addCustomer,
  editCustomer,
  deleteCustomer,
  searchCustomersByDate,
} from "../features/customers/customerSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomerList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const customers = useSelector((state) => state.customers.customers);
  const transactionTypes = useSelector(
    (state) => state.customers.transactionTypes
  );
  const status = useSelector((state) => state.customers.status);
  const error = useSelector((state) => state.customers.error);
  const token = useSelector((state) => state.customers.token);
  const userRole = useSelector((state) => state.customers.userRole);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    amount: "",
    phone: "",
    transactionTypeId: "",
  });
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        searchCustomersByDate({
          startDate,
          endDate,
          userName: token.name,
          role: userRole,
        })
      );
    }
  }, [dispatch, startDate, endDate, userRole, token.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the logged-in user's identity
    const loggedInUser = token.name; // Adjust this based on your actual token structure

    const customerData = {
      ...newCustomer,
      createdBy: loggedInUser, // Set createdBy to the logged-in user's identity
      transactionDate: new Date().toISOString(),
      timeStamp: new Date().toISOString(),
      name: newCustomer.name || "defaultName", // Ensure the field is not empty
      amount: newCustomer.amount || 0.1, // Ensure the field is not zero
    };

    if (editMode) {
      customerData.id = editingCustomerId; // Include id only for update
    }

    try {
      if (editMode) {
        await dispatch(
          editCustomer({ id: editingCustomerId, customer: customerData, token })
        ).unwrap();
      } else {
        await dispatch(addCustomer({ customer: customerData, token })).unwrap();
        toast.success("User updated successfully!");
        dispatch(fetchCustomers()).unwrap(); // Refetch customers after adding/editing
      }

      setOpen(false); // Close the dialog after submitting the form
      setNewCustomer({
        name: "",
        amount: "",
        phone: "",
        transactionTypeId: "",
      }); // Reset form fields
      setEditMode(false); // Reset edit mode
      setEditingCustomerId(null); // Reset editing customer id
    } catch (error) {
      console.error("Failed to add/edit customer: ", error);
    }
  };

  const handleEditClick = (customer) => {
    setNewCustomer({
      name: customer.name,
      amount: customer.amount,
      phone: customer.phone,
      transactionTypeId: customer.transactionTypeId,
    });
    setEditingCustomerId(customer.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteCustomer({ id, token })).unwrap();
      dispatch(fetchCustomers()); // Re-fetch customers after deleting
    } catch (error) {
      console.error("Failed to delete customer: ", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEndDate(selectedEndDate);

    if (startDate && selectedEndDate) {
      dispatch(
        searchCustomersByDate({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(selectedEndDate).toISOString(),
          userName: token.name,
          role: userRole,
          token, // Include the token here
        })
      );
    }
  };

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);

    if (selectedStartDate && endDate) {
      dispatch(
        searchCustomersByDate({
          startDate: new Date(selectedStartDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          userName: token.name,
          role: userRole,
          token, // Include the token here
        })
      );
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
  );

  const totalAmount = filteredCustomers.reduce(
    (sum, customer) => sum + (customer.amount || 0),
    0
  ); // Calculate total amount

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
          style={{ marginRight: "15px", minWidth: "200px", padding: "15px" }}
        >
          Add Customer
        </Button>
        {userRole === "Admin" && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-evenly"
            width="100%"
          >
            <TextField
              label="Search by name or phone"
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={handleSearch}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "15px" }}
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "15px" }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "darkblue" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Amount</TableCell>
              {userRole === "Admin" && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.createdBy}</TableCell>
                  <TableCell>
                    {
                      transactionTypes.find(
                        (type) => type.id === customer.transactionTypeId
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{customer.amount}</TableCell>
                  {userRole === "Admin" && (
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(customer)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteClick(customer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredCustomers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Typography variant="h6" align="right" style={{ marginTop: "10px" }}>
        Total Amount: {totalAmount}
      </Typography>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={newCustomer.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Amount"
              name="amount"
              value={newCustomer.amount}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={newCustomer.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Transaction Type</InputLabel>
              <Select
                name="transactionTypeId"
                value={newCustomer.transactionTypeId}
                onChange={handleChange}
              >
                {transactionTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerList;
