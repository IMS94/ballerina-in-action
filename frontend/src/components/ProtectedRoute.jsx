import { useAuthContext } from "@asgardeo/auth-react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute(props) {
    const { state } = useAuthContext();

    if (state.isAuthenticated) {
        return (
            <Route {...props} />
        );
    }

    return <Redirect to={"/login"} />;
}

export default ProtectedRoute;