import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  Fade,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
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
}));

const Products = () => {
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalOption, setModalOption] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const history = useHistory();

  const classes = useStyles();

  const getPurchaseData = async () => {
    await API.get("purchase/getPurchases")
      .then((response) => {
        setRows(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getProducts = async () => {
    await API.get("products/getProducts")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createPurchase = async () => {
    await API.post("purchase/createPurchase", {
      supplier,
      date,
      value,
      quantity,
      productId: product._id,
    }).then(() => {
      getPurchaseData();
    });
  };

  const deletePurchase = async (id) => {
    await API.post("purchase/removePurchase/" + id).then(() => {
      getPurchaseData();
    });
  };

  const clearInputs = () => {
    setSupplier("");
    setDate("");
    setQuantity("");
    setValue("");
    setProduct("");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearInputs();
  };

  const handleChangeSelect = (event) => {
    setProduct(event.target.value);
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
    if (type === "value") {
      let newRows = rows;
      newRows.sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }
        if (a.value < b.value) {
          return -1;
        }
        return 0;
      });
      setRows(newRows);
    }
  };

  const setDeleteMsg = (id) => {
    setModalOption(id);
    setModalTitle(
      "Você está prestes a DELETAR um registro de compra, tem certeza?"
    );
    setModalContent("Esta alteração será irreversível");
  };

  const setCreateMsg = () => {
    setModalOption("create");
    setModalTitle("Você está prestes a criar um registro de compra");
    setModalContent("Clique no botão para continuar");
  };

  useEffect(() => {
    getPurchaseData();
    getProducts();
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
          <h2 className={classes.centralize}>Insira uma nova compra</h2>
          <CardContent>
            <FormControl className={classes.formControl}>
              <Select
                value={product}
                onChange={handleChangeSelect}
                displayEmpty
                className={classes.selectEmpty}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="" disabled>
                  Produto
                </MenuItem>
                {products.map((prod) => {
                  <MenuItem value={prod._id}>{prod.name}</MenuItem>;
                })}
              </Select>
              <FormHelperText>Produto</FormHelperText>
            </FormControl>
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Fornecedor"
              value={supplier}
              onChange={(e) => {
                setSupplier(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Data"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Preço R$"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Quantidade"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
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
                        createPurchase();
                      } else {
                        deletePurchase(modalOption);
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
      <h2 className={classes.centralize}>Registro de Compras</h2>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label="a dense table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell
                onClick={() => {
                  sortTable("name");
                }}
                align="right"
              >
                Produto
              </StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => {
                  sortTable("value");
                }}
              >
                Fornecedor
              </StyledTableCell>
              <StyledTableCell align="right">Data</StyledTableCell>
              <StyledTableCell align="right">Preço R$</StyledTableCell>
              <StyledTableCell align="right">Quantidade</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell align="right">
                  {products.find((x) => x._id === row._id)}
                </StyledTableCell>
                <StyledTableCell align="right">{row.supplier}</StyledTableCell>
                <StyledTableCell align="right">{row.date}</StyledTableCell>
                <StyledTableCell align="right">{row.value}</StyledTableCell>
                <StyledTableCell align="right">{row.quantity}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={() => history.push(`/purchase/edit/${row._id}`)}
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
