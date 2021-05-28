import {render, screen} from '@testing-library/react';
import OrganizationDetails from "../../components/organization/OrganizationDetails";

import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {enableFetchMocks} from 'jest-fetch-mock'
import {waitForLoadingSpinner} from "../TestUtilities";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";

enableFetchMocks()

let organization = {id: "1", name: "KdG"};

function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    let response = JSON.stringify(organization)
    let status = {status: 200};
    if (simulateNetworkError) {
        response = "qsdklfj{ùq{mokj}{}";
        status = {status: 500}
    }
    fetch.mockResponses([response, status])
}

function renderOrganizationDetails() {
    localStorage.setItem("user", JSON.stringify({firstname: "Test",lastname: "Test", id: "1", roles: ["VENUE_MANAGER", "MEMBER", "ORGANIZATION_LEADER", "LINE_MANAGER", "ADMIN"], userPreferences: {id: "3", normalChannel: "EMAIL", urgentChannel: "SMS"}}));
    const history = createMemoryHistory();
    const route = '/organization/1';
    history.push(route);

    const {container} = render(
        <Router history={history}>
            <OrganizationDetails/>
        </Router>,
    );
    return container;
}

test('OrganizationDetails - Render & load', async () => {
    await act(async () => {
        mockFetch();
        const container = renderOrganizationDetails();
        await waitForLoadingSpinner(container)
        expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()
    })
}, 5000);

test('OrganizationDetails - Error', async () => {
    await act(async () => {
        mockFetch(true);
        const container = renderOrganizationDetails();

        let loadingSpinner = container.querySelector('.loading');
        expect(loadingSpinner).toBeInTheDocument()
        await sleep(50);
        expect(screen.getByText(new RegExp("Something went wrong"))).toBeInTheDocument()
    })
}, 5000);


