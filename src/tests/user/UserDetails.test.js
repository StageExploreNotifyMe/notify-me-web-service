import {fireEvent, render, screen} from '@testing-library/react';
import UserDetails from '../../components/user/UserDetails';


let mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('User details page', () => {
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
}, 5000);