import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#dd628f',
    },
    secondary: {
      main: '#826af9',
    },
    auth: '#826af9',
    danger: red,
  },
  typography: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: 500,
  },
});
