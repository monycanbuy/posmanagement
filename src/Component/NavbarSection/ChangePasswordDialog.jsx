import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../features/manageusers/usersSlice";
import { jwtDecode } from "jwt-decode";
import { setUserId } from "../../features/customers/customerSlice";

const ChangePasswordDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  // Adjust the selector if needed

  const token = useSelector((state) => state.users.token);
  const userId = useSelector((state) => state.users.userId);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        console.log("User ID from decoded token:", userId);
        setUserId(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    dispatch(
      changePassword({ id: userId, currentPassword, newPassword, token })
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Current Password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
