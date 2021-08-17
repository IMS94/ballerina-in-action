import { useAuthContext } from "@asgardeo/auth-react";
import { CircularProgress, Container, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginView from "./login";
import HomeView from "./home";


const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        backgroundColor: theme.palette.grey[500]
    }
}));


export default function SampleApp() {
    const classes = useStyles();
    const { isAuthenticated, getIDToken, getBasicUserInfo } = useAuthContext();

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        isAuthenticated()
            .then(auth => setAuthenticated(auth))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(async () => {
        if (authenticated) {
            let jwt = await getIDToken();
            let user = await getBasicUserInfo();

            console.log("JWT", jwt, user);
        }    
    }, [authenticated]);

    return (
        <Container maxWidth={false} className={classes.root} disableGutters>
            {loading && <CircularProgress />}

            {!loading && (
                <Switch>
                    <Route path="/login" component={LoginView} />
                    <ProtectedRoute path="/home" component={HomeView} />
                    <Redirect to="/login" />
                </Switch>
            )}
        </Container>
    );
}