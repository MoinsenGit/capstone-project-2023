import LogoutButton from "../components/LogoutButton";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {categories, states} from "../model/Constants";

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    createTheme,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import AppBarTop from "../components/AppBarTop";
import {Item} from "../model/Item";
import Footer from "../components/Footer";

export default function HomePage() {
    const [items, setItems] = useState([] as Item[]);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [idOfItemToDelete, setIdOfItemToDelete] = useState("");

    useEffect(() => filterItems("", "", ""), []);

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

/*
    const changeStatus = (event: SelectChangeEvent, itemId: (string | undefined)) => {
        event.preventDefault();
        const newStatus = event.target.value;
        axios.patch("/api/items/" + itemId + "/status/" + newStatus)
            .then(() => {
                setItems(items
                    .map(item => {
                        if (item.id === itemId) {
                            item.status = newStatus;
                        }
                        return item;
                    }));
                toast.success("Item status changed successfully to " + newStatus + ".");
            })
            .catch((error) => toast.error(error.message));
    };
*/

    const changeFilterStatus = (event: SelectChangeEvent) => {
        event.preventDefault();
        setFilterStatus(event.target.value);
        filterItems(event.target.value, filterName, filterCategory);
    };
    const changeFilterName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        setFilterName(event.target.value);
        filterItems(filterStatus, event.target.value, filterCategory);
    };
    const changeFilterCategory = (event: SelectChangeEvent) => {
        event.preventDefault();
        setFilterCategory(event.target.value);
        filterItems(filterStatus, filterName, event.target.value);
    };

    const convert = Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    });

    const filterItems = (status: string, name: string, category: string) => {
        const exampleItem = {} as Item;
        if (states.includes(status)) {
            exampleItem.status = status.toUpperCase();
        }
        if (name !== null && name !== "") {
            exampleItem.name = name;
        }
        if(categories.includes(category)) {
            exampleItem.category = category;
        }
        axios.post("/api/items/filter", exampleItem)
            .then((response) => setItems(response.data))
            .catch((error) => toast.error(error.message));
    };

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <AppBarTop/>

            <CssBaseline/>
            <Grid container={true}
                  spacing={0}
                  direction="row"
                  justifyContent="center"
                  alignItems="flex-start"
                  bgcolor={"#f6f6ee"}>

                <Grid item md={4}>
                    <Box
                        maxWidth="100%"
                        component="img"
                        alt="S.IT.CO Logo"
                        src="/sitco-logo_round.png"
                        //  sx={{mt: 2, mb: 2}}
                    />
                    {/*                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        S.IT.CO
                    </Typography>*/}
                </Grid>
                <Grid item md={8} justifyContent="center">
                    <Typography
                        variant="h5"
                        align="center"
                        color="text.secondary"
                        paragraph
                    >
                        Welcome to S.IT.CO! <br/>
                        Your place for collecting all of your favorite items.
                    </Typography>
                </Grid>
            </Grid>

            <Grid item md={12} justifyContent="center">
{/*                <Button
                    href={"/itemdetails"}
                    variant="contained"
                    sx={{bgcolor: '#91BFBC'}}
                >
                    Add new Item
                </Button>*/}
            </Grid>
            <Grid container={true}
                  spacing={4}
                  justifyContent="center"
                  bgcolor={"#f6f6ee"}>
                <Grid item spacing={3} md={8}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Filter for what you want to see.
                    </Typography>
                    <TextField
                        fullWidth={true}
                        id="filter"
                        name="filter"
                        value={filterName}
                        label="Type to filter for title."
                        onChange={(event) => changeFilterName(event)}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="status-select-label">Select category to filter</InputLabel>
                        <Select
                            fullWidth={true}
                            labelId="filter-category-select"
                            value={filterCategory}
                            label="Select category to filter"
                            onChange={(event) => changeFilterCategory(event)}
                        >
                            {categories.map((category) => (<MenuItem value={category}>{category}</MenuItem>))}
                            <MenuItem value="SHOW ALL">no filter</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="status-select-label">Select status to filter</InputLabel>
                        <Select
                            fullWidth={true}
                            labelId="filter-status-select"
                            value={filterStatus}
                            label="Select status to filter"
                            onChange={(event) => changeFilterStatus(event)}
                        >
                            {states.map((status) => (<MenuItem value={status}>{status}</MenuItem>))}
                            <MenuItem value="SHOW ALL">no filter</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container={true} spacing={0}>
                {items.map((item) => (
                    <Grid item key={item.id} bgcolor={"grey"} mt={4} xs spacing={4}>
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
                                <Typography color={"red"}>
                                    Price: {convert.format(item.price)}
                                </Typography>
                                <Typography>
                                    Category: {item.category}
                                </Typography>
                                <Typography>
                                    Status: {item.status}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    onClick={() => openDeleteConfirmationDialog(item.id)}
                                    variant="outlined"
                                    size="small"
                                    startIcon={<DeleteIcon/>}
                                >
                                    Delete
                                </Button>

                                <Button
                                    onClick={(event) => viewItem(event, item.id)}
                                    variant="outlined"
                                    size="small"
                                >
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab aria-label="add"
                         style={{position:'fixed', bottom: 30, right: 20}}
                         href={"/itemdetails"}
                         sx={{bgcolor: '#91BFBC', color: "white"}}>
                        <AddIcon />
                    </Fab>
                </Box>
            </Grid>

            <Dialog
                open={openDeleteConfirmation}
                onClose={cancelDelete}
                aria-labelledby="delete confirmation dialog"
                aria-describedby="delete confirmation: are you sure?"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please confirm, that this Item should be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} autoFocus>Cancel</Button>
                    <Button onClick={(event) => deleteItem(event)}>Delete</Button>
                </DialogActions>
            </Dialog>

            <LogoutButton/>
            <Footer/>

        </ThemeProvider>
    );
}