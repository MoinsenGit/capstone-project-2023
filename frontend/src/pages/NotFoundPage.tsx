import {useNavigate} from "react-router-dom";
import {AppBar, Box, createTheme, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import React from "react";

export default function NotFoundPage() {


const theme = createTheme();

const navigate = useNavigate();

return (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AppBar position="relative" style={{background: '#91BFBC'}}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    S.IT.CO
                </Typography>
            </Toolbar>
        </AppBar>

        <Box>
            <Typography
                variant="h1">
                404
            </Typography>
            <Typography
                variant="h2">
                Page not found
            </Typography>
            <Typography
                variant="h3">
                The page you are looking for does not exist.
            </Typography>
            <Typography
                variant="h4">
                Why don't you go to the <a href="/" onClick={() => navigate("/")}>
                homepage</a>?.
            </Typography>

        </Box>
    </ThemeProvider>

);
}