import {AppBar, Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import {Link} from "react-router-dom";

export default function AppBarTop( ) {

    return (
        <AppBar
            position="relative"
            style={{background: '#91BFBC'}}
        >
            <Toolbar>
                <Typography
                    variant="h6">
                    <Link
                        style={{textDecoration:"none", color:"white"}}
                        to={"/"}
                    >
                        S.IT.CO
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}