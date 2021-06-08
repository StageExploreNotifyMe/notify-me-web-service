import grantPermission from "../../js/AuthChecker";

const UnlockAccess = ({children, request}) => {
    const permission = grantPermission(request);
    return (
        <>
            {permission && children}
        </>
    );
};

export default UnlockAccess