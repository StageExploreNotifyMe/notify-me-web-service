import {act} from "react-dom/test-utils";
import AuthChecker from "../../js/AuthChecker";

const user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe",
    roles: []
};

function runTest(userRoles, requiredRoles, expectedAuth) {
    localStorage.setItem("user", JSON.stringify({...user, roles: userRoles}));
    expect(AuthChecker(requiredRoles)).toBe(expectedAuth)
}

test('Auth checker', async () => {
    await act(async () => {
        for (let x of [
            [[], [], true],
            [[], ["ANY"], false],
            [['MEMBER'], ["ANY"], true],
            [['MEMBER'], ["NONE"], false],
            [[], ["NONE"], true],
            [["ADMIN"], ["MEMBER"], true],
            [["MEMBER"], ["MEMBER"], true],
            [["LINE_MANAGER"], ["MEMBER"], false],
        ]) {
            runTest(x[0], x[1], x[2]);
        }

        localStorage.setItem("user", JSON.stringify({...user, roles: []}));
        expect(AuthChecker()).toBe(true)
    })
}, 5000);