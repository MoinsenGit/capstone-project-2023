import {Alert, Avatar, Box, createTheme, CssBaseline, Grid, TextField, ThemeProvider, Typography} from "@mui/material";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Button from "@mui/material/Button";
import React, {FormEvent, useCallback, useState} from "react";
import {Credentials} from "../model/Credentials";
import AppBarTop from "./AppBarTop";

type AuthProps = {
    buttonLabel: string;
    handleSubmit: (credentials: Credentials, setErrors: (errors: string[]) => void) => void;
    children: JSX.Element;
}

export default function SitCoAuth(props: AuthProps) {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = event.target;
            setCredentials({...credentials, [name]: value});
        },
        [credentials, setCredentials]
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);
        props.handleSubmit(credentials, (errors: string[]) => setErrors(errors));
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <AppBarTop/>
{/*                <Box
                    maxWidth="100%"
                    component="img"
                    alt="S.IT.CO Logo"
                    src="/sitco-logo.png"
                />*/}
                <Container maxWidth="sm">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        S.It.Co
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                        Welcome to S.It.Co - your place for collecting all of your favorite items.
                    </Typography>
                </Container>
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <Avatar sx={{m: 1, bgcolor: '#91BFBC'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {props.buttonLabel}
                    </Typography>

                    <Box>
                        {errors.map((error) => <Alert key={credentials.username} severity="error">{error}</Alert>)}
                    </Box>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    margin="normal"
                                    onChange={handleChange}
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
                                    margin="normal"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2, bgcolor: '#91BFBC'}}
                        >
                            {props.buttonLabel}
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                {props.children}
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