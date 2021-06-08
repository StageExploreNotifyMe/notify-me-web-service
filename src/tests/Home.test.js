import {fireEvent, screen} from '@testing-library/react';
import App from '../components/Home';
import {act} from "react-dom/test-utils";
import {RenderComponent} from "./TestUtilities";

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('Render Home Component', () => {
    act(() => {
        RenderComponent(App);
        expect(screen.getByText(/Log in/i)).toBeInTheDocument();

        let openButton = screen.getAllByText(/Open/i)[0];
        fireEvent.click(openButton);
        expect(mockHistoryPush).toHaveBeenCalled()
    })
}, 5000);
