import { createTheme } from "@mui/material";

export const DrawerWidth=250;

const theme = createTheme({
    palette: {
      primary: {
        main: '#682396',
      },
      secondary: {
        main: '#f6f5f7',
      },
    },
    typography: {
      h5: {
        fontWeight: 700,
      },
    },
  });
  
  export default theme;