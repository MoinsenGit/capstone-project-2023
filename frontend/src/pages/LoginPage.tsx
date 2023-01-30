import React, {FormEvent, useCallback, useMemo, useState} from "react";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from "@mui/material/Button";
import Toolbar from '@mui/material/Toolbar';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const location = useLocation();

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = event.target;
            setCredentials({...credentials, [name]: value});
        },
        [credentials, setCredentials]
    );

    const [searchParams] = useSearchParams();

    const redirect = useMemo(
        () => searchParams.get("redirect") || "/",
        [searchParams]
    );

    const login = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setErrors([]);

            try {
                await axios.post("/api/users/login", null, {
                    headers: {
                        "Authorization": "Basic " + window.btoa(
                            `${credentials.username}:${credentials.password}`
                        )
                    }
                });

                navigate(redirect);
            } catch (event) {
                setErrors((errors) => [
                    ...errors,
                    "Username or password are not correct.   " +
                    "Please try again."
                ]);
            }
        },
        [credentials, navigate, redirect]
    );

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <AppBar position="relative" style={{background: '#91BFBC'}}>
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
                    <Avatar sx={{m: 1, bgcolor: '#91BFBC'}}>
                        <LockOutlinedIcon/>
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>

                    <Box key={credentials.username}>
                        {errors.map((error) => <Alert severity="error">{error}</Alert>)}
                    </Box>

                    <Box component="form" onSubmit={login} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2, bgcolor: '#91BFBC'}}
                        >
                            Log In
                        </Button>

                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link to={"/signup" + location.search}>
                                    {"Don't have an account? Sign Up here! It's free! "}
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