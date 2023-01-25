import axios from "axios";
import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const logout = useCallback(
        async () => {
            await axios.get("/api/users/logout");
            navigate("/login");
            window.document.cookie = "";
            window.localStorage.clear();
        }, [navigate]);

        // ToDo: Add Info to the user that he is logged out

    return (
        <button onClick={logout}>Logout</button>
    )
}