import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API endpoint
const API_URL = 'https://justgitclicks.azurewebsites.net/api/TransactionType';

// Create an async thunk for fetching transaction types
export const fetchTransactionTypes = createAsyncThunk(
  'transactionTypes/fetchTransactionTypes',
  async () => {
    const response = await axios.get(API_URL);
    return response.data; // Assuming the response data is an array of transaction types
  }
);

// Create a slice for transaction types
const transactionTypeSlice = createSlice({
  name: 'transactionTypes',
  initialState: {
    transactionTypes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionTypes = action.payload;
      })
      .addCase(fetchTransactionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk and the reducer
export default transactionTypeSlice.reducer;
