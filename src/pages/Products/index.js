import { Backdrop, Button, Card, CardActions, CardContent, Fade, FormControl, IconButton, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
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
  formControl: {
    margin: theme.spacing(0),
    marginLeft: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  container: {
    maxHeight: 600,
  }
}));

const Products = () => {
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalOption, setModalOption] = useState("");
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [category, setCategory] = useState("");
  const history = useHistory();

  const classes = useStyles();

  const getProductsData = async () => {
    await API.get("product/getProducts")
      .then((response) => {
        setRows(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const createProduct = async () => {
    await API.post("product/createProduct", {
      name: name,
      category: category,
      imgUrl: "",
    }).then(() => {
      getProductsData();
    });
  };

  const deleteProduct = async (id) => {
    await API.post("product/removeProduct/" + id).then(() => {
      getProductsData();
    });
  };

  const clearInputs = () => {
    setName("");
    setCategory("");
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
    if (type === "category") {
      let newRows = rows;
      newRows.sort((a, b) => {
        if (a.category > b.category) {
          return 1;
        }
        if (a.category < b.category) {
          return -1;
        }
        return 0;
      });
      setRows(newRows);
    }
  };

  const setDeleteMsg = (id) => {
    setModalOption(id);
    setModalTitle("Você está prestes a DELETAR um produto, tem certeza?");
    setModalContent("Esta alteração será irreversível");
  };

  const setCreateMsg = () => {
    setModalOption("create");
    setModalTitle("Você está prestes a criar um produto");
    setModalContent("Clique no botão para continuar");
  };

  useEffect(() => {
    getProductsData();
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
          <h2 className={classes.centralize}>Insira um novo produto</h2>
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
            />
            <FormControl className={classes.formControl}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                displayEmpty
                className={classes.selectEmpty}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  <em>Selecione</em>
                </MenuItem>
                <MenuItem value={"Kit"}>Kit</MenuItem>
                <MenuItem value={"Mod"}>Mod</MenuItem>
                <MenuItem value={"Pod"}>Pod</MenuItem>
                <MenuItem value={"Juice"}>Juice</MenuItem>
                <MenuItem value={"Juice NicSalt"}>Juice NicSalt</MenuItem>
                <MenuItem value={"Baterias"}>Baterias</MenuItem>
                <MenuItem value={"Resistências"}>Resistências</MenuItem>
                <MenuItem value={"Atomizadores"}>Atomizadores</MenuItem>
              </Select>
            </FormControl>
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
                        createProduct();
                      } else {
                        deleteProduct(modalOption);
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
      <h2 className={classes.centralize}>Dados dos Produtos</h2>
      <TableContainer component={Paper} className={classes.container}>
        <Table
          className={classes.table && classes.centralize}
          aria-label="a sticky dense table"
          size="small"
          stickyHeader
          style={{maxWidth: "50%"}}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell
                onClick={() => {
                  sortTable("name");
                }}
                align="right"
              >
                Nome
              </StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => {
                  sortTable("category");
                }}
              >
                Categoria
              </StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">{row.category}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={() => history.push(`/products/edit/${row._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={() => {
                      setDeleteMsg(row._id);
                      handleOpen();
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

export default Products;
