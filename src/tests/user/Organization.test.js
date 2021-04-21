import { enableFetchMocks } from 'jest-fetch-mock'
import {fireEvent, render} from '@testing-library/react';
import Organization from '../../components/user/Organization';

enableFetchMocks()

function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    let response = ["{\"id\":null,\"user\":{\"id\":\"testUser\"},\"organization\":{\"id\":\"testOrganization\",\"name\":\"\"},\"role\":\"MEMBER\",\"status\":\"PENDING\"}",{ status: 200 }]
    if (!simulateNetworkError) {response = ["{\"id\":null,\"user\":{\"id\":\"testUser\"},\"organization\":{\"id\":\"testOrganization\",\"name\":\"\"},\"role\":\"MEMBER\",\"status\":\"PENDING\"}",{ status: 500 }]}
    fetch.mockResponses(response)
}

function Render(hasAlreadyJoined = false) {
    let data = {id: "1", name: "Company 1", hasJoined: hasAlreadyJoined};
    const {container} = render(<Organization content={data}/>)

    let input = container.querySelector("input");
    let button = container.querySelector("button");
    let button2 = container.querySelectorAll("button")[1];

    expect(input.type).toBe("checkbox")
    expect(input.checked).toBe(data.hasJoined)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(true)

    fireEvent.click(input)

    expect(input.checked).toBe(!data.hasJoined)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(false)

    return {data, input, button, button2};
}

test('Render Organization Component - SuccessCase', () => {
    mockFetch();
    let {data, input, button} = Render();

    fireEvent.click(button)
    expect(input.checked).toBe(!data.hasJoined)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(true)
}, 5000);

test('Render Organization Component - CancelCase', () => {
    mockFetch();
    let {data, input, button, button2} = Render();

    fireEvent.click(button2)
    expect(input.checked).toBe(data.hasJoined)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(true)
}, 5000);

test('Render Organization Component - Leave', () => {
    mockFetch();
    let {button} = Render(true);

    fireEvent.click(button)
    expect(button.parentNode.classList.contains('is-hidden')).toBe(true)
}, 5000);

