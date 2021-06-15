import {getBase, patchBase, postBase} from "../../js/FetchBase";

let timeout = 1000;

function mockFetch() {
    let mockFn = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({result: true}),
            ok: true
        })
    );

    global.fetch = mockFn;
    return mockFn;
}

function mockFetchError() {
    let mockFn = jest.fn(() =>
        Promise.resolve({
            ok: false
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
        headers: {"Authorization": "", 'Content-Type': 'application/json'}
    })
}, timeout);

test('Fetch - get - url', async () => {
    let mockFn = mockFetch();
    let resp = await getBase("test");
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        method: 'GET',
        headers: {"Authorization": "", 'Content-Type': 'application/json'}
    })
}, timeout);

test('Fetch - post', async () => {
    let mockFn = mockFetch();
    let resp = await postBase("test", {test: true});
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        body: {test: true},
        headers: {"Authorization": "", 'Content-Type': 'application/json'},
        method: 'POST'
    })
}, timeout);

test('Fetch - post - empty body', async () => {
    mockFetch();
    let wentInCatch = false
    try {
        await postBase("test", null);
    } catch {
        wentInCatch = true
    }
    expect(wentInCatch).toBe(true)
}, timeout);

test('Fetch - path', async () => {
    let mockFn = mockFetch();
    let resp = await patchBase("test", {test: true});
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        body: {test: true},
        headers: {"Authorization": "", 'Content-Type': 'application/json'},
        method: 'PATCH'
    })
}, timeout);

test('Fetch - path - no body', async () => {
    let mockFn = mockFetch();
    let resp = await patchBase("test");
    expect(resp.result).toBe(true)
    expect(mockFn).toHaveBeenCalledWith("http://localhost:9090/test", {
        body: {},
        headers: {"Authorization": "", 'Content-Type': 'application/json'},
        method: 'PATCH'
    })
}, timeout);

test('Fetch - post - error', async () => {
    mockFetchError();
    let wentInCatch = false
    try {
        await postBase("test", {});
    } catch {
        wentInCatch = true
    }
    expect(wentInCatch).toBe(true)
}, timeout);
