import {act, fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock'
import React from "react";
import {sleep} from "../../js/Sleep";
import UserPreferences from "../../components/user/UserPreferences";

enableFetchMocks()

let userPref = {
    id: "1",
    normalChannel: "EMAIL",
    urgentChannel: "SMS"
}

let notificationsDTO = {notificationChannels: ["EMAIL", "SMS", "WHATSAPP", "APP"]}

test('UserPreferences changed', async () => {
    await act(async () => {
        mockFetch()
        const {container} = render(<UserPreferences/>)
        let notRendered = screen.getAllByText(/no notifications rendered/i)
        expect(notRendered[0]).toBeInTheDocument()
        await waitForElementToBeRemoved(notRendered[0])
        let radiobutton = container.querySelector("input")
        expect(radiobutton.type).toBe("radio")
        fireEvent.click(radiobutton, {target: {value: "EMAIL"}})
        expect(radiobutton.value).toBe('EMAIL')
        expect(radiobutton.checked).toBe(true)
        fireEvent.click(radiobutton, {target: {value: "SMS"}})
        expect(radiobutton.value).toBe('SMS')
    })
}, 5000);

test("onPreferenceChanged - normal", async () => {
    await act(async () => {
        let onPreferenceChanged = jest.fn()
        const {container} = render(<input
            onChange={() => onPreferenceChanged("SMS", "normal")}
            type="radio" name={"normal"}/>)
        const radio = container.firstChild
        fireEvent.click(radio, {target: {value: 'SMS'}})
        expect(onPreferenceChanged.mock.calls.length).toBe(1)
    })
})

test("onPreferenceChanged - urgent", async () => {
    await act(async () => {
        let onPreferenceChanged = jest.fn()
        const {container} = render(<input
            onChange={() => onPreferenceChanged("SMS", "urgent")}
            type="radio" name={"urgent"}/>)
        const radio = container.firstChild
        fireEvent.click(radio, {target: {value: 'SMS'}})
        expect(onPreferenceChanged.mock.calls.length).toBe(1)
    })
})

test("click radiobutton", async () => {
    await act(async () => {
        mockFetch()
        const {container} = render(<UserPreferences/>)
        let notRendered = screen.getAllByText(/no notifications rendered/i)
        await waitForElementToBeRemoved(notRendered[0])
        let radio = container.querySelector('#radioNormal')
        fireEvent.click(radio)
    })
}, 5000)

test("dropdown", async () => {
    await act(async () => {
        const {container} = render(<UserPreferences/>)
        let dropdown = container.querySelector('.dropdown-trigger')
        fireEvent.click(dropdown)
    })
    })

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
