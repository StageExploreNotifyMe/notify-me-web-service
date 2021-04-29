import {fireEvent, render, screen} from '@testing-library/react';
import App from '../components/Home';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

test('Render Home Component', () => {
  render(<App />);
  expect(screen.getByText(/Notify Me/i)).toBeInTheDocument();

  let openButton = screen.getAllByText(/Open/i)[0];
  fireEvent.click(openButton);
  expect(mockHistoryPush).toHaveBeenCalled()
}, 5000);
