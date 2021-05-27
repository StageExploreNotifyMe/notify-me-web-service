import CreateVenue from "../../components/venue/CreateVenue";
import {act} from "react-dom/test-utils";
import {fireEvent, render, screen} from '@testing-library/react';
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";

enableFetchMocks()

let user = {
    firstname: "John",
    id: "1",
    lastname: "Doe"
}

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

const mockHistoryPush = jest.fn();
const mockHistoryBack = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        goBack: mockHistoryBack
    }),
}));

function setLocalStorage() {
    localStorage.setItem("editVenue", JSON.stringify({
        id: "1",
        name: "TestVenue",
        venueManagers: [{id: "1", userPreferences: null, firstname: "John", lastname: "Doe"}]
    }));
}

test("Render Create Venue", async () => {
    await act(async () => {
        mockFetch(page, false)
        const {container} = render(<CreateVenue action={"create"}/>)
        expect(screen.getByText(/Create Venue/i)).toBeInTheDocument()
        let submit = container.querySelectorAll("button")[0]
        expect(submit).toBeInTheDocument()
        let cancel = screen.queryByText(/Cancel/i)
        expect(cancel).toBeInTheDocument()
        await sleep(20)
        fireEvent.click(cancel)
        expect(mockHistoryBack).toHaveBeenCalled()
    })
}, 5000)

test("Create Venue - no name", async () => {
    await act(async () => {
        mockFetch(page, false)
        const {container} = render(<CreateVenue action={"create"}/>)
        await sleep(50)
        let name = container.querySelectorAll("input")[0]
        expect(name).toBeInTheDocument()
        let submit = container.querySelectorAll("button")[0]
        fireEvent.click(submit)
        expect(mockHistoryPush).not.toHaveBeenCalled()
        await sleep(20)
        expect(screen.getByText(/A venue must have a name/i)).toBeInTheDocument()
    })
}, 5000)

test("Create Venue - name - no venueManager", async () => {
    await act(async () => {
        mockFetch(page, false)
        const {container} = render(<CreateVenue action={"create"}/>)
        await sleep(50)
        let name = container.querySelectorAll("input")[0]
        expect(name).toBeInTheDocument()
        await fireEvent.change(name, {target: {value: "Groenplaats"}})
        let submit = container.querySelectorAll("button")[0]
        await sleep(20)
        fireEvent.click(submit)
        expect(screen.getByText(/Please select/i)).toBeInTheDocument()
    })
}, 5000)

test("Render network error", async () => {
    await act(async () => {
        setLocalStorage();
        mockFetch(page, true)
        render(<CreateVenue action={"create"}/>)
        await sleep(20);
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })
}, 5000)

test("Create Venue - name -  venueManager", async () => {
    await act(async () => {
        mockFetch({...page, content: [user]})
        const {container} = render(<CreateVenue action={"create"}/>)
        await fillNameAndManager(container)
        await sleep(20)
        let u = screen.getAllByText(/John/i)[0]
        expect(u).toBeInTheDocument()
        let submit = container.querySelectorAll("button")[0]
        expect(submit).toBeInTheDocument()
        await sleep(20)
        fireEvent.click(submit)
    })
}, 5000)

test("Edit Venue - name -  venueManager", async () => {
    await act(async () => {
        mockFetch({...page, content: [user]})
        setLocalStorage();
        const {container} = render(<CreateVenue/>)
        await fillNameAndManager(container);
        let selected = container.querySelectorAll(".panel-block")[2]
        expect(selected).toBeInTheDocument();
        await fireEvent.click(selected);
        await sleep(50);
        let submit = container.querySelectorAll("button")[0]
        expect(submit).toBeInTheDocument()
        await sleep(20)
        fireEvent.click(submit)
    })
}, 5000)

function mockFetch(data, simulateNetworkError) {
    fetch.enableMocks()
    fetch.resetMocks()
    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject("Simulated network error")
        await sleep(20)
        if (request.url.includes("/user?page=")) return Promise.resolve({
            body: JSON.stringify(data),
            status: 200,
            ok: true
        })
        return Promise.resolve({body: null, status: 409, ok: false})
    })
}

async function fillNameAndManager(container) {
    let name = container.querySelectorAll("input")[0]
    expect(name).toBeInTheDocument()
    await fireEvent.change(name, {target: {value: "Groenplaats"}})
    await sleep(20)
    expect(name.value).toBe("Groenplaats")
    let userDiv = container.querySelectorAll(".panel-block")[0]
    expect(userDiv).toBeInTheDocument();
    await fireEvent.click(userDiv);
    await sleep(50);
    expect(userDiv).toHaveTextContent(user.firstname)
}
