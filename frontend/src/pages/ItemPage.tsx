import LogoutButton from "../components/LogoutButton";
import React, {useState} from "react";
import {Image, Item} from "../model/Item";
import axios from "axios";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import {
    AppBar,
    Box,
    createTheme,
    CssBaseline,
    Grid, InputAdornment,
    Stack, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import {Save} from "@mui/icons-material";
import {Link} from "react-router-dom";


export default function ItemPage() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageName, setImageName] = useState("");
    const [category, setCategory] = useState("");

    const submitItem = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();

        const image: Image = {
            name: imageName,
        }
        const item: Item = {
            name: name,
            price: price,
            description: description,
            image: image,
            category: category,
        }
        axios.post("/api/items", item)
            .then(() => toast.success("Item saved."))
            .catch((error) => toast.error("Error: " + error));
    }
    {/*ToDo: make Toastify work*/
    }

    const theme = createTheme();

    return (
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
                            component="h4"
                            variant="h5"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            View, edit and add your items.
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            paragraph>
                            happy. happy. happy.
                        </Typography>

                    </Container>
                    <Box component="form" noValidate onSubmit={submitItem} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <TextField
                                    autoFocus
                                    required
                                    fullWidth
                                    id="name"
                                    label="Title"
                                    name="name"
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="description"
                                    multiline
                                    label="Description"
                                    name="description"
                                    onChange={(event) => {
                                        setDescription(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="price"
                                    label="Price"
                                    name="price"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">EUR</InputAdornment>,
                                    }}
                                    onChange={(event) => {
                                        setPrice(event.target.value)
                                    }}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="category"
                                    label="Category"
                                    id="category"
                                    onChange={(event) => {
                                        setCategory(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="image"
                                    label="Image URL"
                                    id="image"
                                    onChange={(event) => {
                                        setImageName(event.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{mt: 3, mb: 2, bgcolor: '#91BFBC'}}
                            startIcon={<Save/>}
                            onClick={(event) => submitItem(event)}
                        >
                            Save </Button>

                    </Box>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to={"/"}>
                                {"back to start"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <LogoutButton/>

        </ThemeProvider>

        /*

                <div>
                    <h1>View, Edit and Add Items</h1>
                    <br></br>
                    <br></br>
                    <form onSubmit={submitItem}>
                        <input name={"name"} placeholder="Name"
                               onChange={(event) => setName(event.target.value)}/>
                        <input name={"price"} placeholder="Price"
                               onChange={(event) => setPrice(event.target.value)}/>
                        <input name={"description"} placeholder="Description"
                               onChange={(event) => setDescription(event.target.value)}/>
                        <input name={"imageName"} placeholder="Image Name"
                               onChange={(event) => setImageName(event.target.value)}/>
                        <input name={"category"} placeholder="category"
                               onChange={(event) => setCategory(event.target.value)}/>
                        <br></br>
                        <br></br>
                        <Button variant="outlined" onClick={(event)=>submitItem(event)}>Save Item</Button>

        {/!*                {/!*ToDo: Add image upload*!/}
                        {/!*ToDo: empty fields after submit*!/}
                        {/!*ToDo: show ItemCard with new Item underneath form?*!/}*!/}

                    </form>
                    <br></br>
                    <br></br>
                    <a title="Home" href="/">Overview</a>
                    <br></br>
                    <br></br>
                    <div>
                        <LogoutButton/>
                    </div>
                </div>
        */
    );
}