import {AppBar, ThemeProvider, Typography} from "@mui/material";
import React from "react";
import theme from "../styles/theme";

export default function Footer() {

    return (
        <ThemeProvider theme={theme}>

            <AppBar
                position="relative"
                style={{background: '#91BFBC'}}
            >
                <Typography
                    variant="body2"
                    color="white"
                    align="center">
                    {' © '}
                    {new Date().getFullYear()}
                </Typography>
            </AppBar>
        </ThemeProvider>
    );
}