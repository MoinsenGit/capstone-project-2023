import LogoutButton from "../components/LogoutButton";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    createTheme,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogTitle, FormControl,
    Grid, InputLabel, MenuItem, Select, SelectChangeEvent,
    Stack, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import AppBarTop from "../components/AppBarTop";
import {Item} from "../model/Item";

export default function HomePage() {
    const [items, setItems] = useState([] as Item[]);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterName, setFilterName] = useState("");
    const [idOfItemToDelete, setIdOfItemToDelete] = useState("");

    useEffect(() => {
        (async () => {
            axios.get("/api/items")
                .then((response) => setItems(response.data))
                .catch((error) => toast.error(error.message));
        })();
    }, []);

    const navigate = useNavigate();

    const openDeleteConfirmationDialog = (id: (string | undefined)) => {
        if (id) {
            setIdOfItemToDelete(id);
        }
        setOpenDeleteConfirmation(true);
    };

    const cancelDelete = () => {
        setOpenDeleteConfirmation(false);
    };

    const deleteItem = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();
        const id = idOfItemToDelete;
        axios.delete("/api/items/" + id)
            .then(() => {
                setItems(items.filter(item => item.id !== id));
                toast.success("Item deleted.");
            })
            .catch((error) => toast.error(error.message))
            .finally(() => setOpenDeleteConfirmation(false));
    }

    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);

    const viewItem = (event: React.FormEvent<HTMLElement>, id: (string | undefined)) => {
        event.preventDefault();
        navigate("/itemdetails/" + id);
    }

    const changeStatus = (event: SelectChangeEvent, itemId: (string | undefined)) => {
        event.preventDefault();
        const newStatus = event.target.value;
        axios.patch("/api/items/" + itemId + "/status/" + newStatus)
            .then(() => {
                setItems(items
                    .map(item => {
                        if(item.id === itemId) {
                            item.status = newStatus;
                        }
                        return item;
                    }));
                toast.success("Item status changed successfully to "+newStatus+".");
            })
            .catch((error) => toast.error(error.message));
    };

    const changeFilterStatus = (event: SelectChangeEvent) => {
        event.preventDefault();
        setFilterStatus(event.target.value);
        filterItems(event.target.value, filterName);
    };
    const changeFilterName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        setFilterName(event.target.value);
        filterItems(filterStatus, event.target.value);
    };

    const filterItems = (status: string, name: string) => {
        const exampleItem = {} as Item;
        if(status === "AVAILABLE" || status === "RESERVED" || status === "SOLD") {
            exampleItem.status = status;
        }
        if(name !== null && name !== "") {
            exampleItem.name = name;
        }
        axios.post("/api/items/filter", exampleItem)
            .then((response) => setItems(response.data))
            .catch((error) => toast.error(error.message));
    };

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
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            S.It.Co
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Welcome to S.It.Co - your place for collecting all of your favorite items.
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

                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={6}>
                                <Container maxWidth="sm">
                                    <TextField
                                        fullWidth={true}
                                        id="filter"
                                        name="filter"
                                        value={filterName}
                                        label="Type to filter for name"
                                        onChange={(event) => changeFilterName(event)}
                                    />
                                </Container>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-select-label">Select status to filter</InputLabel>
                                    <Select
                                        fullWidth={true}
                                        labelId="filter-status-select"
                                        value={filterStatus}
                                        label="Select status to filter"
                                        onChange={(event) => changeFilterStatus(event)}
                                    >
                                        <MenuItem value="AVAILABLE">available</MenuItem>
                                        <MenuItem value="RESERVED">reserved</MenuItem>
                                        <MenuItem value="SOLD">sold</MenuItem>
                                        <MenuItem value="">no filter</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {items.map((item) =>
                            (
                                <Grid key={item.id} bgcolor={"grey"} mt={4}>
                                    <Card
                                        sx={{height: '100%', display: 'flex', flexDirection: 'column',}}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={item.image.name}
                                            alt={item.name}
                                        />
                                        <CardContent sx={{flexGrow: 1}}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {item.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {item.description}
                                            </Typography>
                                            <Typography>
                                                Price: {item.price}
                                            </Typography>
                                            <Typography>
                                                Category: {item.category}
                                            </Typography>

                                            <FormControl fullWidth>
                                                <InputLabel id="status-select-label">Status</InputLabel>
                                                <Select
                                                    labelId="status-select-label"
                                                    value={item.status}
                                                    label="status"
                                                    onChange={(event) => changeStatus(event, item.id)}
                                                >
                                                    <MenuItem value="AVAILABLE">available</MenuItem>
                                                    <MenuItem value="RESERVED">reserved</MenuItem>
                                                    <MenuItem value="SOLD">sold</MenuItem>
                                                </Select>
                                            </FormControl>

                                        </CardContent>
                                        <CardActions>
                                            <Button onClick={(event) => viewItem(event, item.id)} variant="outlined"
                                                    size="small">View</Button>
                                            <Button
                                                onClick={() => openDeleteConfirmationDialog(item.id)}
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

            <Dialog
                open={openDeleteConfirmation}
                onClose={cancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Please confirm, that this Item should be deleted."}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={cancelDelete} autoFocus>Cancel</Button>
                    <Button onClick={(event) => deleteItem(event)}>Delete</Button>
                </DialogActions>
            </Dialog>

            <LogoutButton/>

        </ThemeProvider>

    );
}