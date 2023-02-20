import {AppBar, Toolbar, IconButton, Typography, ThemeProvider} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import theme from "../styles/theme";
import {useCallback} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import LogoutIcon from '@mui/icons-material/Logout';
export default function AppBarLogout() {

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
        <ThemeProvider theme={theme}>

            <AppBar position="relative">
                <Toolbar
                    sx={{justifyContent: 'space-between'}}
                >
                    <IconButton
                        component={Link}
                        to="/"
                        sx={{maxWidth: "20%"}}
                    >
                        <img src="/sitco-logo_round.png"
                             alt="S.IT.CO Logo"
                             style={{maxWidth: '70px', maxHeight: '70px'}}
                        />
                    </IconButton>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        style={{
                            marginRight: 25,
                            textDecoration: "none",
                            color: "#f6f6ee"
                        }}
                    >
                        S.IT.CO
                    </Typography>
                    <IconButton
                        component={Link}
                        to="/"
                        sx={{maxWidth: "20%"}}
                        onClick={logout}
                        style={{maxWidth: '70px', maxHeight: '70px', color: "#f6f6ee"}}
                    >
                        <LogoutIcon />
                    </IconButton>

                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}