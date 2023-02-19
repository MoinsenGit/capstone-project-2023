import LogoutButton from "../components/LogoutButton";
import React, {useEffect, useState} from "react";
import {Image, Item} from "../model/Item";
import axios from "axios";
import "material-react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import UploadIcon from '@mui/icons-material/Upload';
import {categories, defaultCategory, defaultStatus, states} from "../model/Constants";
import {
    Box,
    CssBaseline,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import {Save} from "@mui/icons-material";
import {Link, useNavigate, useParams} from "react-router-dom";
import AppBarTop from "../components/AppBarTop";
import Footer from "../components/Footer";
import theme from "../styles/theme";
import {v4 as uuidv4} from "uuid";
import {FieldError} from "../model/FieldError";

export default function ItemPage() {
    const [isEditItem, setIsEditItem] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("AVAILABLE");

    const [errorName, setErrorName] = useState("");
    const [errorPrice, setErrorPrice] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorImageUrl, setErrorImageUrl] = useState("");

    const navigate = useNavigate();

    const params = useParams();

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
                setPrice(item.price ? item.price.toFixed(2).replace(".", ",") : "");
                setDescription(item.description ?? "");
                setImageUrl(item.image?.url ?? "");
                setCategory(item.category ?? defaultCategory);
                setStatus(item.status ? item.status : defaultStatus);
            });
        })();
    }, [params.id]);

    function submitItemData(event: React.FormEvent<HTMLElement>) {
        event.preventDefault();

        const correctedPrice = parseFloat(price.toString().replace(",", "."))

        const image: Image = {
            url: imageUrl,
        }
        const item: Item = {
            name: name,
            price: correctedPrice,
            description: description,
            image: image,
            category: category,
            status: status
        }
        const axiosAction = isEditItem ?
            axios.put("/api/items/" + params.id, item) :
            axios.post("/api/items/", item);
        return axiosAction
            .then(() => {
                setIsEditItem(false);
                setName("");
                setPrice("");
                setDescription("");
                setImageUrl("");
                setCategory(defaultCategory);
                setStatus(defaultStatus);
            })
            .then(() => toast.success("Item saved."));
    }

    const handleError = (error: any) => {
        if (error.response.status == 400 && error.response.data.errors) {
            error.response.data.errors.forEach((fieldError: FieldError) => {
                if (fieldError.field == "name") {
                    setErrorName(fieldError.message);
                } else if (fieldError.field == "description") {
                    setErrorDescription(fieldError.message);
                } else if (fieldError.field == "price") {
                    setErrorPrice(fieldError.message);
                } else if (fieldError.field == "image" || fieldError.field == "image.url") {
                    setErrorImageUrl(fieldError.message);
                } else {
                    toast.error(fieldError.message);
                }
            });
        } else {
            toast.error("Error: " + error);
        }
    }
    const submitItemAndGoHome = (event: React.FormEvent<HTMLElement>) => {
        submitItemData(event)
            .then(() => navigate("/"))
            .catch((error) => handleError(error));
    }

    const submitItemAndAddNewItem = (event: React.FormEvent<HTMLElement>) => {
        submitItemData(event)
            .then(() => navigate("/itemdetails"))
            .catch((error) => handleError(error));
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            const formData = new FormData();
            formData.append("file", event.target.files[0]);

            axios.post("/api/files", formData)
                .then((response) => {
                    setImageUrl(response.data.imageUrl);
                    toast.success("Image saved and set as Image URL. Please save item to save changes.");
                })
                .catch((error) => toast.error(error.message));
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBarTop/>
            <Container
                component="main"
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Box>
                    <Typography
                        variant="h5"
                        align="center"
                        color="#91BFBC"
                        gutterBottom
                    >
                        View, edit and add your items.
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="#91BFBC"
                        paragraph>
                        Make art lovers happy!
                    </Typography>

                    <Box
                        component="form"
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
                                    error={errorName !== ""}
                                    helperText={errorName}
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                />
                            </Grid>

                            {/*// IMAGE*/}

                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Image URL"
                                    id="image"
                                    name="image"
                                    value={imageUrl}
                                    error={errorImageUrl !== ""}
                                    helperText={errorImageUrl}
                                    onChange={(event) => {
                                        setImageUrl(event.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant={"contained"}
                                    component={"label"}
                                    startIcon={<UploadIcon/>}
                                    sx={{color: '#fff'}}
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
                            {imageUrl && (
                                <Grid item xs={12}>
                                    <img src={imageUrl} alt="preview" style={{width: "100%"}}/>
                                </Grid>
                            )}

                            {/*// IMAGE END*/}

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    id="description"
                                    label="Description"
                                    name="description"
                                    value={description}
                                    error={errorDescription !== ""}
                                    helperText={errorDescription}
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
                                    error={errorPrice !== ""}
                                    helperText={errorPrice}
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
                                        {categories.map((category) => (
                                            <MenuItem key={uuidv4()} value={category}>{category}</MenuItem>))}
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
                                        {states.map((status) => (
                                            <MenuItem key={uuidv4()} value={status}>{status}</MenuItem>))}
                                    </Select>
                                </FormControl>

                            </Grid>

                        </Grid>
                        <Grid container
                              justifyContent="center"
                              spacing={1}>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{mt: 3, mb: 2, color: '#fff'}}
                                    startIcon={<Save/>}
                                    onClick={(event) => submitItemAndGoHome(event)}
                                >
                                    Save & back
                                </Button>
                            </Grid>

                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{mt: 3, mb: 2, color: '#fff'}}
                                    startIcon={<Save/>}
                                    onClick={(event) => submitItemAndAddNewItem(event)}
                                >
                                    Save & Next
                                </Button>
                            </Grid>
                            <Link
                                style={{textDecoration: "none", color: "#91BFBC"}}
                                to={"/"}
                            >
                                {"Back to home page without saving"}
                            </Link>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{mt: 3, mb: 2, color: '#91BFBC'}}
                                    startIcon={<UploadIcon/>}
                                    href={"/csvImport"}
                                >
                                    Go to CVS-Upload Page
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                </Box>
                <Grid container={true}
                      sx={{mb: 2}}
                >
                    <LogoutButton/>
                </Grid>
            </Container>
            <Footer/>

        </ThemeProvider>

    );
}
