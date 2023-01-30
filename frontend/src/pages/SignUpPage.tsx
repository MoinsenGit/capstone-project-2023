import React, {FormEvent, useCallback, useState} from "react";
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    createTheme,
    CssBaseline,
    Grid,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Toolbar from "@mui/material/Toolbar";

export default function SignUpPage () {
    const [credentials] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const location = useLocation();

    const signUp = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            credentials.username = (data.get('username') ?? "").toString();
            credentials.password = (data.get('password') ?? "").toString();

            setErrors([]);

            try {
                await axios.post("/api/users", credentials);
                navigate("/login" + location.search);
            } catch (event) {
                setErrors((errors) => [
                    ...errors,
                    "The username is already taken. " +
                    "Please try again."
                ]);
            }
        },
        [credentials, navigate, location]
    );

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <AppBar position="relative" style={{ background: '#91BFBC' }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            S.IT.CO
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#91BFBC' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>

                    <Box key={credentials.username}>
                        {errors.map((error) => <Alert severity="error">{error}</Alert>)}
                    </Box>

                    <Box component="form" noValidate onSubmit={signUp} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#91BFBC'}}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link to={"/login" + location.search}>
                                    {"Already have an account? Log in here!"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {' © '}
                        {new Date().getFullYear()}
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>

    );
}