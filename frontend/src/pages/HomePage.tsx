import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";

import LogoutButton from "../components/LogoutButton";
import AppBarTop from "../components/AppBarTop";
import Footer from "../components/Footer";
import {Item} from "../model/Item";
import {categories, states} from "../model/Constants";
import theme from "../styles/theme";
import {v4 as uuidv4} from 'uuid';


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

    const clearFilter = () => {
        setFilterStatus("");
        setFilterName("");
        setFilterCategory("");
        filterItems("", "", "");
    }

    const filterItems = (status: string, name: string, category: string) => {
        const exampleItem = {} as Item;
        if (states.includes(status)) {
            exampleItem.status = status.toUpperCase();
        }
        if (name !== null && name !== "") {
            exampleItem.name = name;
        }
        if (categories.includes(category)) {
            exampleItem.category = category;
        }
        axios.post("/api/items/filter", exampleItem)
            .then((response) => setItems(response.data))
            .catch((error) => toast.error(error.message));
    };

    const convert = Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    });

    return (
        <ThemeProvider theme={theme}>
            <AppBarTop/>
            <CssBaseline/>
            <Container
                component="main"
                maxWidth={false}
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Grid container={true}
                      spacing={1}
                      direction="row"
                      alignItems="stretch"
                      justifyContent="center"
                >
                        <Box
                            maxWidth="40%"
                            component="img"
                            alignItems={"center, baseline"}
                            alt="S.IT.CO Logo"
                            src="/sitco-logo_round.png"
                            sx={{mt: 1, mb: 1}}
                        />
                        <Typography
                            variant="h5"
                            align="center"
                            color="primary"
                            paragraph
                        >
                            Welcome to S.IT.CO
                            <br></br>
                            <h6>your place for collecting all of your favorite items</h6>
                        </Typography>
                </Grid>

                {/*// FILTER START*/}

                <Grid container={true}
                      direction="column"
                      alignItems="stretch"
                      justifyContent="center"
                >
                    <Grid item md={12}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            Filter for what you want to see.
                        </Typography>
                    </Grid>
                    <Grid item md={12}
                          sx={{mt: 1, mb: 1}}
                    >
                        <TextField
                            fullWidth={true}
                            id="filter"
                            name="filter"
                            value={filterName}
                            label="Type to filter for title"
                            onChange={(event) => changeFilterName(event)}
                        />
                    </Grid>
                    <Grid container={true}
                          spacing={1}
                          direction="row"
                          alignItems="stretch"
                          justifyContent="center">
                        <Grid container item xs={12} md={6}>
                            <FormControl fullWidth={true}>
                                <InputLabel id="status-select-label">Select category to filter</InputLabel>
                                <Select
                                    fullWidth={true}
                                    labelId="filter-category-select"
                                    value={filterCategory}
                                    label="Select category to filter"
                                    onChange={(event) => changeFilterCategory(event)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={uuidv4()}
                                            value={category}
                                        >
                                            {category}
                                        </MenuItem>))}
                                    <MenuItem value="SHOW ALL">no filter</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={12} md={6}>
                            <FormControl fullWidth={true}>
                                <InputLabel id="status-select-label">Select status to filter</InputLabel>
                                <Select
                                    fullWidth={true}
                                    labelId="filter-status-select"
                                    value={filterStatus}
                                    label="Select status to filter"
                                    onChange={(event) => changeFilterStatus(event)}
                                >
                                    {states.map((status) => (
                                        <MenuItem key={uuidv4()} value={status}>{status}</MenuItem>))}
                                    <MenuItem value="SHOW ALL">no filter</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container={true}
                          spacing={0}
                          md={12}
                          sx={{flexDirection: "row-reverse"}}>
                        <Button
                            sx={{m: 2}}
                            onClick={() => clearFilter()}>Clear filter
                        </Button>
                    </Grid>
                </Grid>

                {/*// FILTER END*/}

                {/*// ITEM CARD */}

                <Grid container={true}
                      spacing={0}
                      direction="row"
                      alignItems="stretch"
                      justifyContent="center"
                >
                    {items.map((item) => (
                            <Grid
                                item key={item.id}
                                mb={4}
                                alignItems="stretch"
                                justifyContent="center"
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        width: 340,
                                        margin: {xs: 1, sm: 2, md: 3}
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <CardMedia
                                            sx={{
                                                maxWidth: {xs: 170, sm: 200, md: 250, lg: 350},
                                                margin: {xs: 1, sm: 2, md: 3, lg: 4},
                                                marginTop: {xs: 3, sm: 3, md: 3, lg: 4},
                                                padding: {xs: 1, sm: 2, md: 3, lg: 4},
                                                borderRadius: '12px',
                                                boxShadow: 3,
                                            }}
                                            component="img"
                                            image={item.image.name}
                                            alt={item.name}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">
                                            {item.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {item.description}
                                        </Typography>
                                        <TableContainer>
                                            <Table
                                                aria-label="simple table"
                                                sx={{maxWidth: 340, mt: 1, mb: 0}}>
                                                <TableRow>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: 'darkslategrey', padding: '3px', fontSize: '16px'}}
                                                    >Price</TableCell>
                                                    <TableCell
                                                        align="right"
                                                        style={{color: 'darkslategrey', padding: '3px', fontSize: '16px'}}
                                                    >{convert.format(item.price)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: 'darkslategrey', padding: '3px', fontSize: '16px'}}
                                                    >Category</TableCell>
                                                    <TableCell
                                                        align="right"
                                                        style={{color: 'darkslategrey', padding: '3px', fontSize: '16px'}}
                                                    >{item.category}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: 'darkslategrey', padding: '3px', fontSize: '16px'}}
                                                    >Status</TableCell>
                                                    <TableCell
                                                        align="right"
                                                        style={{color: 'darkslategrey', padding: '3px', fontSize: '16px'}}
                                                    >{item.status}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>

                                    <CardActions
                                        style={{paddingRight: '16px', paddingLeft: '16px'}}
                                    >
                                        <IconButton
                                            color="primary"
                                            aria-label="delete item"
                                            onClick={() => openDeleteConfirmationDialog(item.id)}
                                        >
                                            <input hidden/>
                                            <DeleteIcon/>
                                        </IconButton>

                                        <Button
                                            fullWidth={true}

                                            onClick={(event) => viewItem(event, item.id)}
                                            variant="outlined"
                                            size="small"
                                        >
                                            View / Edit Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    )}

                    {/*// Logout Button */}

                    <Grid container={true}
                    >
                        <LogoutButton/>
                    </Grid>

                    {/*
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Pagination count={pageCount} page={page} onChange={handlePageChange}/>
                        </Grid>
                    </Grid>
*/
                    }

                    {/*// ADD Button */}

                    <Box>
                        <Fab aria-label="add"
                             style={{position: 'fixed', bottom: 40, right: 20}}
                             href={"/itemdetails"}
                             sx={{bgcolor: '#91BFBC', color: "white"}}
                        >
                            <AddIcon/>
                        </Fab>
                    </Box>
                </Grid>

                {/*// DELETE CONFIRMATION DIALOG */}
                <Dialog
                    open={openDeleteConfirmation}
                    onClose={cancelDelete}
                    aria-labelledby="delete confirmation dialog"
                    aria-describedby="delete confirmation: are you sure?"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please confirm, that this item should be deleted.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelDelete} autoFocus>Cancel</Button>
                        <Button onClick={(event) => deleteItem(event)}>Delete</Button>
                    </DialogActions>
                </Dialog>

            </Container>

            <Footer/>

        </ThemeProvider>
    )
        ;
}