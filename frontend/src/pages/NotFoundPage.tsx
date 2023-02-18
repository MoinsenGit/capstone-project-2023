import {useNavigate} from "react-router-dom";
import {Box, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import React from "react";
import theme from "../styles/theme";
import Footer from "../components/Footer";
import AppBarTop from "../components/AppBarTop";

export default function NotFoundPage() {

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBarTop/>
            <Box sx={{m: 7 }}>
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
                    Why don't you go to the <a  style={{textDecoration: "none", color: "#91BFBC"}} href="/" onClick={() => navigate("/")}>
                    homepage</a>?
                </Typography>
            </Box>
            <Footer/>
        </ThemeProvider>

    );
}