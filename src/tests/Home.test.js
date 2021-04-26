import { render, screen } from '@testing-library/react';
import App from '../components/Home';

test('Render Home Component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home Placeholder/i);
  expect(linkElement).toBeInTheDocument();
}, 5000);
