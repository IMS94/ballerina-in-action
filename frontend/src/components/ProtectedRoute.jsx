import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { checkLoggedIn } from "../services/auth.service";

function ProtectedRoute(props) {
    const { isAuthenticated } = useAuthContext();

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        isAuthenticated()
            .then(auth => setAuthenticated(auth))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && authenticated) {
        return (
            <Route {...props} />
        );
    }

    return null;
}

export default ProtectedRoute;