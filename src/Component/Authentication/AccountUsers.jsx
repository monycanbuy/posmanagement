import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { changePassword } from "../../features/accountusers/accountusers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(changePassword(formData));
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Change Password
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default ChangePassword;
