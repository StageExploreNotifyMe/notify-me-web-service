import {Redirect} from "react-router-dom";
import RoleBasedRouting from "./RoleBasedRouting";

const LoggedInBasedRouting = ({component: Component, ...rest}) => {
    const isLoggedIn = () => {
        return localStorage.getItem('IsLoggedIn') === 'true';
    };
    return (
        <>
            {isLoggedIn() && (
                <RoleBasedRouting
                    {...rest} component={Component}
                />
            )}
            {
                !isLoggedIn() && (
                    <Redirect to={"/login"}/>
                )
            }
        </>
    );
};

export default LoggedInBasedRouting