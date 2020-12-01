import { Backdrop, Button, Card, CardActions, CardContent, Fade, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import API from "../../services/api";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    centralize: {
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    table: {
        minWidth: 700,
    },
}));

const Clients = () => {

    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [birth_date, setBirthDate] = useState("");
    const history = useHistory();

    const classes = useStyles();

    const getClientsData = async () => {
        await API.get("client/getClients").then((response) => {
            console.log(response.data);
            setRows(response.data);
        }).catch((err) => {
            console.log(err.response);
        });
    };

    const createClient = async () => {
        await API.post("client/createClient", {
            name: name,
            cpf: cpf,
            birth_date: birth_date,
            address: address,
            phone: phone,
        }).then(() => {
            getClientsData();
        });
    };

    const deleteClient = async (id) => {
        await API.post("client/removeClient/" + id).then(() => {
            console.log("a");
            getClientsData();
        });
    }

    const clearInputs = () => {
        setName("");
        setCpf("");
        setAddress("");
        setPhone("");
        setBirthDate("");
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearInputs();
    };

    useEffect(() => {
        getClientsData();
        console.log(rows);
    }, []);

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);

    return (
        <>
            <br />
            <Card variant="outlined">
                <form className={classes.centralize}>
                    <h2 className={classes.centralize}>Insira um novo cliente</h2>
                    <CardContent>
                        <TextField required variant="outlined" id="standard-required-name" label="Nome" value={name}
                            onChange={(e) => { setName(e.target.value) }} />
                        <TextField required variant="outlined" id="standard-required-cpf" label="CPF" value={cpf}
                            onChange={(e) => { setCpf(e.target.value) }} />
                        <TextField required variant="outlined" id="standard-required-birth-date" label="Data de Nascimento" value={birth_date}
                            onChange={(e) => { setBirthDate(e.target.value) }} />
                        <TextField required variant="outlined" id="standard-required-address" label="Endereço" value={address}
                            onChange={(e) => { setAddress(e.target.value) }} />
                        <TextField required variant="outlined" id="standard-required-number" label="Número" value={phone}
                            onChange={(e) => { setPhone(e.target.value) }} />
                    </CardContent>
                    <CardActions>
                        <Button className={classes.centralize} onClick={() => {
                            handleOpen();
                            createClient();
                        }} variant="outlined" color="primary">
                            Atualizar
                        </Button>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}>
                            <Fade in={open}>
                                <div className={classes.paper}>
                                    <h2 id="transition-modal-title">Alteração realizada com sucesso!</h2>
                                    <p className={classes.centralize} id="transition-modal-description">Sua alteração foi realizada com êxito</p>
                                </div>
                            </Fade>
                        </Modal>
                    </CardActions>
                </form>
            </Card>
            <h2 className={classes.centralize}>Dados dos usários</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="right">Nome</StyledTableCell>
                            <StyledTableCell align="right">CPF</StyledTableCell>
                            <StyledTableCell align="right">Endereço</StyledTableCell>
                            <StyledTableCell align="right">Data de Nascimento</StyledTableCell>
                            <StyledTableCell align="right">Telefone</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            < StyledTableRow key={row._id}>
                                <StyledTableCell align="right">{row.name}</StyledTableCell>
                                <StyledTableCell align="right">{row.cpf}</StyledTableCell>
                                <StyledTableCell align="right">{row.address}</StyledTableCell>
                                <StyledTableCell align="right">{row.birth_date}</StyledTableCell>
                                <StyledTableCell align="right">{row.phone}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton color="inherit" aria-label="account" onClick={() => history.push(`/clients/edit/${row._id}`)}>
                                        <EditIcon />
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton color="inherit" aria-label="account" onClick={() => {
                                        handleOpen();
                                        deleteClient(row._id);
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Clients;
