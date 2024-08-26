import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  changePassword,
  logout,
} from "../../features/accountusers/accountusers";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ open, onClose, email }) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dispatch(
        changePassword({ email, currentPassword, newPassword })
      ).unwrap();

      // Assuming the response might contain a token after changing the password
      if (response.token) {
        localStorage.setItem("token", response.token); // Store the new token
        // Optionally, dispatch any action to set user state if needed
      }

      toast.success("Password changed successfully!");
      dispatch(logout()); // Ensure user is logged out properly
      navigate("login"); // Navigate to home or login page
      onClose(); // Close the dialog after success
    } catch (error) {
      console.error("Error in handleChangePassword:", error);
      const errorMessage = error?.message || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Current Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="dense"
          label="New Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleChangePassword}
          color="primary"
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
