import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from "react-toastify";

import axios from 'axios';

const BASE_URL="http://justhitclick.somee.com/api/Auth";
const REGISTER="http://justhitclick.somee.com/api/Auth/Register";
const LOGIN="http://justhitclick.somee.com/api/Auth/Login";
const REFRESH_TOKEN="http://justhitclick.somee.com/api/Auth/RefreshToken";
const CHANGE_PASSWORD="http://justhitclick.somee.com/api/Auth/ChangePassword";
const EDIT_USER="http://justhitclick.somee.com/api/Auth/EditUser";
const DELETE_USER = `${BASE_URL}/DeleteUser`; // Add DELETE_USER constant
const UPDATE_PROFILE_BY_EMAIL = 'http://justhitclick.somee.com/api/Auth/update-profile';
/////Customers crud
const GETALL_CUSTOMERS = 'http://justhitclick.somee.com/api';
const API_TRANSACTION_TYPES = 'http://justhitclick.somee.com/api/TransactionType';
const ADD_NEW_CUSTOMERS = 'http://justhitclick.somee.com/api/Customer';


const initialState = {
    user: null,
    //customers: null,
    token: null,
    refreshToken: null,
    users: [], // Add this line
    customers: [], // To store customer data
    transactionTypes: [],
    status: 'idle',
    error: null,
    userRole: null,
};


export const getUsers = createAsyncThunk(
    'auth/getUsers',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage

            const response = await axios.get(`${BASE_URL}/GetUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the request header
                },
            });

            return response.data; // Return the user data, including profile image
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch users!');
        }
    }
);


export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(REGISTER, userData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const login = createAsyncThunk(
    'auth/login',
    async ({ formData }, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://justhitclick.somee.com/api/Auth/Login', formData);
  
        console.log('API Response:', response.data); // Log the entire response
        
        // Access the token from the nested data object
        const token = response.data.data.token;
        const user = response.data.data;
        const userRole = response.data.data?.role;
        //if (userRole) {
           // localStorage.setItem('userRole', JSON.stringify(userRole));
         // }

        // Dispatch the action to set the user role in the state
        console.log('User Role:', userRole);
  
         //if (!token) {
           //throw new Error('No token received');
         //}
  
        // Store token in localStorage or Redux state
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Store user info as JSON
        localStorage.setItem('userRole', JSON.stringify(userRole)); // Store user info as JSON
  
        return { token, user,userRole }; // Optionally return user info as well
      } catch (error) {
        console.error('Login failed:', error);
            return rejectWithValue(error.response?.data || 'Login failed!');
      }
    }
  );
  
export const refreshToken = createAsyncThunk('auth/refreshToken', async (tokenData, { rejectWithValue }) => {
    try {
        const response = await axios.post(REFRESH_TOKEN, tokenData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async ({ email, currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const response = await fetch(CHANGE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, currentPassword, newPassword }),
            });

            // Attempt to parse the response as JSON
            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                // If parsing fails, assume the response is plain text
                if (response.ok) {
                    return { message: text }; // Treat plain text as a success message
                } else {
                    throw new Error(text);
                }
            }

            if (!response.ok) {
                throw new Error(data.message || 'Password change failed.');
            }

            return data;
        } catch (error) {
            console.error('Change Password Error:', error);
            return rejectWithValue({ message: error.message });
        }
    }
);

// Define the logout action
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    dispatch(clearUserState());
    dispatch(setStatusIdle()); // Make sure to reset the status
});
  
// New thunk to delete a user
export const deleteUser = createAsyncThunk('auth/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${DELETE_USER}/${id}`);
        return response.data; // Return the deleted user data (if needed)
    } catch (err) {
        return rejectWithValue(err.response.data); // Handle errors
    }
});

export const editUser = createAsyncThunk(
    'auth/editUser',
    async ({ id, userData }, { rejectWithValue }) => {
      try {
        // Send a PUT request to update the user
        const response = await axios.put(`${EDIT_USER}/${id}`, {
          fullname: userData.fullname,
          email: userData.email,
          phone: userData.phone,
          role: {
            id: userData.role.id,
            name: userData.role.name,
          },
        });
  
        return response.data; // Return the updated user data
      } catch (err) {
        return rejectWithValue(err.response.data); // Handle errors
      }
    }
  );

  // Thunk to update the user's profile
export const updateProfile = createAsyncThunk(
    'account/updateProfile',
    async ({ fullname, phone, profileImage }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(UPDATE_PROFILE_BY_EMAIL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullname,
                    phone,
                    profileImage,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Update Profile Error:', error);
            return rejectWithValue({ message: error.message });
        }
    }
);


