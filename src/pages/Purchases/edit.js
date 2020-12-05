import { Button, Card, CardActions, CardContent, makeStyles, TextField } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

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
}));

const EditPurchase = () => {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getPurchaseData = async () => {
    await API.get("purchase/getPurchase/" + id)
      .then((response) => {
        getProduct(response.data._id);
        setSupplier(response.data.supplier);
        setDate(response.data.date);
        setValue(response.data.value);
        setQuantity(response.data.quantity);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getProduct = async (id) => {
    await API.get("product/getProduct/" + id)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const updatePurchase = async () => {
    console.log("here");
    await API.post("client/updateClient/" + id, {
      supplier,
      date,
      value,
      quantity,
    })
      .then((response) => {
        setSupplier(response.data.supplier);
        setDate(response.data.date);
        setValue(response.data.value);
        setQuantity(response.data.quantity);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const classes = useStyles();

  useEffect(() => {
    getPurchaseData();
  }, []);

  return (
    <div>
      <br></br>
      <Card variant="outlined">
        <form className={classes.centralize}>
          <CardContent>
            <h1 className={classes.centralize}>Editar a compra</h1>
            <br />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Produto"
              value={product.name}
              disabled
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-cpf"
              label="Fornecedor"
              value={supplier}
              onChange={(e) => {
                setSupplier(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-birth-date"
              label="Data"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-address"
              label="Preço R$"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-number"
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
                handleOpen();
                updatePurchase();
              }}
              variant="outlined"
              color="primary"
            >
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
              }}
            >
              <Fade in={open}>
                <div className={classes.paper}>
                  <h2 id="transition-modal-title">
                    Compra atualizada com sucesso!
                  </h2>
                </div>
              </Fade>
            </Modal>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default EditPurchase;
