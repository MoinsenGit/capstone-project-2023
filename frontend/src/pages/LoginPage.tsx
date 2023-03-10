import React, {useCallback, useMemo} from "react";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";

import SitCoAuth from "../components/SitCoAuth";
import {Credentials} from "../model/Credentials";
import theme from "../styles/theme";
import {ThemeProvider} from "@mui/material";

export default function LoginPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const [searchParams] = useSearchParams();

    const redirect = useMemo(
        () => searchParams.get("redirect") || "/",
        [searchParams]
    );

    const handleSubmit = useCallback(async (credentials: Credentials, setErrors: (errors: string[]) => void) => {
        try {
            await axios.post("/api/users/login", null, {
                headers: {
                    "Authorization": "Basic " + window.btoa(
                        `${credentials.username}:${credentials.password}`
                    )
                }
            });

            navigate(redirect);
        } catch (error) {
            setErrors([
                "Username or password are not correct. " +
                "Please try again."
            ]);
        }
    }, [navigate, redirect]);

    return (
        <ThemeProvider theme={theme}>
        <SitCoAuth
            buttonLabel="Log in"
            handleSubmit={handleSubmit}
        >
            <Link
                style={{textDecoration: "none", color: "#91BFBC"}}
                to={"/signup" + location.search}
            >
                {"Don't have an account? Sign up "}
                <span style={{textDecoration: "underline"}}>here</span>
                {"! It's free!"}
            </Link>
        </SitCoAuth>
        </ThemeProvider>
    );
}