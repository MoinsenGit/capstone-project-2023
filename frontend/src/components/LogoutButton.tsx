import axios from "axios";
import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import {Grid} from "@mui/material";

export default function LogoutButton() {
    const navigate = useNavigate();

    const logout = useCallback(
        async () => {
            await axios.get("/api/users/logout")
            .then(() => toast.success("You are logged out!"))
            .catch((error) => toast.error("Error: " + error));
            navigate("/login");
            window.document.cookie = "";
            window.localStorage.clear();
        }, [navigate]);

        // ToDo: get toastify to work

    return (

        <Grid container justifyContent="flex-end">
            <Grid item>
                <Button variant="outlined" onClick={logout}>Logout</Button>
            </Grid>
        </Grid>

    )
}