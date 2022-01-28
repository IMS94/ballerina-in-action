import { useAuthContext } from "@asgardeo/auth-react";
import { Button, Card, CardContent, CardHeader, Container, Grid, makeStyles, TextField } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    }
}));

export default function LoginView(props) {
    const classes = useStyles();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { state, signIn } = useAuthContext();

    useEffect(() => {
        if (state.isAuthenticated) {
            history.push("/home");
        }
    }, [state.isAuthenticated]);

    const handleLogin = (e) => {
        signIn(() => console.log("Signed in!"))
            .catch(err => console.log('Login error', err));
    };

    return (
        <Container maxWidth={false} className={classes.root}>
            <Container maxWidth={"sm"}>
                <Card>
                    <CardHeader title={"Login"} />
                    <CardContent>
                        {/* <form onSubmit={handleLogin}> */}
                        <Grid container
                            display={"flex"}
                            direction={"column"}
                            spacing={2}
                        >
                            <Grid item>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    type="submit"
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                        {/* </form> */}
                    </CardContent>
                </Card>
            </Container>
        </Container>
    );
}