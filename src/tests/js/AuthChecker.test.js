import {act} from "react-dom/test-utils";
import AuthChecker from "../../js/AuthChecker";

const user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe",
    roles: []
};

function runTest(userRoles, requiredRoles, expectedAuth, isLoggedIn = true) {
    localStorage.setItem("user", JSON.stringify({...user, roles: userRoles}));
    localStorage.setItem("IsLoggedIn", isLoggedIn.toString());
    expect(AuthChecker(requiredRoles)).toBe(expectedAuth)
}

test('Auth checker', async () => {
    await act(async () => {
        for (let x of [
            [[], [], true],
            [[], ["ANY"], false],
            [[], ["NOT_LOGGED_IN"], true, false],
            [['MEMBER'], ["ANY"], true],
            [['MEMBER'], ["NONE"], false],
            [[], ["NONE"], true],
            [["ADMIN"], ["MEMBER"], true],
            [["MEMBER"], ["MEMBER"], true],
            [["LINE_MANAGER"], ["MEMBER"], false],
            [undefined, ["NONE"], true],
        ]) {
            runTest(...x)
        }

        localStorage.setItem("user", JSON.stringify({...user, roles: undefined}));
        expect(AuthChecker()).toBe(true)
    })
}, 5000);