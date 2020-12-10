import DateFnsUtils from '@date-io/date-fns';
import { Button, Card, CardActions, CardContent, makeStyles, TextField } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
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
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
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
        getProduct(response.data.productId);
        setSupplier(response.data.supplier);
        setPurchaseDate(response.data.date);
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
        setName(response.data.name);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const updatePurchase = async () => {
    await API.post("purchase/updatePurchase/" + id, {
      supplier,
      purchaseDate,
      value,
      quantity,
    })
      .then((response) => {
        setSupplier(response.data.supplier);
        setPurchaseDate(response.data.date);
        setValue(response.data.value);
        setQuantity(response.data.quantity);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleDateChange = (date) => {
    setPurchaseDate(date);
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
              value={name}
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                inputVariant="outlined"
                id="date-picker-dialog"
                label="Date picker dialog"
                format="dd/MM/yyyy"
                value={setPurchaseDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                />
            </MuiPickersUtilsProvider>
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
