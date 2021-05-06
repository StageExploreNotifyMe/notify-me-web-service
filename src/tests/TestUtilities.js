import {waitForElementToBeRemoved} from "@testing-library/react";

async function waitForLoadingSpinner(container) {
    let loadingSpinner = container.querySelector('.loading');
    expect(loadingSpinner).toBeInTheDocument()
    await waitForElementToBeRemoved(loadingSpinner)
    return loadingSpinner;
}

export {waitForLoadingSpinner};