import {fireEvent, render, screen} from '@testing-library/react';
import UserDetails from '../../components/user/UserDetails';
import {act} from "react-dom/test-utils";


let mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('User details page', () => {
    act(() => {
        localStorage.setItem("user", JSON.stringify({firstname: "Test",lastname: "Test", id: "1", roles: ["VENUE_MANAGER", "MEMBER", "ORGANIZATION_LEADER", "LINE_MANAGER", "ADMIN"], userPreferences: {id: "3", normalChannel: "EMAIL", urgentChannel: "SMS"}}));
        render(<UserDetails/>)
        expect(screen.getByText(/User Details Placeholder/i)).toBeInTheDocument()
        expect(screen.getByText(/User Details/i)).toBeInTheDocument()
        let joinOrgButton = screen.getByText(/Join Organization/i)
        expect(joinOrgButton).toBeInTheDocument();
        fireEvent.click(joinOrgButton);
        expect(mockHistoryPush).toHaveBeenCalledWith("/user/join/organization")

        let inboxButton = screen.getByText(/Inbox/i)
        expect(inboxButton).toBeInTheDocument();
        fireEvent.click(inboxButton);
        expect(mockHistoryPush).toHaveBeenCalledWith("/user/inbox")
    })
}, 5000);