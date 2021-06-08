import {fireEvent, screen} from '@testing-library/react';
import AdminDetails from "../../components/admin/AdminDetails";
import {RenderComponent} from "../TestUtilities";


let mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('User details page', () => {
    const {container} = RenderComponent(AdminDetails)
    expect(screen.getByText(/Admin Details/i)).toBeInTheDocument()

    let notificationDetails = screen.getByText(/Notification details/i)
    expect(notificationDetails).toBeInTheDocument();
    let orgManagement = screen.getByText(/Organization Management/i)
    expect(orgManagement).toBeInTheDocument();

    let buttons = container.querySelectorAll("button");
    let expectedLinks = [
        "/admin/NotificationOverview",
        "/admin/organizationManagement"
    ];

    for (let i = 0; i < buttons.length; i++) {
        fireEvent.click(buttons[i]);
        expect(mockHistoryPush).toHaveBeenCalledWith(expectedLinks[0])
    }
}, 5000);