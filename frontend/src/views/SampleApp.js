import { useAuthContext } from "@asgardeo/auth-react";
import { CircularProgress, Container, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginView from "./login";
import HomeView from "./home";
import { setToken } from "../services/client";


const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        backgroundColor: theme.palette.grey[500]
    }
}));


export default function SampleApp() {
    const classes = useStyles();
    const { state, getIDToken, getBasicUserInfo } = useAuthContext();

    useEffect(async () => {
        if (state.isAuthenticated) {
            let jwt = await getIDToken();
            let user = await getBasicUserInfo();

            setToken(jwt);

            console.log("JWT", jwt, user);
        }
    }, [state.isAuthenticated]);

    return (
        <Container maxWidth={false} className={classes.root} disableGutters>
            <Switch>
                <Route path="/login" component={LoginView} />
                <ProtectedRoute path="/home" component={HomeView} />
                <Redirect to="/login" />
            </Switch>
        </Container>
    );
}
