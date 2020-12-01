import { Button, Card, CardActions, CardContent, makeStyles, TextField } from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { useEffect, useState } from "react";
import { useParams } from 'react-router';

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
}));

const Products = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [birth_date, setBirthDate] = useState("");
    const [open, setOpen] = useState(false);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getClientData = async () => {
        await API.get("client/getClient/" + id).then((response) => {
            setName(response.data.name);
            setCpf(response.data.cpf);
            setBirthDate(response.data.birth_date);
            setAddress(response.data.address);
            setPhone(response.data.phone);
        }).catch((err) => {
            console.log(err.response);
        });
    };

    const updateClient = async () => {
        console.log("here");
        await API.post("client/updateClient/" + id, {
            name: name,
            cpf: cpf,
            birth_date: birth_date,
            address: address,
            phone: phone,
        }).then((response) => {
            setName(response.data.name);
            setCpf(response.data.cpf);
            setBirthDate(response.data.birth_date);
            setAddress(response.data.address);
            setPhone(response.data.phone);
        }).catch((err) => {
            console.log(err.response);
        });
    }

    const classes = useStyles();

    useEffect(() => {
        getClientData();
    }, []);

    return (
        <div>
            <br></br>
            <Card variant="outlined">
                <form className={classes.centralize}>
                    <CardContent>
                        <h1 className={classes.centralize} >Editar o Cliente {name}</h1>
                        <br />
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
                            updateClient();
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
                                    <h2 id="transition-modal-title">Usuário atualizado com sucesso!</h2>
                                    <p className={classes.centralize} id="transition-modal-description">{name} foi atualizado</p>
                                </div>
                            </Fade>
                        </Modal>
                    </CardActions>
                </form>
            </Card>
        </div >
    );
};

export default Products;
