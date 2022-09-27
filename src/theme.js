import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    h4: {
      fontFamily: '"Roboto Slab", "IBM Plex Serif", "Arial", serif',
    },
    body1: {
      fontFamily: '"Nunito", "Open Sans", "Lato", sans-serif',
    },
  },
});

export default theme;
