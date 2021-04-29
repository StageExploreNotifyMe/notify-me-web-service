import {fireEvent, render, screen} from '@testing-library/react';
import PageControls from "../../components/util/PageControls";

let pageSettings = {
    content: [],
    number: 10,
    first: false,
    last: false,
    totalPages: 20
};

function renderPageControls(settings, showButtons = true) {
    let mockFn = jest.fn();
    render(<PageControls showButtons={showButtons} pageSettings={settings} changePage={(e) => {
        mockFn(e)
    }}/>)
    let nextButton = screen.queryByText(/Next page/i);
    let previousButton = screen.queryByText(/Previous/i);
    return {nextButton, previousButton, mockFn}
}

test('Page Controls - Next Button', () => {
    let {nextButton, mockFn} = renderPageControls(pageSettings);
    expect(nextButton).toBeInTheDocument()
    fireEvent.click(nextButton)
    expect(mockFn).toHaveBeenCalledWith(pageSettings.number + 1);
}, 5000);

test('Page Controls - Previous Button', () => {
    let {previousButton, mockFn} = renderPageControls(pageSettings);
    expect(previousButton).toBeInTheDocument()
    fireEvent.click(previousButton)
    expect(mockFn).toHaveBeenCalledWith(pageSettings.number - 1);
}, 5000);

test('Page Controls - Next page', () => {
    let {mockFn} = renderPageControls(pageSettings);
    let nextNumber = screen.queryByText(new RegExp(pageSettings.number + 2));
    expect(nextNumber).toBeInTheDocument()
    fireEvent.click(nextNumber)
    expect(mockFn).toHaveBeenCalledWith(pageSettings.number + 1);
}, 5000);

test('Page Controls - First page', () => {
    let {mockFn} = renderPageControls(pageSettings);
    let nextNumber = screen.queryAllByText(new RegExp(1))[0];
    expect(nextNumber).toBeInTheDocument()
    fireEvent.click(nextNumber)
    expect(mockFn).toHaveBeenCalledWith(0);
}, 5000);

test('Page Controls - Previous page', () => {
    let {mockFn} = renderPageControls(pageSettings);
    let previousNumber = screen.queryByText(new RegExp(pageSettings.number));
    expect(previousNumber).toBeInTheDocument()
    fireEvent.click(previousNumber)
    expect(mockFn).toHaveBeenCalledWith(pageSettings.number - 1);
}, 5000);

test('Page Controls - Last page', () => {
    let {mockFn} = renderPageControls(pageSettings);
    let previousNumber = screen.queryByText(new RegExp(pageSettings.totalPages));
    expect(previousNumber).toBeInTheDocument()
    fireEvent.click(previousNumber)
    expect(mockFn).toHaveBeenCalledWith(pageSettings.totalPages - 1);
}, 5000);

test('Page Controls - Render without buttons', () => {
    const {nextButton, previousButton} = renderPageControls(pageSettings, false);
    expect(nextButton).toBeNull()
    expect(previousButton).toBeNull()
}, 5000);

test('Page Controls - Render single page - next button checks', () => {
    let testPageSettings = {
        ...pageSettings,
        last: true,
        first: true,
        number: 0,
        totalPages: 1
    };
    let {nextButton, mockFn} = renderPageControls(testPageSettings);

    expect(nextButton).toBeInTheDocument()
    expect(nextButton).toHaveAttribute("disabled")
    fireEvent.click(nextButton)
    expect(mockFn).not.toHaveBeenCalled();
}, 5000);

test('Page Controls - Render single page - previous button checks', () => {
    let testPageSettings = {
        ...pageSettings,
        last: true,
        first: true,
        number: 0,
        totalPages: 1
    };
    let {previousButton, mockFn} = renderPageControls(testPageSettings);

    expect(previousButton).toBeInTheDocument()
    expect(previousButton).toHaveAttribute("disabled")
    fireEvent.click(previousButton)
    expect(mockFn).not.toHaveBeenCalled();
}, 5000);

test('Page Controls - Render single page - current page check', () => {
    let testPageSettings = {
        ...pageSettings,
        last: true,
        first: true,
        number: 0,
        totalPages: 1
    };
    let {mockFn} = renderPageControls(testPageSettings);

    let previousNumber = screen.queryByText(new RegExp(testPageSettings.totalPages));
    expect(previousNumber).toBeInTheDocument()
    fireEvent.click(previousNumber)
    expect(mockFn).not.toHaveBeenCalled();
}, 5000);

test('Page Controls - Few Pages - Next page', () => {
    let testPageSettings = {
        ...pageSettings,
        last: false,
        first: false,
        number: 1,
        totalPages: 4
    };
    let {mockFn} = renderPageControls(testPageSettings);
    let nextNumber = screen.queryByText(new RegExp(testPageSettings.number + 2));
    expect(nextNumber).toBeInTheDocument()
    fireEvent.click(nextNumber)
    expect(mockFn).toHaveBeenCalledWith(testPageSettings.number + 1);
}, 5000);

test('Page Controls - Few Pages - Previous page', () => {
    let testPageSettings = {
        ...pageSettings,
        last: false,
        first: false,
        number: 1,
        totalPages: 3
    };
    let {mockFn} = renderPageControls(testPageSettings);
    let previousNumber = screen.queryByText(new RegExp(testPageSettings.number));
    expect(previousNumber).toBeInTheDocument()
    fireEvent.click(previousNumber)
    expect(mockFn).toHaveBeenCalledWith(testPageSettings.number - 1);
}, 5000);

