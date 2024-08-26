import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  fetchTransactionTypes,
  addCustomer,
  editCustomer,
  deleteCustomer, // You'll need to implement this
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
  const [editCustomerData, setEditCustomerData] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = {
      ...newCustomer,
      createdBy: "someUser", // Replace with actual user data
      transactionDate: new Date().toISOString(),
      timeStamp: new Date().toISOString(),
    };

    try {
      await dispatch(addCustomer({ customer: customerData, token })).unwrap();
      dispatch(fetchCustomers());
      setOpen(false);
      setNewCustomer({
        name: "",
        amount: "",
        phone: "",
        transactionTypeId: "",
      });
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const customerData = {
      ...editCustomerData,
    };

    try {
      await dispatch(
        editCustomer({ id: editCustomerData.id, customer: customerData, token })
      ).unwrap();
      dispatch(fetchCustomers());
      setEditOpen(false);
      setEditCustomerData(null);
    } catch (error) {
      console.error("Failed to edit customer:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCustomer({ id, token })).unwrap(); // Implement deleteCustomer function
      dispatch(fetchCustomers());
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
  };

  const handleEditOpen = (customer) => {
    setEditCustomerData(customer);
    setEditOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4">Customer List</Typography>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
      >
        Add Customer
      </Button>
      {status === "loading" && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Transaction Type</TableCell>
              {userRole === "Admin" && <TableCell>Actions</TableCell>}{" "}
              {/* Conditional rendering */}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.amount}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.transactionType?.name}</TableCell>
                  {userRole === "Admin" && (
                    <TableCell>
                      <IconButton onClick={() => handleEditOpen(customer)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(customer.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
      {/* Add Customer Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCustomer.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newCustomer.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={newCustomer.phone}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onClose={handleClose}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editCustomerData?.name || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={editCustomerData?.amount || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={editCustomerData?.phone || ""}
            onChange={handleEditChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Transaction Type</InputLabel>
            <Select
              name="transactionTypeId"
              value={editCustomerData?.transactionTypeId || ""}
              onChange={handleEditChange}
            >
              {transactionTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerList;
