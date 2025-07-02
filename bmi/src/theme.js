import { createTheme } from '@mui/material/styles';

// Example Material You-inspired theme
// Colors can be customized further based on dynamic theming if desired,
// but for now, a static example.
const theme = createTheme({
  palette: {
    primary: {
      main: '#6750A4', // A Material You-style purple
    },
    secondary: {
      main: '#7D5260', // A Material You-style pink/maroon
    },
    background: {
      default: '#FFFBFE', // Light background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
    },
    error: {
      main: '#B3261E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 400,
    },
    h2: {
      fontWeight: 400,
    },
    h3: {
      fontWeight: 400,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // More modern button text
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 12, // Softer corners, common in Material You
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px', // Default padding for Paper
        },
        elevation1: {
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)', // More subtle shadows
        },
        elevation3: {
           boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Consistent button border radius
        },
      },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'filled', // Filled variant is common in Material You
        }
    },
    MuiSelect: {
        defaultProps: {
            variant: 'filled',
        }
    }
  },
});

export default theme;
