import React, {useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

import SitCoAuth from "../components/SitCoAuth";
import {Credentials} from "../model/Credentials";
import {toast} from "react-toastify";
import theme from "../styles/theme";
import {ThemeProvider} from "@mui/material";

export default function SignUpPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const handleSubmit = useCallback(async (credentials: Credentials, setErrors: (errors: string[]) => void) => {
        try {
            await axios.post("/api/users", credentials);
            toast.success("Login successfully created. You will be redirected to the login page automatically.");
            await new Promise(f => setTimeout(f, 1500));
            navigate("/login" + location.search);
        } catch (error) {
            setErrors([
                "The username already exists. " +
                "Please try another name."
            ]);
        }
    }, [navigate, location]);

    return (
        <ThemeProvider theme={theme}>
            <SitCoAuth
                buttonLabel="Sign up"
                handleSubmit={handleSubmit}>
                <Link
                    style={{textDecoration: "none", color: "#91BFBC"}}
                    to={"/login" + location.search}>
                    {"Already have an account? Log in "}
                    <span style={{textDecoration: "underline"}}>here</span>!
                </Link>
            </SitCoAuth>
        </ThemeProvider>
    );

}