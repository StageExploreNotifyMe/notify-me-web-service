import { render, screen } from '@testing-library/react';
import UserDetails from '../../components/user/UserDetails';

test('Render Spinner Component', () => {
  render(<UserDetails />)
  expect(screen.getByText(/User Details Placeholder/i)).toBeInTheDocument()
}, 5000);
