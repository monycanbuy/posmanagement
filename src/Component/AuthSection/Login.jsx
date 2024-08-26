import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import posImg from "../../assets/images/posImage.png"; // Make sure this path is correct
import logo from "../../assets/images/jhcLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import LoginOutlined from "@mui/icons-material/LoginOutlined"; // Import LoginOutlined icon
import { login } from "../../features/accountusers/accountusers";
import CustomButton from "../../CustomButton";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://justhitclick.com/">
        https://justhitclick.com/
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "succeeded" && token) {
      // Check if the user is not currently logged out
      if (localStorage.getItem("token")) {
        // Adjusted check
        toast.success("Login successful!");
        navigate("/"); // Redirect after successful login
      }
    } else if (status === "failed") {
      toast.error(error || "Login failed!"); // Show error toast
    }
  }, [status, error, navigate, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(login({ formData }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast.error(`Login failed: ${error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if both fields are empty or if the password length is less than 6
  const isButtonDisabled =
    !formData.email || formData.password.length < 6 || isLoading;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative", // Set position to relative for the overlay
            backgroundImage: `url(${posImg})`, // Background image
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay effect */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#ac0af7", // Overlay color
              opacity: 0.5, // Adjust opacity for the overlay effect
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="Logo"
              src={logo}
              sx={{ width: 50, height: 50, marginBottom: 2 }}
            />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <CustomButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={
                  isLoading ? <CircularProgress size={20} /> : <LoginOutlined />
                }
                disabled={isButtonDisabled} // Disable button if conditions are met
              >
                {isLoading ? "" : "Login"}
              </CustomButton>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
