import {AppBar, Box, createTheme, ThemeProvider, Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import {Link} from "react-router-dom";

export default function AppBarTop( ) {


    const theme = createTheme({
    });

    return (
        <ThemeProvider theme={theme}>

        <AppBar
            position="relative"
            style={{
                background: '#91BFBC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'baseline'}}
        >
            <Toolbar>
                <Link
                    to={"/"}
                >
                    <Box
                        maxWidth="20%"
                        component="img"
                        alignItems={"baseline"}
                        alt="S.IT.CO Logo"
                        src="/sitco-logo_round.png"
                    />
                </Link>

                <Typography
                    variant="h6">
                    <Link
                        style={{textDecoration:"none", color:"#f6f6ee"}}
                        to={"/"}
                    >
                        S.IT.CO
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
        </ThemeProvider>
    );
}