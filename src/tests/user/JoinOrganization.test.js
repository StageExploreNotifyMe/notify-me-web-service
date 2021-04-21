import { render, screen } from '@testing-library/react';
import JoinOrganization from '../../components/user/JoinOrganization';

test('Render Spinner Component', () => {
  render(<JoinOrganization  />)
  expect(screen.getByText(/Join Organizations/i)).toBeInTheDocument()
}, 5000);
