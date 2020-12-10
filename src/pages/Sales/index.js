import DateFnsUtils from "@date-io/date-fns";
import { Backdrop, Button, Card, CardActions, CardContent, Fade, FormControl, IconButton, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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
	},
}));

const Sales = () => {
	const [open, setOpen] = useState(false);
	const [rows, setRows] = useState([]);
	const [product, setProduct] = useState("");
	const [client, setClient] = useState("");
	const [products, setProducts] = useState([]);
	const [clients, setClients] = useState([]);
	const [quantity, setQuantity] = useState("");
	const [value, setValue] = useState("");
	const [date, setDate] = useState(new Date());
	const [modalTitle, setModalTitle] = useState("");
	const [modalContent, setModalContent] = useState("");
	const [modalOption, setModalOption] = useState("");

	const history = useHistory();
	const classes = useStyles();

	const getSalesData = async () => {
		await API.get("sales/getSales")
			.then((salesResponse) => {
				salesResponse.data.map((sale) => {
					let productName = "";
					let clientName = "";
					API.get("/product/getProduct/" + sale.productId).then((product) => {
						productName = product.data.name;
						API.get("/client/getClient/" + sale.clientId).then((client) => {
							clientName = client.data.name;
							let newSale = {
								clientName,
								productName,
								_id: sale._id,
								date: formatDateTime(sale.date),
								quantity: sale.quantity,
								value: sale.value,
							};
							setRows((oldArray) => [...oldArray, newSale]);
						});
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const formatDateTime = (date) => {
		//2020-12-07T21:02:08.081Z
		let hm = date.split("T")[1].split(":");
		let hour = hm[0]
		let minute = hm[1];
		let dmy = date.split("T")[0].split("-");
		let day = dmy[2];
		let month = dmy[1];
		let year = dmy[0];
		return day + "/" + month + "/" + year + " " + hour + ":" + minute;
	};

	const getProductsInStock = async () => {
		await API.get("product/getProductsStocked/")
			.then((response) => {
				setProducts(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getClients = async () => {
		await API.get("client/getClients")
			.then((response) => {
				setClients(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deleteSale = async (id) => {
		await API.post("/sales/removeSale/" + id).then(() => {
			setRows([]);
			getSalesData();
			getProductsInStock();
		});
	};

	const createSale = async () => {
		await API.get("stock/getStockByProductId/" + product).then((stock) => {
			let newQuantity = stock.data.quantity - quantity;
			if (newQuantity >= 0){
				API.post("sales/createSale/", {
					productId: product,
					clientId: client,
					quantity,
					value,
					date,
				}).then(() => {
					API.post("stock/updateStock/" + stock.data._id, {
						quantity : newQuantity,
					}).then(() => {
						setRows([]);
						getSalesData();
						getProductsInStock();
					});				
				});
			}else{
				let info = "Quantidade em estoque do produto: " + stock.data.quantity + " quantidade que você está tentando vender: " + quantity + " atualize o estoque";
				alert(info);
			}
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
		setModalTitle(
			"Você está prestes a DELETAR um registro de venda, tem certeza?"
		);
		setModalContent("Esta alteração será irreversível");
	};

	const setCreateMsg = () => {
		setModalOption("create");
		setModalTitle("Você está prestes a criar um registro de venda");
		setModalContent("Clique no botão para continuar");
	};

	const handleDateChange = (date) => {
		setDate(date);
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
		getSalesData();
		getProductsInStock();
		getClients();
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
					<h2 className={classes.centralize}>Realizar uma venda</h2>
					<CardContent>
						<FormControl className={classes.textInput}>
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
								<MenuItem key="disabled" disabled>
									Produto
								</MenuItem>
								{products.map((product) => (
									<MenuItem key={product._id} value={product._id}>
										{product.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl className={classes.textInput}>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								displayEmpty
								className={classes.selectEmpty}
								value={client._id}
								onChange={(e) => {
									setClient(e.target.value);
								}}
								variant="outlined"
							>
								<MenuItem key="disabled" disabled>
									Cliente
								</MenuItem>
								{clients.map((client) => (
									<MenuItem key={client._id} value={client._id}>
										{client.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField 
							required
							variant="outlined"
							id="standard-required-name"
							label="Quantidade"
							value={quantity}
							className={classes.textInput}
							onChange={(e) => {
								setQuantity(e.target.value);
							}}
						/>
						<TextField
							required
							variant="outlined"
							id="standard-required-name"
							label="Valor"
							value={value}
							className={classes.textInput}
							onChange={(e) => {
								setValue(e.target.value);
							}}
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
								className={classes.textInput}
								KeyboardButtonProps={{
									"aria-label": "change date",
								}}
							/>
						</MuiPickersUtilsProvider>
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
									<p className={classes.centralize} id="transition-modal-description">
										{modalContent}
									</p>
									<Button
										style={{ marginLeft: "35%" }}
										onClick={() => {
											if (modalOption === "create") {
												createSale();
											} else {
												deleteSale(modalOption);
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
			<h2 className={classes.centralize}>Dados das Vendas</h2>
			<TableContainer component={Paper} className={classes.container}>
				<Table
					className={classes.table && classes.centralize}
					aria-label="a dense sticky table"
					size="small"
					style={{ maxWidth: "50%" }}
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
							<StyledTableCell align="right">Cliente</StyledTableCell>
							<StyledTableCell align="right">Quantidade</StyledTableCell>
							<StyledTableCell align="right">Valor</StyledTableCell>
							<StyledTableCell align="right">Data</StyledTableCell>
							<StyledTableCell align="right"></StyledTableCell>
							<StyledTableCell align="right"></StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<StyledTableRow key={row._id}>
								<StyledTableCell align="right">{row.productName}</StyledTableCell>
								<StyledTableCell align="right">{row.clientName}</StyledTableCell>
								<StyledTableCell align="right">{row.quantity}</StyledTableCell>
								<StyledTableCell align="right">{row.value}</StyledTableCell>
								<StyledTableCell align="right">{row.date}</StyledTableCell>
								<StyledTableCell align="right">
									<IconButton
										color="inherit"
										aria-label="account"
										onClick={() => history.push(`/sales/edit/${row._id}`)}
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

export default Sales;
