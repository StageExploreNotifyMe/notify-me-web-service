import {fireEvent} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import Logout from "../../components/authentication/Logout";
import {sleep} from "../../js/Sleep";
import {RenderComponent} from "../TestUtilities";

const mockHistoryPush = jest.fn();
const mockOnSuccess = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function doRender(props) {
    return RenderComponent(Logout, props);
}

test('Logout - 1', async () => {
    await act(async () => {
        const {container} = doRender();
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

test('Logout - 2', async () => {
    await act(async () => {
        const {container} = doRender();
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

test('Logout - 3', async () => {
    await act(async () => {
        const {container} = doRender({onSuccess: mockOnSuccess});
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
        expect(mockOnSuccess).toHaveBeenCalled()
    })
}, 5000);



