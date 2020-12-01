import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  TextField,
} from "@material-ui/core";
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

const EditStock = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStockData = async () => {
    await API.get("stock/getStock/" + id)
      .then((response) => {
        getProduct(response.data.productId);
        setQuantity(response.data.quantity);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getProduct = async () => {
    await API.get("product/getProduct" + id)
      .then((response) => {
        setName(response.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateStock = async () => {
    await API.post("product/updateProduct/" + id, {
      quantity,
    })
      .then((response) => {
        setQuantity(response.data.quantity);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const classes = useStyles();

  useEffect(() => {
    getStockData();
  }, []);

  return (
    <div>
      <Card variant="outlined">
        <form className={classes.centralize}>
          <CardContent>
            <h1 className={classes.centralize}>Editar o Produto {name}</h1>
            <br />
            <TextField
              required
              variant="outlined"
              id="standard-required-name"
              label="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              disabled
            />
            <TextField
              required
              variant="outlined"
              id="standard-required-category"
              label="Categoria"
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
                updateStock();
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
                    Produto atualizado com sucesso!
                  </h2>
                  <p
                    className={classes.centralize}
                    id="transition-modal-description"
                  >
                    {name} foi atualizado
                  </p>
                </div>
              </Fade>
            </Modal>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default EditStock;
