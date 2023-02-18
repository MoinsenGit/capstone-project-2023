import LogoutButton from "../components/LogoutButton";
import React, {useState} from "react";
import axios from "axios";
import "material-react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import UploadIcon from '@mui/icons-material/Upload';
import {
    Box,
    CssBaseline,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    ThemeProvider,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";
import AppBarTop from "../components/AppBarTop";
import Footer from "../components/Footer";
import theme from "../styles/theme";
import {v4 as uuidv4} from "uuid";
import {Item} from "../model/Item";

export default function CsvImportPage() {

    const csvInputRef = React.useRef<HTMLInputElement>(null);
    const [items, setItems] = useState([] as Item[]);
    const [errors, setErrors] = useState([] as String[]);

    const uploadCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            const formData = new FormData();
            formData.append("file", event.target.files[0]);

            axios.post("/api/csv", formData)
                .then((response) => {
                    setItems(response.data.items);
                    setErrors(response.data.errors);
                })
                .catch((error) => toast.error(error.message));
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBarTop/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
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
                            Import your items the easy way.
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            paragraph>
                            Lots and lots of new stuff!
                        </Typography>

                    </Container>

                    <Box component="form" noValidate
                         sx={{mt: 3, mb: 3}}>
                        <Button
                            variant={"contained"}
                            component={"label"}
                            startIcon={<UploadIcon/>}
                            sx={{width: "100%", color: "white", bgcolor: "#91BFBC"}}
                            onClick={(event) => {
                                event.preventDefault();
                                csvInputRef.current?.click();
                            }}> UPLOAD CSV
                        </Button>

                        <input
                            ref={csvInputRef}
                            style={{display: "none"}}
                            type={"file"}
                            onChange={(e) => uploadCsv(e)}
                            accept={"text/csv"}
                        />
                    </Box>

                    {/*// ITEM TABLE START*/}
                    <Typography
                        variant="h6"
                        sx={{color: '#91BFBC', mb: 1}}
                    >
                        {items.length > 0 ?
                            <p>These Items were imported successfully and are portrait on your home page: </p>
                            :
                            "Use the upload button to import your items via csv-file."}
                    </Typography>
                    <TableContainer
                        component={Paper}
                        sx={{mb: 3}}>
                        <Table aria-label="item table">
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={uuidv4()}>
                                        <TableCell>
                                            <Typography variant="body1">{item.name}</Typography>
                                            <Typography variant="body2">{item.price} EUR</Typography>
                                            <Typography variant="body2">{item.description}</Typography>
                                        </TableCell>
                                        <TableCell><img src={item.image.url} alt={"image preview"} width={50}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/*// ITEM TABLE END*/}

                    {/*// ERRORS TABLE START */}
                    <Typography
                        variant="h6"
                        sx={{color: '#91BFBC', mb: 1}}
                    >
                        {errors.length > 0 ?
                            <p>The Items in the following lines could not be imported. Please correct the csv-file and import ONLY the corrected lines.: </p>
                            :
                            " "}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="error table">
                            <TableBody>
                                {errors.map((error, index) => (
                                    <TableRow key={`error-${index}`}>
                                        <TableCell colSpan={8} align="left">
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/*// ERRORS TABLE END*/}


                    <Grid
                        container={true}
                        justifyContent="center"
                        sx={{mt: 3, mb: 3}}>
                        <Grid item>
                            <Link
                                style={{textDecoration: "none", color: "#91BFBC"}}
                                to={"/"}
                            >
                                {"Back to home page"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
                <LogoutButton/>
            </Container>
            <Footer/>

        </ThemeProvider>

    );
}
