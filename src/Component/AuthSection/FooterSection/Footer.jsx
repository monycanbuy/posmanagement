// src/components/Footer.js
import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#b12bf0",
        color: "#f6f5f7",
        padding: "10px",
        position: "fixed",
        bottom: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Justhitclick Digital Technologies LTD, All
        rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="/privacy-policy" color="inherit" underline="hover">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="/terms-of-service" color="inherit" underline="hover">
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
