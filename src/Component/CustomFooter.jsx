import React from "react";
import { Box, Typography } from "@mui/material";

const CustomFooter = ({ totalAmount }) => {
  return (
    <Box
      sx={{
        padding: "10px",
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h6">
        Grand Total: ${totalAmount.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default CustomFooter;
