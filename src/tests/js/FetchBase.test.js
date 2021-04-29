import {getBase, postBase} from "../../js/FetchBase";

let timeout = 1000;

function mockFetch() {
    let mockFn = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ result: true }),
        })
    );

    global.fetch = mockFn;
    return mockFn;
}

test('Fetch - get', async () => {
    let mockFn = mockFetch();
    let resp = await getBase("/test");
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
}, timeout);

test('Fetch - get - url', async () => {
    let mockFn = mockFetch();
    let resp = await getBase("test");
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
}, timeout);

test('Fetch - post', async () => {
    let mockFn = mockFetch();
    let resp = await postBase("test", {test: true});
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        body: {test: true},
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
    })
}, timeout);

test('Fetch - post - empty body', async () => {
    mockFetch();
    let wentInCatch = false
    try {
        let resp = await postBase("test", null);
        console.log(resp)
    } catch {
        wentInCatch = true
    }
    expect(wentInCatch).toBe(true)

}, timeout);




