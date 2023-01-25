import React, {FormEvent, useCallback, useState} from "react";
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
import './../App.css';
export default function SignUpPage () {
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

    const navigate = useNavigate();

    const location = useLocation();

    const signUp = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setErrors([]);

            try {
                await axios.post("/api/users", credentials);
                navigate("/login" + location.search);
            } catch (e) {
                setErrors((errors) => [
                    ...errors,
                    "Userdata is not allowed. Please try again." // ToDo: Check and change error message
                ]);
            }
        },
        [credentials, navigate, location]
    );


    return (
        <div className="App">
            <h1>Welcome! Signup!</h1>
            <br></br>
            <br></br>
            {errors.length > 0 && (
                <div>
                    {errors.map((error) => <p key={error}>{error}</p>)}
                </div>
            )}
            <br></br>
            <br></br>
            <form onSubmit={signUp}>
                <div>
                    Choose a username:
                    <br></br>
                    <input
                        placeholder={"username"}
                        value={credentials.username}
                        name={"username"}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <div>
                    Choose a password:
                    <br></br>
                    <input
                        placeholder={"password"}
                        name={"password"}
                        type={"password"}
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <br></br>
                <div>
                    <button>Sign Up</button>
                </div>
                <br></br>
                <br></br>
                <div>If you do already have an account, you can <Link to={"/login" + location.search}>log in here!</Link>
                </div>
            </form>
        </div>
    );
}