import React, {FormEvent, useCallback, useMemo, useState} from "react";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import './../App.css';

export default function LoginPage() {
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

    const [searchParams] = useSearchParams();
    const redirect = useMemo(
        () => searchParams.get("redirect") || "/",
        [searchParams]
    );
    const navigate = useNavigate();

    const location = useLocation();

    const login = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setErrors([]);

            try {
                await axios.post("/api/users/login", null, {
                    headers: {
                        "Authorization": "Basic " + window.btoa(`${credentials.username}:${credentials.password}`)
                    }
                });

                navigate(redirect);
            } catch (event) {
                setErrors((errors) => [
                    ...errors,
                    "Username oder password is not correct. Please try again."
                ]);
            }
        },
        [credentials, navigate, redirect]
    );


    return (
        <div className="App">
            <h1>LOGIN PAGE </h1>
            <br></br>
            <h3> [WIRD NOCH SCHÖNER!]</h3>
            <br></br>
            {errors.length > 0 && (
                <div>
                    {errors.map((error) => <p key={error}>{error}</p>)}
                </div>
            )}
            <br></br>
            <br></br>
            <form onSubmit={login}>
                <div>
                    <input
                        placeholder={"username"}
                        value={credentials.username}
                        name={"username"}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <div>
                    <input
                        placeholder={"password"}
                        name={"password"}
                        type={"password"}
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <div>
                    <button>Login</button>
                </div>
                <br></br>
                <br></br>
                <div>If you do not have an account, you can <Link to={"/signup" + location.search}>sign up here!</Link>
                </div>
            </form>
        </div>
    );
}