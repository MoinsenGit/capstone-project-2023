import LogoutButton from "../components/LogoutButton";
import React, {useEffect, useState} from "react";
import {Image, Item} from "../model/Item";
import axios from "axios";
import "material-react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import Button from "@mui/material/Button";
import {
    Box,
    createTheme,
    CssBaseline,
    Grid, InputAdornment, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import {Save} from "@mui/icons-material";
import {Link, useParams} from "react-router-dom";
import AppBarTop from "../components/AppBarTop";


export default function ItemPage() {
    const [isEditItem, setIsEditItem] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageName, setImageName] = useState("");
    const [category, setCategory] = useState("");

    const params = useParams();

    useEffect(() => {
        (async () => {
            const id = params.id;
            if (id !== undefined && id !== null) {
                axios.get("/api/items/" + id)
                    .then((response) => {
                        setIsEditItem(true);
                        setName(response.data.name ?? "");
                        setPrice(response.data.price ?? "");
                        setDescription(response.data.description ?? "");
                        setImageName(response.data.image.name ?? "");
                        setCategory(response.data.category ?? "");
                    })
                    .catch((error) => toast.error(error.message));
            }
        })();
    }, [params.id]);

    const submitItem = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();

        const image: Image = {
            name: imageName,
        }
        const correctedPrice = typeof price === 'string' ?
            price.replace(",", ".") : price;

        const item: Item = {
            name: name,
            price: correctedPrice,
            description: description,
            image: image,
            category: category,
        }
        const axiosAction = isEditItem ?
            axios.put("/api/items/" + params.id, item) :
            axios.post("/api/items/", item);
        axiosAction
            .then(() => toast.success("Item saved."))
            .catch((error) => toast.error("Error: " + error));
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

            <ToastContainer />
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
                                    label="Price"
                                    name="price"
                                    value={price}
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
                                    label="Category"
                                    id="category"
                                    name="category"
                                    value={category}
                                    onChange={(event) => {
                                        setCategory(event.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                    <button onClick={(event) => {
                                        event.preventDefault();
                                        fileInputRef.current?.click();
                                    }}> UPLOAD IMAGE</button>

                                    <input
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        type={"file"}
                                        onChange={(e) => uploadImage(e)}
                                        accept={"image/*"}
                                    />
                            </Grid>
                            {imageName && (
                                <Grid item xs={12}>
                                    <img src={imageName} alt="preview" style={{ width: "100%" }} />
                                </Grid>
                            )}
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

    );
}