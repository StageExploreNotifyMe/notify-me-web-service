import App from '../components/App';
import {BrowserRouter} from "react-router-dom";
import { render, screen } from '@testing-library/react';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Render App Component', () => {
    let route = ""
    renderWithRouter(<App />, {route})
    expect(screen.getAllByText(/Notify Me/i)[1]).toBeInTheDocument()

    route = "/lqdfjsdksmdks";
    renderWithRouter(<App />, {route})
    expect(screen.getByText(/404 placeholder/i)).toBeInTheDocument()
}, 5000);
