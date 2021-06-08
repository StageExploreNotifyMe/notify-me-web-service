import {enableFetchMocks} from 'jest-fetch-mock'
import {fireEvent} from '@testing-library/react';
import Organization from '../../components/user/Organization';
import {RenderComponent} from "../TestUtilities";
import {act} from "react-dom/test-utils";
import {sleep} from "../../js/Sleep";

enableFetchMocks()

function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    let response = ["{\"id\":null,\"user\":{\"id\":\"testUser\"},\"organization\":{\"id\":\"testOrganization\",\"name\":\"\"},\"role\":\"MEMBER\",\"status\":\"PENDING\"}", {status: 200}]
    if (!simulateNetworkError) {
        response = ["{\"id\":null,\"user\":{\"id\":\"testUser\"},\"organization\":{\"id\":\"testOrganization\",\"name\":\"\"},\"role\":\"MEMBER\",\"status\":\"PENDING\"}", {status: 500}]
    }
    fetch.mockResponses(response)
}

async function Render(hasAlreadyJoined = false) {
    let data = {id: "1", name: "Company 1", hasJoined: hasAlreadyJoined};
    const {container} = RenderComponent(Organization, {content: data})

    let input = container.querySelector("input");
    let button = container.querySelector("button");
    let button2 = container.querySelectorAll("button")[1];

    expect(input.type).toBe("checkbox")
    expect(input.checked).toBe(data.hasJoined)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(true)

    fireEvent.click(input)
    await sleep(50)
    expect(input.checked).toBe(!data.hasJoined)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(false)

    return Promise.resolve({data, input, button, button2});
}

test('Render Organization Component - SuccessCase', async () => {
    await act(async () => {
        mockFetch();
        let {data, input, button} = await Render();

        fireEvent.click(button)
        expect(input.checked).toBe(!data.hasJoined)
        expect(button.parentNode.classList.contains('is-hidden')).toBe(true)
    })
}, 5000);

test('Render Organization Component - CancelCase', async () => {
    await act(async () => {
        mockFetch();
        let {data, input, button, button2} = await Render();

        fireEvent.click(button2)
        expect(input.checked).toBe(data.hasJoined)
        expect(button.parentNode.classList.contains('is-hidden')).toBe(true)
    })
}, 5000);

test('Render Organization Component - Leave', async () => {
    await act(async () => {
        mockFetch();
        let {button} = await Render(true);

        fireEvent.click(button)
        expect(button.parentNode.classList.contains('is-hidden')).toBe(true)
    })
}, 5000);

