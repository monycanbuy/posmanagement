import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCustomer,
  getAllCustomers,
  getTransactionTypes,
  updateCustomer,
} from "../../features/accountusers/accountusers";
import { toast } from "react-toastify";

const AddCustomers = ({ open, onClose, customer, isEditMode }) => {
  const dispatch = useDispatch();
  const transactionTypes =
    useSelector((state) => state.auth.transactionTypes) || [];
  const user = JSON.parse(localStorage.getItem("user"));

  const [customerData, setCustomerData] = useState({
    name: "",
    amount: "",
    timeStamp: new Date().toISOString(),
    transactionDate: new Date().toISOString(),
    phone: "",
    transactionTypeId: "",
    createdBy: user?.fullname || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getTransactionTypes());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && customer) {
      const transactionTypeObj = transactionTypes.find(
        (type) => type.name === customer.transactionType
      );
      const transactionTypeId = transactionTypeObj ? transactionTypeObj.id : "";

      setCustomerData({
        name: customer.name || "",
        amount: customer.amount || "",
        phone: customer.phone || "",
        transactionTypeId: transactionTypeId,
        createdBy: user?.fullname || "",
        timeStamp: customer.timeStamp || new Date().toISOString(),
        transactionDate: customer.transactionDate || new Date().toISOString(),
      });
    } else {
      setCustomerData({
        name: "",
        amount: "",
        phone: "",
        transactionTypeId: "",
        createdBy: user?.fullname || "",
        timeStamp: new Date().toISOString(),
        transactionDate: new Date().toISOString(),
      });
    }
  }, [isEditMode, customer, transactionTypes, user?.fullname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const updatedCustomerData = {
      ...customerData,
      createdBy: user?.fullname || "Unknown User",
      transactionDate: new Date().toISOString(),
      timeStamp: new Date().toISOString(),
      name: customerData.name || "defaultName",
      amount: customerData.amount || 0.1,
    };

    try {
      if (isEditMode) {
        updatedCustomerData.id = customer?.id;
        await dispatch(
          updateCustomer({
            id: updatedCustomerData.id,
            customer: updatedCustomerData,
            token,
          })
        ).unwrap();
      } else {
        await dispatch(addNewCustomer(updatedCustomerData)).unwrap();
        toast.success("Customer added successfully!");
      }

      onClose(); // Close the dialog after successful submission
      setCustomerData({
        name: "",
        amount: "",
        phone: "",
        transactionTypeId: "",
        createdBy: user?.fullname || "",
      });
      dispatch(getAllCustomers()).unwrap();
    } catch (error) {
      console.error("Failed to add/edit customer: ", error);
      toast.error(
        `Failed to ${isEditMode ? "update" : "add"} customer. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditMode ? "Edit Customer" : "Add New Customer"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          Created By: {user?.fullname || "Unknown User"}
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={customerData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={customerData.amount}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Phone"
          name="phone"
          value={customerData.phone}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
          <Select
            labelId="transaction-type-label"
            label="Transaction Type"
            name="transactionTypeId"
            value={customerData.transactionTypeId || ""}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? (
            <>
              <CircularProgress size={24} style={{ marginRight: "8px" }} />
              {isEditMode ? "Updating..." : "Saving..."}
            </>
          ) : isEditMode ? (
            "Update Customer"
          ) : (
            "Add Customer"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomers;
