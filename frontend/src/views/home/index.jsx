import { Button, AppBar, Card, CardContent, CircularProgress, Container, Grid, IconButton, makeStyles, Toolbar, Typography, Box } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Person, Menu as MenuIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useAuthContext, HttpClient } from "@asgardeo/auth-react";
import ProductService from "../../services/product.service";
import ProductList from "./ProductList";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%"
    },
    grid: {
        height: "100%",
        marginTop: theme.spacing(3),
    },
    logoutBtn: {
        marginLeft: "auto"
    }
}));


function HomeView() {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const classes = useStyles();
    const { signOut, getBasicUserInfo } = useAuthContext();

    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getBasicUserInfo()
            .then((info) => setUserInfo(info))
            .catch((err) => enqueueSnackbar('Error occurred', { variant: "error" }))
            .finally(() => setLoading(false));

    }, []);

    const handleLogout = () => {
        signOut()
            .then(() => history.push("/"));
    }

    const loadProducts = () => {

    };

    return (
        <Container maxWidth={false} className={classes.root} disableGutters>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Demo
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} className={classes.logoutBtn}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Grid
                container
                justifyContent="center"
                className={classes.grid}
                spacing={3}
            >
                <Grid item container spacing={3} alignContent={"flex-start"} xs={6}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                {loading && (
                                    <CircularProgress />
                                )}

                                {!!userInfo && (
                                    <Box
                                        display="flex"
                                        alignItems={"center"}
                                        flexDirection="column"
                                    >
                                        <Person />
                                        <Box width={0.5}>
                                            <Alert>
                                                <AlertTitle>Hello {userInfo.displayName}!</AlertTitle>
                                                Welcome back!
                                            </Alert>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <ProductList />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Grid>
        </Container>
    );
}

export default HomeView;