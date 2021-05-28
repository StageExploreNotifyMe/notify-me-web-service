const grantPermission = (requestedRoles = []) => {
    if (requestedRoles.length === 0) return true;

    const userRoles = JSON.parse(localStorage.getItem('user')).roles;
    if (userRoles === undefined) return false;

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