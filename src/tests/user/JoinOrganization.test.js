import {render, screen} from '@testing-library/react';
import JoinOrganization from '../../components/user/JoinOrganization';
import {act} from "react-dom/test-utils";

test('Render Spinner Component', () => {
    act(() => {
        render(<JoinOrganization/>)
        expect(screen.getByText(/Join Organizations/i)).toBeInTheDocument()
    })
}, 5000);
