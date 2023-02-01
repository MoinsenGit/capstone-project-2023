import {AppBar, Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import React from "react";

export default function AppBarTop( ) {
    const goToHome = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.preventDefault();
        window.location.href = "/";
    }

    return (
        <AppBar position="relative" style={{background: '#91BFBC'}}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    <a onClick={(e) => goToHome(e)} style={{cursor:'pointer'}}> S.IT.CO </a>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}