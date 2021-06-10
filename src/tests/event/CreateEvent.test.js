import {fireEvent, screen} from '@testing-library/react';
import CreateEvent from "../../components/event/CreateEvent";
import {RenderComponent} from "../TestUtilities";

let mockHistoryPush = jest.fn();
let mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        goBack: mockHistoryGoBack
    }),
}));

function resetMockFuncs() {
    mockHistoryPush = jest.fn();
    mockHistoryGoBack = jest.fn();
}

function renderComponent() {
    resetMockFuncs();
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    const {container} = RenderComponent(CreateEvent);
    let submitButton = screen.queryByText(/Submit/i);
    expect(submitButton).toBeInTheDocument()
    let cancelButton = screen.queryByText(/Cancel/i);
    expect(cancelButton).toBeInTheDocument()
    return {container, submitButton, cancelButton}
}

function typeInInput(inputElement, toType = "") {
    fireEvent.change(inputElement, {target: {value: toType}})
    expect(inputElement.value).toBe(toType)
}

test('Create event - go back', () => {
    const {cancelButton} = renderComponent();
    fireEvent.click(cancelButton)
    expect(mockHistoryGoBack).toHaveBeenCalled();
}, 5000);


test('Create event - name input - empty', () => {
    const {container, submitButton} = renderComponent();
    let nameInput = container.querySelectorAll("input")[0];
    expect(nameInput).not.toBeNull()
    expect(nameInput).toBeInTheDocument()
    expect(nameInput.value).toBe("")
    fireEvent.click(submitButton)
    expect(mockHistoryPush).not.toHaveBeenCalled()
}, 5000);

test('Create event - name input - type', () => {
    const {container} = renderComponent();
    let nameInput = container.querySelectorAll("input")[0];
    expect(nameInput).not.toBeNull()
    expect(nameInput).toBeInTheDocument()
    expect(nameInput.value).toBe("")
    typeInInput(nameInput, "test")
}, 5000);
