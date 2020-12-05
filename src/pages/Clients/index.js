import { Backdrop, Button, Card, CardActions, CardContent, Fade, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import API from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  centralize: {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    minWidth: 700,
  },
  textInput: {
    margin: theme.spacing(1),
  },
  container: {
    maxHeight: 600,
  }
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
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalOption, setModalOption] = useState("");

  const classes = useStyles();

  const getClientsData = async () => {
    await API.get("client/getClients")
      .then((response) => {
        setRows(response.data);
      })
      .catch((err) => {
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
      getClientsData();
    });
  };

  const clearInputs = () => {
    setName("");
    setCpf("");
    setAddress("");
    setPhone("");
    setBirthDate("");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearInputs();
  };

  const sortTable = (type) => {
    if (type === "name") {
      let newRows = rows;
      newRows.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
      setRows(newRows);
    }
  };

  const setDeleteMsg = (id) => {
    setModalOption(id);
    setModalTitle("Você está prestes a DELETAR um cliente, tem certeza?");
    setModalContent("Esta alteração será irreversível");
  };

  const setCreateMsg = () => {
    setModalOption("create");
    setModalTitle("Você está prestes a criar um cliente");
    setModalContent("Clique no botão para continuar");
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
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  return (
    <>
      <br />
      <Card variant="outlined">
        <form className={classes.centralize}>
          <h2 className={classes.centralize && classes.textInput}>
            Insira um novo cliente
          </h2>
          <CardContent>
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className={classes.textInput}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-cpf"
              label="CPF"
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value);
              }}
              className={classes.textInput}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-birth-date"
              label="Data de Nascimento"
              value={birth_date}
              onChange={(e) => {
                setBirthDate(e.target.value);
              }}
              className={classes.textInput}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-address"
              label="Endereço"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className={classes.textInput}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-number"
              label="Número"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className={classes.textInput}
            />
          </CardContent>
          <CardActions>
            <Button
              className={classes.centralize}
              onClick={() => {
                setCreateMsg();
                handleOpen();
              }}
              variant="outlined"
              color="primary"
            >
              Criar
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
              }}
            >
              <Fade in={open}>
                <div className={classes.paper}>
                  <h2 id="transition-modal-title">{modalTitle}</h2>
                  <p
                    className={classes.centralize}
                    id="transition-modal-description"
                  >
                    {modalContent}
                  </p>
                  <Button
                    style={{ marginLeft: "35%" }}
                    onClick={() => {
                      if (modalOption === "create") {
                        createClient();
                      } else {
                        deleteClient(modalOption);
                      }
                      handleClose();
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    Confirmar
                  </Button>
                </div>
              </Fade>
            </Modal>
          </CardActions>
        </form>
      </Card>
      <h2 className={classes.centralize}>Dados dos usários</h2>
      <TableContainer component={Paper} className={classes.container}>
        <Table
          className={classes.table && classes.centralize}
          aria-label="a dense sticky table"
          size="small"
          stickyHeader
          style={{maxWidth: "70%"}}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell
                align="right"
                onClick={() => {
                  sortTable("name");
                }}
              >
                Nome
              </StyledTableCell>
              <StyledTableCell align="right">CPF</StyledTableCell>
              <StyledTableCell align="right">Endereço</StyledTableCell>
              <StyledTableCell align="right">
                Data de Nascimento
              </StyledTableCell>
              <StyledTableCell align="right">Telefone</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">{row.cpf}</StyledTableCell>
                <StyledTableCell align="right">{row.address}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.birth_date}
                </StyledTableCell>
                <StyledTableCell align="right">{row.phone}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={() => history.push(`/clients/edit/${row._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={() => {
                      handleOpen();
                      setDeleteMsg(row._id);
                    }}
                  >
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
