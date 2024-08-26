import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_CUSTOMERS = 'https://justgitclicks.azurewebsites.net/api/Customer';
const API_LOGIN = 'https://justgitclicks.azurewebsites.net/api/Account/login';
const API_TRANSACTION_TYPES = 'https://justgitclicks.azurewebsites.net/api/TransactionType';

const initialState = {
  customers: [],
  transactionTypes: [],
  searchResults: [],
  status: 'idle',
  transactionTypesStatus: 'idle',
  error: null,
  loading: false,
  token: localStorage.getItem('token') || null,
  refreshToken: null,
  userId: null,
  userRole: null,
  fullname: null, // Add fullname here
};


export const loginUser = createAsyncThunk('customers/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_LOGIN, credentials);
    if (response.data.token) {
      return response.data;
    } else {
      return rejectWithValue('Invalid login response');
    }
  } catch (err) {
    return rejectWithValue(err.response?.data || 'An error occurred during login.');
  }
});

// export const login = createAsyncThunk(
//   'customers/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(API_LOGIN, { email, password });
//       return response.data;
//     } catch (err) {
//       if (!err.response) {
//         throw err;
//       }
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().customers;
    try {
      const response = await axios.get(API_CUSTOMERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchTransactionTypes = createAsyncThunk(
  'customers/fetchTransactionTypes',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().customers;
    try {
      const response = await axios.get(API_TRANSACTION_TYPES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async ({ customer, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_CUSTOMERS, customer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(err.response.data);
      }else{
        return rejectWithValue({ message: err.message });
      }
      
    }
  }
);

export const editCustomer = createAsyncThunk(
  'customers/editCustomer',
  async ({ id, customer, token }, { rejectWithValue }) => {
      try {
          const response = await axios.put(`https://justgitclicks.azurewebsites.net/api/Customer/${id}`, customer, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          return response.data;
      } catch (error) {
          if (error.response && error.response.data) {
              return rejectWithValue(error.response.data);
          } else {
              return rejectWithValue(error.message);
          }
      }
  }
);


export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_CUSTOMERS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return the ID of the deleted customer
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);


export const searchCustomers = createAsyncThunk('customers/searchCustomers', async (searchTerm, { rejectWithValue }) => {
  if (!searchTerm) {
    return rejectWithValue("Search term cannot be empty");
  }
  try {
    const response = await axios.get(`${API_CUSTOMERS}/search?searchTerm=${searchTerm}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const searchCustomersByDate = createAsyncThunk(
  'customers/searchByDate',
  async ({ startDate, endDate, userName, role, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://justgitclicks.azurewebsites.net/api/Customer/searchByDate`,
        {
          params: { startDate, endDate, userName, role },
          headers: { Authorization: `Bearer ${token}` }, // Use the token here
        }
      );
      return response.data; // This should be an array of customers
    } catch (error) {
      console.error("Error fetching customers by date:", error); // Log the error
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);






const customerSlice = createSlice({
  name: 'customers',
  initialState:{
    token:localStorage.getItem('token') || null,
  },
  reducers: {
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
    logout(state) {
      state.token = null;
      state.id = null;
      state.refreshToken = null;
      state.userRole = null;
      state.fullname = null; // Reset fullname on logout
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(login.fulfilled, (state, action) => {
      //   const { token, refreshToken, roleName, fullname } = action.payload;
      //   state.token = token;
      //   state.refreshToken = refreshToken;
      //   state.userRole = roleName;
      //   state.fullname = fullname; // Set fullname from login response
      //   state.id = action.payload.id;
      // })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        console.log("User ID set in state:", state.userId); 
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTransactionTypes.pending, (state) => {
        state.transactionTypesStatus = 'loading';
      })
      .addCase(fetchTransactionTypes.fulfilled, (state, action) => {
        state.transactionTypesStatus = 'succeeded';
        state.transactionTypes = action.payload;
      })
      .addCase(fetchTransactionTypes.rejected, (state, action) => {
        state.transactionTypesStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        const index= state.customers.findIndex(customer=>customer.id===action.payload.id);
        if(index!==-1){
          state.customers[index]=action.payload;
          
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        const id = action.payload; // Get the ID from the action payload
        state.customers = state.customers.filter(customer => customer.id !== id); // Remove the customer from the array
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(searchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      }).addCase(searchCustomersByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchCustomersByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
        console.log("State Updated with Customers:", state.customers);
      })
      .addCase(searchCustomersByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setToken,clearToken,setUserRole, logout,setUserId } = customerSlice.actions;

export const selectUserId = (state) => state.users.id;
export const selectToken = (state) => state.users.token;
export const selectFullname = (state) => state.users.fullname;

export default customerSlice.reducer;