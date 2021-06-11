const grantPermission = (requestedRoles = []) => {
    if (requestedRoles.length === 0) return true;
    if (localStorage.getItem('IsLoggedIn')!== 'true'){return requestedRoles.includes('NOT_LOGGED_IN')}
    const user = JSON.parse(localStorage.getItem('user'))
    if (user === null) {
        return requestedRoles.includes("NONE")
    }

    const userRoles = user.roles;
    if (userRoles === undefined) {
        return requestedRoles.includes("NONE")
    }
    if (requestedRoles.includes("ANY") && userRoles.length > 0) return true
    if (requestedRoles.includes("NONE")) {
        return (userRoles.length === 0)
    }

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