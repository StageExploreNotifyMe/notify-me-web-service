import {enableFetchMocks} from "jest-fetch-mock";
import {act} from "react-dom/test-utils";
import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import AdminVenueManagement from "../../components/admin/AdminVenueManagement";
import {sleep} from "../../js/Sleep";

enableFetchMocks()

let venue = {id: "1", name: "Groenplaats"}
let page = {
    content: [],
    empty: false,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 1,
    size: 100,
    totalElements: 1,
    totalPages: 1
}

function mockFetch(data = page, simulateNetworkError = false) {
    fetch.enableMocks();
    fetch.resetMocks();
    let response = JSON.stringify(data)
    let status = {status: 200}
    if (simulateNetworkError) {
        response = "sdf"
        status = {status: 500}
    }
    fetch.mockResponses([response, status])
}

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test("Render VenueManagement", async () => {
    await act(async () => {
        const {container} = render(<AdminVenueManagement/>)
        let spinner = container.querySelector(".loading")
        expect(spinner).toBeInTheDocument()
        mockFetch({...page, content: [venue]})
        await waitForElementToBeRemoved(spinner)
        const create = screen.getByText(/Create venue/i)
        expect(create).toBeInTheDocument()
        expect(screen.getByText(new RegExp(venue.name))).toBeInTheDocument()
        let edit = container.querySelector(".is-clickable")
        expect(edit).toBeInTheDocument()
        fireEvent.click(edit)
        expect(mockHistoryPush).toHaveBeenCalledWith("/admin/venue/1/edit")
        fireEvent.click(create)
        expect(mockHistoryPush).toHaveBeenCalledWith('/admin/venue/create')
    })
}, 5000)

test("Render network error", async () => {
    await act(async () => {
        mockFetch(page, true)
        render(<AdminVenueManagement/>)
        await sleep(20);
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })
}, 5000)

test("Render no venues", async () => {
    await act(async () => {
        let {container} = render(<AdminVenueManagement/>)
        let spinner = container.querySelector(".loading")
        mockFetch({...page, content: []})
        await waitForElementToBeRemoved(spinner)
        expect(screen.getByText(/No venues known/i)).toBeInTheDocument()
        let create = screen.getByText(/here/i)
        expect(create).toBeInTheDocument()
        fireEvent.click(create)
        expect(mockHistoryPush).toHaveBeenCalledWith('/admin/venue/create')
    })
}, 5000)