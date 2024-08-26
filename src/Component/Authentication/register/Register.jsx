import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../features/accountusers/accountusers";
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
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Registration successful!");
      navigate("/signin");
    }
  }, [status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
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
              color="primary"
              fullWidth
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <CircularProgress size={24} />
              ) : (
                "Register"
              )}
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

export default Register;
