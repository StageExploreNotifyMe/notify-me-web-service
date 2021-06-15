

function getRole(user) {
    let prettyNames = ["Admin", "Venue Manager", "Line Manager", "Organization Leader", "Member"];
    let roles = ["ADMIN", "VENUE_MANAGER", "LINE_MANAGER", "ORGANIZATION_LEADER", "MEMBER"];
    for (let i = 0; i < roles.length; i++) {
        if (user.roles.includes(roles[i])) {
            return prettyNames[i]
        }
    }
    return "";
}

export {getRole};