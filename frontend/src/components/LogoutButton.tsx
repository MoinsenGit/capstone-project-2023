import axios from "axios";
import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

export default function LogoutButton() {
    const navigate = useNavigate();

    const logout = useCallback(async () => {
            await axios.get("/api/users/logout")
            .then(() => toast.success("You are logged out!"))
            .catch((error) => toast.error("Error: " + error));
            navigate("/login");
            window.document.cookie = "";
            window.localStorage.clear();
        }, [navigate]);

    return (
                <Button
                    variant="outlined"
                    onClick={logout}
                    // sx={{color: "white", borderColor: "white"}}
                >
                    Logout
                </Button>
    )
}