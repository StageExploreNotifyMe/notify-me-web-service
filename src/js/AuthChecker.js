const grantPermission = (requestedRoles = []) => {
    if (requestedRoles.length === 0) return true;
    const user = JSON.parse(localStorage.getItem('user'))
    if (user === null) {
        if (requestedRoles.includes("NONE")) return true
        return false
    }

    const userRoles = user.roles;
    if (userRoles === undefined) {
        if (requestedRoles.includes("NONE")) return true
        return false
    }
    if (requestedRoles.includes("ANY") && userRoles.length > 1) return true
    if (requestedRoles.includes("NONE") && userRoles.length ===0 ) return true

if (userRoles.includes('ADMIN')) return true;
    let isAllowed = false;
    userRoles.forEach(userRole => {
        if (requestedRoles.includes(userRole)) {
            isAllowed = true;
        }
    })
    return isAllowed;
};

export default grantPermission;