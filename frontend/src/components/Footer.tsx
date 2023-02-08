import {AppBar, Typography} from "@mui/material";
import React from "react";

export default function Footer( ) {

    return (
        <AppBar position="relative" style={{background: '#91BFBC'}}>
            <Typography
                variant="body2"
                color="white"
                align="center">
                {' © '}
                {new Date().getFullYear()}
            </Typography>
        </AppBar>
    );
}