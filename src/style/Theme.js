import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#648dae',
        },
        warning: {
            main: '#ff9800',
        },
        error: {
            main: '#f44336',
        },
    },
});

export default theme;