import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionTypes } from "../features/transaction/transactionTypeSlice";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const TransactionTypeDropdown = ({ onChange, value }) => {
  const dispatch = useDispatch();
  const { transactionTypes, loading, error } = useSelector(
    (state) => state.transactionTypes
  );

  useEffect(() => {
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
      <Select
        labelId="transaction-type-label"
        value={value}
        onChange={onChange}
      >
        {transactionTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TransactionTypeDropdown;
