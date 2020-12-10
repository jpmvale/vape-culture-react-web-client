import DateFnsUtils from "@date-io/date-fns";
import { Button, Card, CardActions, CardContent, makeStyles, TextField } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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

const EditSale = () => {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [client, setClient] = useState("");
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getSaleData = async () => {
    await API.get("sales/getSale/" + id)
      .then((response) => {
        getProduct(response.data.productId);
        getClient(response.data.clientId);
        setDate(response.data.date);
        setValue(response.data.value);
        setQuantity(response.data.quantity);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getClient = async (id) => {
    await API.get("client/getClient/" + id)
      .then((response) => {
        setClient(response.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProduct = async (id) => {
    await API.get("product/getProduct/" + id)
      .then((response) => {
        setProduct(response.data.name);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleDateChange = (date) => {
      setDate(date);
  }

  const updateSale = async () => {
    console.log("here");
    await API.post("sales/updateSale/" + id, {
      date,
      value,
      quantity,
    })
      .then((response) => {
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
    getSaleData();
  }, []);

  return (
    <div>
      <br></br>
      <Card variant="outlined">
        <form className={classes.centralize}>
          <CardContent>
            <h1 className={classes.centralize}>Editar dados da venda</h1>
            <br />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Produto"
              value={product}
              disabled
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Cliente"
              value={client}
              disabled
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    variant="inline"
                    inputVariant="outlined"
                    id="date-picker-dialog"
                    label="Data da Venda"
                    format="dd/MM/yyyy"
                    value={date}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        "aria-label": "change date",
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
                updateSale();
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
                    Venda atualizada com sucesso!
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

export default EditSale;
