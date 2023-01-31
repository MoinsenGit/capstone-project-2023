import LogoutButton from "../components/LogoutButton";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import {Item} from "../model/Item";
import DeleteIcon from '@mui/icons-material/Delete';

import {
    AppBar,
    Box,
    Button,
    Card, CardActions, CardContent, CardMedia,
    createTheme,
    CssBaseline,
    Grid,
    Stack,
    ThemeProvider,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const [items, setItems] = useState([] as Item[]);

    useEffect(() => {
        (async () => {
            axios.get("/api/items")
                .then((response) => setItems(response.data))
                .catch((error) => toast.error(error.message));
        })();
    }, []);

    const loadItems = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios.get("/api/items")
            .then((response) => setItems(response.data))
            .catch((error) => toast.error(error.message));
    }
    const navigate = useNavigate();
    const deleteItem = (event: React.FormEvent<HTMLElement>, id: (string | undefined)) => {
        event.preventDefault();
        axios.delete("/api/items/" + id)
            .then(() => {
                setItems(items.filter(item => item.id !== id));
                toast.success("Item deleted.");
            })
            .catch((error) => toast.error(error.message))
    }

    // TEST CODE VIEW ITEM
    const viewItem = (event: React.FormEvent<HTMLElement>, id: (string | undefined)) => {
        event.preventDefault();
        navigate("/itemdetails/" + id);
}
    // TEST CODE VIEW ITEM

    const theme = createTheme();

    return (
        <div className="App">
            <form onSubmit={loadItems}>
                <button>Load Items</button>
            </form>

            <ThemeProvider theme={theme}>
                <AppBar position="relative" style={{background: '#91BFBC'}}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            S.IT.CO
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                        }}
                    >
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                S.It.Co
                            </Typography>
                            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                                Welcome to S.It.Co - your place for collecting all your favorite items.
                            </Typography>

                            <Stack
                                sx={{pt: 4}}
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                                <Button
                                    href={"/itemdetails"}
                                    variant="contained"
                                    sx={{bgcolor: '#91BFBC'}}
                                >Add new Item</Button>
                            </Stack>
                        </Container>
                    </Box>

                    <Container sx={{py: 8}} maxWidth="md">
                        <Grid container spacing={4}>
                            {items.map((item) =>
                                (
                                    <Grid key={item.id}>
                                        <Card
                                            sx={{height: '100%', display: 'flex', flexDirection: 'column'}}
                                        >
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    pt: '50%',
                                                }}
                                                image={item.image.name}
                                                alt={item.name}
                                            />
                                            <CardContent sx={{flexGrow: 1}}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {item.name}
                                                </Typography>
                                                <Typography>
                                                    {item.description}
                                                </Typography>
                                                <Typography>
                                                    Price: {item.price}
                                                </Typography>
                                                <Typography>
                                                    Category: {item.category}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={(event) => viewItem(event, item.id)} variant="outlined"
                                                        size="small">View</Button>
                                                <Button onClick={(event) => deleteItem(event, item.id)}
                                                        variant="outlined" size="small" startIcon={<DeleteIcon/>}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Container>
                </Container>

                <LogoutButton/>

            </ThemeProvider>
        </div>
    );
}