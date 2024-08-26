import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserIdFromToken } from "../../utils/getUserRole";

const API_URL = "https://justgitclicks.azurewebsites.net/api/Account/users";
const REGISTER_URL = "https://justgitclicks.azurewebsites.net/api/Account/register";
const DELETEUSER_URL = "https://justgitclicks.azurewebsites.net/api/Account/delete-user";
const UPDATE_USER = "https://justgitclicks.azurewebsites.net/api/Account/update-user";
const CHANGE_PASSWORD_BASE_URL = "https://justgitclicks.azurewebsites.net/api/Account"; // Base URL for change password

// Async thunks

export const getAllUsers = createAsyncThunk('users/getAllUsers', async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (newUser, { getState, rejectWithValue }) => {
    const token = getState().users.token; // Use users state
    try {
      const response = await axios.post(REGISTER_URL, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.flag) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'An error occurred during registration.');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${DELETEUSER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred during deletion.');
    }
  }
);

export const editUser = createAsyncThunk(
  "users/editUser",
  async ({ updatedUser, token }) => {
    const response = await axios.put(UPDATE_USER, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const changePassword = createAsyncThunk(
  'users/changePassword',
  async ({ userId, currentPassword, newPassword, token }, thunkAPI) => {
    const response = await fetch(`https://justgitclicks.azurewebsites.net/api/Account/${userId}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ CurrentPassword: currentPassword, NewPassword: newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return thunkAPI.rejectWithValue(errorData);
    }

    return await response.json();
  }
);


// export const changePassword = createAsyncThunk(
//   'users/changePassword',
//   async ({ currentPassword, newPassword }, { getState, rejectWithValue }) => {
//     const token = getState().customers.token;
//     const userId = getUserIdFromToken(token);

//     if (!userId) {
//       return rejectWithValue('Invalid user ID');
//     }

//     try {
//       const response = await axios.post(
//         `${CHANGE_PASSWORD_BASE_URL}/${userId}/change-password`,
//         { currentPassword, newPassword },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ currentPassword, newPassword }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error('Failed to change password');
//       }

//       return response.data;
//     } catch (error) {
//       console.error("Error changing password:", error.response ? error.response.data : error.message);
//     return rejectWithValue(error.response.data);
//     }
//   }
// );

// Slice

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    userInfo: null,
    userId: null,
    status: "idle",
    error: null,
    loading: false,
    token: localStorage.getItem('token') || null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
    clearState: (state) => {
      state.userInfo = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.userId !== action.meta.arg.id);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.userId === action.payload.userId);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors

export const selectAllUsers = (state) => state.users.users;
export const selectUserInfo = (state) => state.users.userInfo;
export const selectLoading = (state) => state.users.loading;
export const selectToken = (state) => state.users.token;
export const selectError = (state) => state.users.error;
export const selectUserId = (state) => state.users.id;

// Export the reducer and actions

export const { setUserInfo, setToken, clearState } = usersSlice.actions;
export default usersSlice.reducer;
