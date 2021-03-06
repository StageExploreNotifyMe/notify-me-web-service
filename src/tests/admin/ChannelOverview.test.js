import {screen} from '@testing-library/react';
import ChannelOverview from "../../components/admin/ChannelOverview";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";
import {RenderComponent} from "../TestUtilities";


enableFetchMocks()
fetch.enableMocks();

let request = {
    notificationAmounts: [[5, "SMS"], [2, "WHATSAPP"], [2, "APP"]]
}

function mockFetch() {
    fetch.resetMocks()
    fetch.mockResponses([JSON.stringify(request), {status: 200}])
}

test("layout", () => {
    RenderComponent(ChannelOverview)
    expect(screen.getByText(/Notifications/)).toBeInTheDocument()
}, 5000)

test("channels", async () => {
    mockFetch()
    RenderComponent(ChannelOverview)
    await sleep(50)
    expect(screen.getByText(/SMS/)).toBeInTheDocument()
}, 5000)



