import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserInfo,
  changePassword,
  selectUserInfo,
  selectLoading,
  selectToken,
  selectError,
} from "../features/users/usersSlice";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import jwt_decode from "jwt-decode";

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector((state) => state.users.error);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const token = useSelector((state) => state.customers.token); // Adjust according to your state structure
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const name =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        const email =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ];
        setUserInfo({ name, email });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changePassword({ currentPassword, newPassword, token }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={userInfo.name}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={userInfo.email}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Box sx={{ mt: 2, position: "relative" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Change Password
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: "primary",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default ChangePasswordForm;