// New method to fetch all customers
export const getAllCustomers = createAsyncThunk('customer/getAllCustomers', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${GETALL_CUSTOMERS}/Customer`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data; // Adjust based on the structure of your API response
    } catch (err) {
        return rejectWithValue(err.response.data || 'Failed to fetch customers.');
    }
});

export const getTransactionTypes = createAsyncThunk(
    'customers/fetchTransactionTypes',
    async (_, { getState, rejectWithValue }) => {
      const { token } = getState().auth;
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

 
  export const addNewCustomer = createAsyncThunk(
    'customer/addNewCustomer',
    async (customerData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(ADD_NEW_CUSTOMERS, customerData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to add new customer.');
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customer/updateCustomer',
    async ({ id, customer, token }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${ADD_NEW_CUSTOMERS}/${id}`, customer, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (error) {
        console.error('Update Customer Error:', error.response);
        return rejectWithValue(error.response?.data || 'Failed to update customer.');
      }
    }
  );

  export const deleteCustomer = createAsyncThunk(
    "accountusers/deleteCustomer",
    async ({ id, token }, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`http://justhitclick.somee.com/api/Customer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  // New thunk to search for customers
  export const searchCustomers = createAsyncThunk('customers/searchCustomers', async (searchTerm, { rejectWithValue }) => {
    if (!searchTerm) {
      return rejectWithValue("Search term cannot be empty");
    }
  
    try {
      // URL encoding the search term
      const encodedSearchTerm = encodeURIComponent(searchTerm);
  
      // Optional: Include token if required for authentication
      const token = localStorage.getItem('token');  // Or get it from another state/store
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Making the API call
      const response = await axios.get(`${API_CUSTOMERS}/search?searchTerm=${encodedSearchTerm}`, config);
      return response.data;
  
    } catch (error) {
      // Handling error response
      const errorMsg = error.response ? error.response.data : error.message;
      return rejectWithValue(errorMsg);
    }
  });
  
  

export const searchCustomersByDate = createAsyncThunk(
    'customers/searchByDate',
    async ({ startDate, endDate, userName, role, token }, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `http://justhitclick.somee.com/api/Customer/searchByDate`,
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

 




  


const authSlice = createSlice({
    name: 'auth',
    initialState:{ token: null, status: 'idle', error: null },
    reducers: {
        clearUserState: (state) => {
            // Clear user-related state
            state.user = null;
            state.user = [];
            state.customers = []; 
            state.userRole = null;
            
        },
        setStatusIdle: (state) => {
            state.status = 'idle';
        },
        removeCustomer(state, action) {
            state.customers = state.customers.filter(customer => customer.id !== action.payload);
        },
        setUserRole(state,action){
            state.userRole = action.payload; 
        },
    },
    extraReducers: (builder) => {
        builder
        builder.addCase(logout.fulfilled, (state) => {
            // Optionally handle any additional state changes after logout
                state.token = null;
                state.refreshToken = null;
                state.user = null;
                state.customers = []; // Optional: clear customers on logout
                state.users = []; // Optional: clear users on logout
          })
          .addCase(register.fulfilled, (state, action) => {
            console.log("Register fulfilled with payload:", action.payload);
            if (action.payload && action.payload.user && action.payload.token) {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            }
        })
          .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(login.fulfilled, (state, action) => {
                console.log('Login successful, token:', action.payload.token); 
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.userRole = action.payload.userRole;
                //state.userRole = action.payload.data?.role || null;
                //state.refreshToken = action.payload.refreshToken;
            })
            .addCase(login.rejected, (state, action) => {
                console.error('Login failed with error:', action.payload);
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            }).addCase(changePassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                toast.success("Password changed successfully!");
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
              
                // Log the action payload to understand the structure
                console.error('Change Password Error:', action.payload);
              
                const errorMessage = action.payload?.message || "Password change failed.";
                toast.error(action.payload?.message || "Password change failed.");
            }).addCase(getUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload; // Assuming your API returns an array of users
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            }).addCase(editUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            }).addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = state.users.filter(user => user.id !== action.meta.arg); // Remove the deleted user
                toast.success("User deleted successfully!"); // Show success message
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to delete user.';
                toast.error(state.error); // Show error message
            }).addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload; // Update the user profile in the state
                toast.success("Profile updated successfully!");
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                toast.error(action.payload?.message || "Failed to update profile.");
            }).addCase(getAllCustomers.pending, (state) => {
                state.status = 'loading';
              })
              .addCase(getAllCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
              })
              .addCase(getAllCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
              }).addCase(getTransactionTypes.pending, (state) => {
                state.transactionTypesStatus = 'loading';
              })
              .addCase(getTransactionTypes.fulfilled, (state, action) => {
                state.transactionTypesStatus = 'succeeded';
                state.transactionTypes = action.payload;
              })
              .addCase(getTransactionTypes.rejected, (state, action) => {
                state.transactionTypesStatus = 'failed';
                state.error = action.payload;
              }).addCase(updateCustomer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.customers.findIndex(customer => customer.id === action.payload.id);
                if (index !== -1) {
                    state.customers[index] = action.payload; // Update the customer in the state
                }
                toast.success("Customer updated successfully!"); // Show success message
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                toast.error(action.payload?.message || "Failed to update customer.");
            }).addCase(deleteCustomer.pending, (state) => {
                state.status = 'loading'; // Set the loading state
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Set the succeeded state
                state.customers = state.customers.filter(customer => customer.id !== action.payload); // Remove the deleted customer from the state
                //toast.success("Customer deleted successfully!"); // Show success message
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.status = 'failed'; // Set the failed state
                state.error = action.payload?.message || 'Failed to delete customer.'; // Handle the error
                toast.error(state.error); // Show error message
            }).addCase(searchCustomersByDate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchCustomersByDate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload; // Assuming the API returns an array of customers
            })
            .addCase(searchCustomersByDate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearUserState,setStatusIdle,setUserRole,removeCustomer } = authSlice.actions;
export const selectUserRole = (state) => state.auth.userRole; 
export default authSlice.reducer;
