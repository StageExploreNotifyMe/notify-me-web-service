import {RenderComponent} from "../TestUtilities";
import AccessDenied from "../../components/authentication/AccessDenied";
import {fireEvent, screen} from '@testing-library/react';
import {sleep} from "../../js/Sleep";

const mockHistoryPush = jest.fn();

function doRender() {
    return RenderComponent(AccessDenied)
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('go back home', async () => {
    doRender()
    let home = await screen.findByText("Go back")
    await sleep(20)
    fireEvent.click(home)
    expect(mockHistoryPush).toHaveBeenCalledWith("/")
}, 5000)
