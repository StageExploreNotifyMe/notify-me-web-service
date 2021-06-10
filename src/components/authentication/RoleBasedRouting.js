import {Route} from "react-router-dom";
import grantPermission from "../../js/AuthChecker";

const RoleBasedRouting = ({component: Component, roles, ...rest}) => {
    return (
        <>
            {grantPermission(roles) && (
                <Route
                    {...rest}
                    render={(props) => (
                        <>
                            <Component {...props} {...rest} />
                        </>
                    )}
                />
            )}
            {
                !grantPermission(roles) && (
                    <Route
                        render={() => (
                            <>
                                <p> Unauthorized</p>
                            </>
                        )}
                    />
                )
            }
        </>
    );
};

export default RoleBasedRouting