import {AppBar, Toolbar, IconButton, Typography, ThemeProvider} from '@mui/material';
import {Link} from 'react-router-dom';
import theme from "../styles/theme";

export default function AppBarTop() {
    return (
        <ThemeProvider theme={theme}>

            <AppBar position="relative">
                <Toolbar
                    sx={{ justifyContent: 'space-between' }}
                >
                    <IconButton
                        component={Link}
                        to="/"
                        sx={{ maxWidth: "20%" }}
                    >
                        <img src="/sitco-logo_round.png"
                             alt="S.IT.CO Logo"
                             style={{ maxWidth: '70px', maxHeight: '70px' }}
                        />
                    </IconButton>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        style={{
                            textDecoration: "none",
                            color: "#f6f6ee"
                        }}
                    >
                        S.IT.CO
                    </Typography>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}