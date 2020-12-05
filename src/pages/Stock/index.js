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
  textInput: {
    margin: theme.spacing(1),
  },
}));

const Stock = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalOption, setModalOption] = useState("");

  const history = useHistory();
  const classes = useStyles();

  const getStockData = async () => {
    await API.get("stock/getStocks")
      .then((stockResponse) => { 
        API.get("/product/getProducts").then(response =>{
              let prs = response.data;
              stockResponse.data.map((stock) => {   
                let pr = prs.find(
                  product => product._id == stock.productId
                );
                stock = {
                  name: pr.name,
                  category: pr.category,
                  quantity: stock.quantity,
                };
                setRows(oldArray => [...oldArray, stock])
              });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = async () => {
    await API.get("product/getProducts")
      .then((response) => {
        setProducts(response.data);
        getStockData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteStock = async (id) => {
    await API.post("stock/removeStock/" + id).then(() => {
      getStockData();
    });
  };

  const createStock = async () => {
    await API.post("stock/createStock", {
      productId: product._id,
      quantity,
    }).then(() => {
      getStockData();
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  useEffect(() => {
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
      <Card variant="outlined">
        <form className={classes.centralize}>
          <h2 className={classes.centralize}>Insira um novo registro no estoque</h2>
          <CardContent>            
            <FormControl className={classes.formControl}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                displayEmpty
                className={classes.selectEmpty}
                value={product._id}
                onChange={(e) => {
                  setProduct(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  <em>Selecione</em>
                </MenuItem>
                {products.map((pr) => (
                   <MenuItem key={pr._id} value={pr._id}>{pr.name}</MenuItem>
                ))}
                {console.log(products)}                
              </Select>
            </FormControl>
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
                        createStock();
                      } else {
                        deleteStock(modalOption);
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
      <h2 className={classes.centralize}>Dados do estoque</h2>
      <TableContainer component={Paper}>
        <Table
          className={classes.table && classes.centralize}
          aria-label="a dense table"
          size="small"
          style={{maxWidth: "50%"}}
          stickyHeader
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
              <StyledTableCell align="right">Categoria</StyledTableCell>
              <StyledTableCell align="right">Quantidade</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">{row.category}</StyledTableCell>
                <StyledTableCell align="right">{row.quantity}</StyledTableCell>
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
                  deleteStock(modalOption);
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
      </TableContainer>
    </>
  );
};

export default Stock;
