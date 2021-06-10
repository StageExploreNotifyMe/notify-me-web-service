import {render, waitForElementToBeRemoved} from "@testing-library/react";
import theme from "../style/Theme";
import {CssBaseline} from "@material-ui/core";
import {SnackbarProvider} from "notistack";
import Slide from "@material-ui/core/Slide";
import {ThemeProvider} from "@material-ui/core/styles";
import React from "react";
import {Router} from "react-router-dom";
import {createMemoryHistory} from "history";

async function waitForLoadingSpinner(container) {
    let loadingSpinner = container.querySelector('.loading');
    expect(loadingSpinner).toBeInTheDocument()
    await waitForElementToBeRemoved(loadingSpinner)
    return loadingSpinner;
}

function RenderComponent(Component, props, historyItems = []) {
    const history = createMemoryHistory();
    if (historyItems.length === 0) {
        history.push("/");
    } else {
        historyItems.forEach(historyItem => history.push(historyItem))
    }

    return render(<Router history={history}>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider maxSnack={3} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} TransitionComponent={Slide}>
                <Component {...props}/>
            </SnackbarProvider>
        </ThemeProvider>
    </Router>);
}

export {waitForLoadingSpinner, RenderComponent};