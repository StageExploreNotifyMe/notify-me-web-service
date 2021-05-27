import {fireEvent, render} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import Logout from "../../components/authentication/Logout";
import {sleep} from "../../js/Sleep";

const mockHistoryPush = jest.fn();
const mockCloseModal = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function RenderComponent(hasCloseModalFunction) {
    if (hasCloseModalFunction) {
        return render(<Logout closeModal={mockCloseModal}/>);
    } else {
        return render(<Logout/>);
    }
}

test('Logout - 1', async () => {
    await act(async () => {
        const {container} = RenderComponent(false);
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
        expect(mockCloseModal).not.toHaveBeenCalled()
    })
}, 5000);

test('Logout - 2', async () => {
    await act(async () => {
        const {container} = RenderComponent(true);
        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
        expect(mockCloseModal).toHaveBeenCalled()
    })
}, 5000);



