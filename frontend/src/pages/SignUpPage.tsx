import React, {useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

import SitCoAuth from "../components/SitCoAuth";
import {Credentials} from "../model/Credentials";

export default function SignUpPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const handleSubmit = useCallback(async (credentials: Credentials, setErrors: (errors: string[]) => void) => {
        try {
            await axios.post("/api/users", credentials);
            navigate("/login" + location.search);
        } catch (error) {
            setErrors([
                "The username is already taken. " +
                "Please try again."
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