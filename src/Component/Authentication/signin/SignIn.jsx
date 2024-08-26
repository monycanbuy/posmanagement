import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../../features/accountusers/accountusers";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Login successful!");
      navigate("/"); // Redirect after successful login
    } else if (status === "failed") {
      toast.error(error || "Login failed!"); // Show error toast
    }
  }, [status, error, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
          {status === "failed" && (
            <Typography color="error" variant="body2" mt={2}>
              {typeof error === "string" ? error : JSON.stringify(error)}
            </Typography>
          )}
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default SignIn;
