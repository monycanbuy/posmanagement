import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#682396", // Set the background color to your desired color
  color: theme.palette.getContrastText("#682396"), // Ensure the text is readable
  "&:hover": {
    backgroundColor: "#531b79", // Darken the background on hover
  },
}));
export default CustomButton;
