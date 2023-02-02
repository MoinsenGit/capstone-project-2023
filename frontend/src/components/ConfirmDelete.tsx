import React from "react";
import axios from "axios";
import {Box, Button, Modal, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function ConfirmDelete({id}: {
    id: string,
    }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete("/api/items/" + id);
            navigate("/");
        } catch (e) {
            console.log(e)
        }
    }

    // TEST
//     setErrors([]);
//
//         navigate("/login" + location.search);
//     } catch (event) {
//         setErrors((errors) => [
//             ...errors,
//             "The username is already taken. " +
//             "Please try again."
//         ]);
//     }
// },
    // TEST
    return (
        <div>
            <Button onClick={handleOpen}
                    sx={{
                        mt: 3,
                        ml: 3,
                        color: 'error.main',
                        border: 1,
                        borderColor: 'error.main',
                        "&:hover": {
                            backgroundColor: 'error.main',
                            color: 'white',
                            borderColor: 'error.main'
                        },
                    }}>Löschen</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Kunden wirklich löschen?
                    </Typography>
                    <Button onClick={handleDelete}
                            sx={{
                                mt: 3,
                                color: 'error.main',
                                border: 1,
                                borderColor: 'error.main',
                                "&:hover": {
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    borderColor: 'error.main'
                                },
                            }}>
                        Ja, endgültig löschen
                    </Button>
                    <Button onClick={handleClose}
                            sx={{
                                mt: 3,
                                border: 0,
                                ml: 3
                            }} variant="outlined">
                        Abbrechen
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};