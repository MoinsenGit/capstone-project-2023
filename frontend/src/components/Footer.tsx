
import {ThemeProvider, Typography} from "@mui/material";
import React from "react";
import theme from "../styles/theme";

export default function Footer() {

    return (
        <ThemeProvider theme={theme}>

            <div>
                <Typography
                    variant="body2"
                    color="#91BFBC"
                    align="center"
                    marginTop={2}
                    marginBottom={2}>
                    {' © '}
                    {new Date().getFullYear()}
                </Typography>
            </div>
        </ThemeProvider>
    );
}
