import LogoutButton from "../components/LogoutButton";
import React, {useEffect, useState} from "react";
import {Image, Item} from "../model/Item";
import axios from "axios";
import "material-react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import UploadIcon from '@mui/icons-material/Upload';
import {defaultCategory, defaultStatus, states, categories} from "../model/Constants";
import {
    Box,
    createTheme,
    CssBaseline, FormControl,
    Grid, InputLabel, MenuItem, Select, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import {Save} from "@mui/icons-material";
import {Link, useNavigate, useParams} from "react-router-dom";
import AppBarTop from "../components/AppBarTop";
import Footer from "../components/Footer";
import AddIcon from "@mui/icons-material/Add";


export default function ItemPage() {
    const [isEditItem, setIsEditItem] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageName, setImageName] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("AVAILABLE");

    const navigate = useNavigate();

    const params = useParams();

    const convert = Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    });

    useEffect(() => {
        (async () => {
            const id = params.id;
            const idIsSet = id !== undefined && id !== null;
            const itemDataPromise: Promise<Item> = idIsSet ?
                axios.get("/api/items/" + id).then((response) => response.data) :
                Promise.resolve(() => ({} as Item));
            itemDataPromise.then((item: Item) => {
                setIsEditItem(idIsSet);
                setName(item.name ?? "");
                setPrice(item.price ? convert.format(item.price) : "");
                setDescription(item.description ?? "");
                setImageName(item.image?.name ?? "");
                setCategory(item.category ?? defaultCategory);
                setStatus(item.status ? item.status.toLowerCase() : defaultStatus);
            });
        })();
    }, [params.id]);

    function submitItemData(event: React.FormEvent<HTMLElement>) {
        event.preventDefault();

        const correctedPrice = parseFloat(price.toString().replace(",", "."))
        const image: Image = {
            name: imageName,
        }
        const item: Item = {
            name: name,
            price: correctedPrice,
            description: description,
            image: image,
            category: category,
            status: status?.toUpperCase(),
        }
        const axiosAction = isEditItem ?
            axios.put("/api/items/" + params.id, item) :
            axios.post("/api/items/", item);
        return axiosAction
            .then(() => toast.success("Item saved."))
            .catch((error) => toast.error("Error: " + error));
    }

    const submitItemAndGoHome = (event: React.FormEvent<HTMLElement>) => {
        submitItemData(event).then(() => navigate("/"));
    }

    const submitItemAndAddNewItem = (event: React.FormEvent<HTMLElement>) => {
        submitItemData(event)
            .then(() => navigate("/itemdetails"));
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            const formData = new FormData();
            formData.append("file", event.target.files[0]);

            axios.post("/api/files", formData)
                .then((response) => {
                    setImageName(response.data.imageUrl);
                    toast.success("Image saved and set as Image URL. Please save item to persist changes.");
                })
                .catch((error) => toast.error(error.message));
        }
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <AppBarTop/>
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
                            Make art lovers happy!
                        </Typography>

                    </Container>

                    <Box component="form" noValidate
                        // onSubmit={submitItem}
                         sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    required
                                    fullWidth
                                    id="name"
                                    label="Title"
                                    name="name"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    id="description"
                                    label="Description"
                                    name="description"
                                    value={description}
                                    onChange={(event) => {
                                        setDescription(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="price"
                                    label="Price in EUR"
                                    name="price"
                                    value={price}
                                    onChange={(event) => {
                                        setPrice(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-category-label">Category</InputLabel>
                                    <Select
                                        required
                                        fullWidth
                                        labelId="category-select-label"
                                        value={category}
                                        label="Category"
                                        onChange={(event) => setCategory(event.target.value)}
                                    >
                                        {categories.map((category) => (<MenuItem value={category}>{category}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-select-label">Status</InputLabel>
                                    <Select
                                        required
                                        fullWidth
                                        labelId="status-select-label"
                                        value={status}
                                        label="Status"
                                        onChange={(event) => setStatus(event.target.value)}
                                    >
                                        {states.map((status) => (<MenuItem value={status}>{status}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Image URL"
                                    id="image"
                                    name="image"
                                    value={imageName}
                                    onChange={(event) => {
                                        setImageName(event.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Button
                                    variant={"contained"}
                                    component={"label"}
                                    startIcon={<UploadIcon/>}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        fileInputRef.current?.click();
                                    }}> UPLOAD IMAGE
                                </Button>

                                <input
                                    ref={fileInputRef}
                                    style={{display: "none"}}
                                    type={"file"}
                                    onChange={(e) => uploadImage(e)}
                                    accept={"image/*"}
                                />
                            </Grid>
                            {imageName && (
                                <Grid item xs={12}>
                                    <img src={imageName} alt="preview" style={{width: "100%"}}/>
                                </Grid>
                            )}
                        </Grid>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{mt: 3, mb: 2, bgcolor: '#91BFBC'}}
                            startIcon={<Save/>}
                            onClick={(event) => submitItemAndGoHome(event)}
                        >
                            Save and go back to Home Page
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{mt: 3, mb: 2, bgcolor: '#91BFBC'}}
                            startIcon={<Save/>}
                            endIcon={<AddIcon/>}
                            onClick={(event) => submitItemAndAddNewItem(event)}
                        >
                            Save and add new Item
                        </Button>

                    </Box>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to={"/"}>
                                {"back to start"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
                <LogoutButton/>
                <Footer/>
            </Container>

        </ThemeProvider>

    );
}