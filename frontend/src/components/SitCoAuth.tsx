import {Alert, Avatar, Box, CssBaseline, Grid, TextField, ThemeProvider, Typography} from "@mui/material";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Button from "@mui/material/Button";
import React, {FormEvent, useCallback, useState} from "react";
import {Credentials} from "../model/Credentials";
import AppBarTop from "./AppBarTop";
import Footer from "./Footer";
import theme from "../styles/theme";

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBarTop/>
            <Container
                component="main"
                maxWidth={false}
                style={{background: '#f6f6ee'}}
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Box
                    maxWidth="70%"
                    component="img"
                    alignItems={"center"}
                    alt="S.IT.CO Logo"
                    src="/sitco-logo_round.png"
                    sx={{mt: 1, mb: 2}}
                />
                <Container maxWidth="sm">
                    <Typography
                        variant="h5"
                        align="center"
                        color="#91BFBC"
                        paragraph
                    >
                        Welcome to S.IT.CO
                        <br></br>
                        <h6>your place for collecting all of your favorite items</h6>
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
                                    id="password"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 3, bgcolor: '#91BFBC', color: "white"}}
                        >
                            {props.buttonLabel}
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item
                                  sx={{mb: 11}}>
                                {props.children}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Footer/>
        </ThemeProvider>
    );
}