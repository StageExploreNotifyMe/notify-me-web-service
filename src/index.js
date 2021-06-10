import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {CssBaseline} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles';
import {SnackbarProvider} from 'notistack';
import Slide from '@material-ui/core/Slide';
import theme from "./style/Theme";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider maxSnack={3} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} TransitionComponent={Slide}>
                <App/>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
