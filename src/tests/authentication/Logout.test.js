import {fireEvent, render} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import Logout from "../../components/authentication/Logout";
import {sleep} from "../../js/Sleep";

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function RenderComponent() {
    return render(<Logout/>);

}

test('Logout - 1', async () => {
    await act(async () => {
        const {container} = RenderComponent();
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

test('Logout - 2', async () => {
    await act(async () => {
        const {container} = RenderComponent();
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);



