import {act, fireEvent, screen} from '@testing-library/react';
import CreateLine from "../../../components/venue/lines/CreateLine";
import {sleep} from "../../../js/Sleep";
import {RenderComponent} from "../../TestUtilities";

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

let lineToEdit = {
    "id": "2",
    "name": "Catering",
    "description": "The catering during events",
    "venueDto": {"id": "1", "name": "Groenplaats"},
    "numberOfRequiredPeople": 1
};

function renderComponent(isEdit) {
    resetMockFuncs();
    localStorage.setItem("editLine", JSON.stringify(lineToEdit));
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    const {container} = RenderComponent(CreateLine, {action: isEdit ? "edit" : "create"});
    let submitButton = container.querySelectorAll("button")[0];
    expect(submitButton).toBeInTheDocument()
    let cancelButton = screen.queryByText(/Cancel/i);
    expect(cancelButton).toBeInTheDocument()
    return {container, submitButton, cancelButton}
}

async function typeInInput(inputElement, toType = "", expected = toType) {
    fireEvent.change(inputElement, {target: {value: toType}})
    await sleep(20);
    expect(inputElement.value).toBe(expected)
}

test('Edit line - go back', () => {
    const {cancelButton} = renderComponent(true);
    fireEvent.click(cancelButton)
    expect(mockHistoryGoBack).toHaveBeenCalled();
}, 5000);

test('Create line - go back', () => {
    const {cancelButton} = renderComponent();
    fireEvent.click(cancelButton)
    expect(mockHistoryGoBack).toHaveBeenCalled();
}, 5000);

test('Create line - name input - empty', () => {
    act(() => {
        const {container, submitButton} = renderComponent();
        let nameInput = container.querySelectorAll("input")[0];
        expect(nameInput).toBeInTheDocument()
        expect(nameInput.value).toBe("")
        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()
    })
}, 5000);

test('Create line - name input', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();
        let nameInput = container.querySelectorAll("input")[0];
        await typeInInput(nameInput, "a")
        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()
    })
}, 5000);

test('Create line - description input', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();
        let description = container.querySelectorAll("input")[1];
        expect(description).toBeInTheDocument()
        await typeInInput(description, "a")
        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()
    })
}, 5000);

test('Create line - number input - empty', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();
        let numberInput = container.querySelectorAll("input")[2];
        expect(numberInput).toBeInTheDocument()
        await typeInInput(numberInput, "a", "")
        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()
    })
}, 5000);
