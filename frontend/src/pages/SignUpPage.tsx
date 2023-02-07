import React, {useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

import SitCoAuth from "../components/SitCoAuth";
import {Credentials} from "../model/Credentials";
import {toast} from "react-toastify";

export default function SignUpPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const handleSubmit = useCallback(async (credentials: Credentials, setErrors: (errors: string[]) => void) => {
        try {
            await axios.post("/api/users", credentials);
            toast.success("Login successfully created. You will be redirected to the login page automatically.");
            await new Promise(f => setTimeout(f, 4000));
            navigate("/login" + location.search);
        } catch (error) {
            setErrors([
                "The username already exists. " +
                "Please try another name."
            ]);
        }
    }, [navigate, location]);

    return (
        <SitCoAuth buttonLabel="Sign up" handleSubmit={handleSubmit}>
            <Link to={"/login" + location.search}>
                {"Already have an account? Log in here!"}
            </Link>
        </SitCoAuth>
    );
}