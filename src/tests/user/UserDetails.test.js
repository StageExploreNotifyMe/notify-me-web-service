import {act, fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import UserDetails from '../../components/user/UserDetails';
import {enableFetchMocks} from 'jest-fetch-mock'
import React from "react";


enableFetchMocks()


let userPref = {
    id: "1",
    normalChannel: "EMAIL",
    urgentChannel: "SMS"
}

let notificationsDTO = {notificationChannels: ["EMAIL", "SMS", "WHATSAPP", "APP"]}


test('Render Spinner Component', () => {
    render(<UserDetails/>)
    expect(screen.getByText(/User Details Placeholder/i)).toBeInTheDocument()
}, 5000);

test('UserPreferences changed', async () => {
    await act(async () => {
        mockFetch()
        const {container} = render(<UserDetails/>)
        let radiobutton = container.querySelector("input")
        expect(radiobutton.type).toBe("checkbox")
        let notRendered = screen.getAllByText(/no notifications rendered/i)
        expect(notRendered[0]).toBeInTheDocument()
        await waitForElementToBeRemoved(notRendered[0])
        fireEvent.click(radiobutton, {target: {value: "EMAIL"}})
        expect(radiobutton.value).toBe('EMAIL')
        expect(radiobutton.checked).toBe(true)
        fireEvent.click(radiobutton, {target: {value: "SMS"}})
        expect(radiobutton.value).toBe('SMS')
    })
}, 5000);

test("onPreferenceChanged - normal", async () => {
    let onPreferenceChanged = jest.fn()
    const {container} = render(<input
        onChange={() => onPreferenceChanged("SMS", "normal")}
        type="radio" name={"normal"}/>)
    const radio = container.firstChild
    fireEvent.click(radio)
    expect(onPreferenceChanged).toHaveBeenCalledTimes(1)
})

test("onPreferenceChanged - urgent", async () => {
    let onPreferenceChanged = jest.fn()
    const {container} = render(<input
        onChange={() => onPreferenceChanged("SMS", "urgent")}
        type="radio" name={"urgent"}/>)
    const radio = container.firstChild
    fireEvent.click(radio)
    expect(onPreferenceChanged).toHaveBeenCalledTimes(1)
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/user/preferences")) {
            return Promise.resolve(JSON.stringify(notificationsDTO))
        } else if (request.url.includes("/user/")) {
            return Promise.resolve(JSON.stringify(userPref))
        } else if (request.url.includes("/preferences/channel")) {
            return Promise.resolve(JSON.stringify(""))

        }

        return Promise.reject(new Error("Unknown URL"))
    })

}
