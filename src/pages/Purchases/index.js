import DateFnsUtils from "@date-io/date-fns";
import { Backdrop, Button, Card, CardActions, CardContent, Fade, FormControl, IconButton, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
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
	selectEmpty: {
		marginTop: theme.spacing(0),
	},
	container: {
		maxHeight: 450,
		maxWidth: 1200,
		marginLeft: "auto",
		marginRight: "auto",
	},
}));

const Products = () => {
	const [open, setOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalContent, setModalContent] = useState("");
	const [modalOption, setModalOption] = useState("");
	const [rows, setRows] = useState([]);
	const [arrivedRows, setArrivedRows] = useState([]);
	const [product, setProduct] = useState("");
	const [products, setProducts] = useState([]);
	const [supplier, setSupplier] = useState("");
	const [purchaseDate, setPurchaseDate] = useState(new Date());
	const [expectedDate, setExpectedDate] = useState(new Date());
	const [value, setValue] = useState("");
	const [quantity, setQuantity] = useState("");
	const history = useHistory();

	const classes = useStyles();

	const getPurchaseData = async () => {
		await API.get("purchase/getPurchases")
			.then((purchaseResponse) => {
				API.get("product/getProducts")
					.then((response) => {
						let prs = response.data;
						purchaseResponse.data.map((purchase) => {
							let pr = prs.find((product) => product._id === purchase.productId);
							let newPurchase = {
								_id: purchase._id,
								name: pr.name,
								quantity: purchase.quantity,
								purchaseDate: formatDateTime(purchase.purchaseDate),
								expectedDate: formatDateTime(purchase.expectedDate),
								supplier: purchase.supplier,
								value: purchase.value,
								productId: purchase.productId,
							};
							if (!purchase.arriveDate) {
								setRows((oldArray) => [...oldArray, newPurchase]);
							} else {
								newPurchase.arriveDate = formatDateTime(purchase.arriveDate);
								setArrivedRows((oldArray) => [...oldArray, newPurchase]);
							}
						});
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err.response);
			});
	};

	const getProducts = async () => {
		await API.get("product/getProducts")
			.then((response) => {
				setProducts(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const formatDateTime = (date) => {
		//2020-12-07T21:02:08.081Z
		date = date.split("T")[0].split("-");
		let day = date[2];
		let month = date[1];
		let year = date[0];
		return day + "/" + month + "/" + year;
	};

	const createPurchase = async () => {
		await API.post("purchase/createPurchase", {
			supplier,
			purchaseDate,
			expectedDate,
			value,
			quantity,
			productId: product,
		}).then(() => {
			setRows([]);
			setArrivedRows([]);
			getPurchaseData();
		});
	};

	const deletePurchase = async (id) => {
		await API.post("purchase/removePurchase/" + id).then(() => {
			setRows([]);
			setArrivedRows([]);
			getPurchaseData();
		});
	};

	const confirmPurchase = async (id, productId, quantity) => {
		await API.post("purchase/updatePurchase/" + id, {
			arriveDate: new Date(),
		}).then((response) => {
			setRows([]);
			setArrivedRows([]);
			API.get("/stock/getStockByProductId/" + productId)
				.then((response) => {
					let stock = response.data;
					console.log(stock);
					if (stock) {
						updateStockQuantity(
							stock._id,
							parseInt(stock.quantity) + parseInt(quantity)
						);
					} else {
						createStock(productId, quantity);
					}
					getPurchaseData();
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};

	const createStock = async (productId, quantity) => {
		await API.post("stock/createStock", {
			productId,
			quantity,
		})
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const updateStockQuantity = async (id, quantity) => {
		await API.post("stock/updateStock/" + id, {
			quantity,
		})
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const clearInputs = () => {
		setSupplier("");
		setPurchaseDate(new Date());
		setExpectedDate(new Date());
		setQuantity("");
		setValue("");
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

	const setConfirmMsg = (id, productId, quantity) => {
		setModalOption("c " + id + " " + productId + " " + quantity);
		setModalTitle(
			"Você está prestes a confirmar o recebimento de um pedido, tem certeza?"
		);
		setModalContent("Clique pra continuar");
	};

	const setDeleteMsg = (id) => {
		setModalOption("d " + id);
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

	const handlePurchaseDateChange = (date) => {
		setPurchaseDate(date);
	};

	const handleExpectedDateChange = (date) => {
		setExpectedDate(date);
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
								{products.map((pr) => (
									<MenuItem key={pr._id} value={pr._id}>
										{pr.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							required
							variant="outlined"
							id="standard-required-name"
							label="Fornecedor"
							value={supplier}
							className={classes.textInput}
							onChange={(e) => {
								setSupplier(e.target.value);
							}}
						/>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								variant="inline"
								inputVariant="outlined"
								id="date-picker-dialog"
								label="Date de Compra"
								format="dd/MM/yyyy"
								className={classes.textInput}
								value={purchaseDate}
								onChange={handlePurchaseDateChange}
								KeyboardButtonProps={{
									"aria-label": "change date",
								}}
							/>
							<KeyboardDatePicker
								variant="inline"
								inputVariant="outlined"
								id="date-picker-dialog"
								label="Data Prevista de Entrega"
								className={classes.textInput}
								format="dd/MM/yyyy"
								value={expectedDate}
								onChange={handleExpectedDateChange}
								KeyboardButtonProps={{
									"aria-label": "change date",
								}}
							/>
						</MuiPickersUtilsProvider>
						<TextField
							required
							variant="outlined"
							id="standard-required-name"
							className={classes.textInput}
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
							className={classes.textInput}
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
									<p className={classes.centralize} id="transition-modal-description">
										{modalContent}
									</p>
									<Button
										style={{ marginLeft: "35%" }}
										onClick={() => {
											if (modalOption === "create") {
												createPurchase();
											} else if (modalOption.split(" ")[0] === "c") {
												confirmPurchase(
													modalOption.split(" ")[1],
													modalOption.split(" ")[2],
													modalOption.split(" ")[3]
												);
											} else {
												deletePurchase(modalOption.split(" ")[1]);
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
			<h2 className={classes.centralize}>Pedidos de Compra a receber</h2>
			{rows.length > 0 ? (
				<TableContainer component={Paper} className={classes.container}>
					<Table
						className={classes.table && classes.centralize}
						aria-label="a dense sticky table"
						size="small"
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
								<StyledTableCell
									align="right"
									onClick={() => {
										sortTable("value");
									}}
								>
									Fornecedor
								</StyledTableCell>
								<StyledTableCell align="right">Data de Compra</StyledTableCell>
								<StyledTableCell align="right">Data Prevista</StyledTableCell>
								<StyledTableCell align="right">Preço R$</StyledTableCell>
								<StyledTableCell align="right">Quantidade</StyledTableCell>
								<StyledTableCell align="right">Recebimento</StyledTableCell>
								<StyledTableCell align="right">Editar</StyledTableCell>
								<StyledTableCell align="right">Deletar</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<StyledTableRow key={row._id}>
									<StyledTableCell align="right">{row.name}</StyledTableCell>
									<StyledTableCell align="right">{row.supplier}</StyledTableCell>
									<StyledTableCell align="right">{row.purchaseDate}</StyledTableCell>
									<StyledTableCell align="right">{row.expectedDate}</StyledTableCell>
									<StyledTableCell align="right">{row.value}</StyledTableCell>
									<StyledTableCell align="right">{row.quantity}</StyledTableCell>
									<StyledTableCell align="right">
										<IconButton
											color="inherit"
											aria-label="account"
											onClick={() => {
												setConfirmMsg(row._id, row.productId, row.quantity);
												handleOpen();
											}}
										>
											<DoneIcon />
										</IconButton>
									</StyledTableCell>
									<StyledTableCell align="right">
										<IconButton
											color="inherit"
											aria-label="account"
											onClick={() => {
												history.push(`/purchases/edit/${row._id}`);
											}}
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
			) : (
				<h3 className={classes.centralize} style={{ margin: 25 }}>
					Nenhum pedido a receber
				</h3>
			)}
			<h2 className={classes.centralize}>Pedidos recebidos</h2>
			<TableContainer component={Paper} className={classes.container}>
				<Table
					className={classes.table && classes.centralize}
					aria-label="a dense table sticky"
					size="small"
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
							<StyledTableCell
								align="right"
								onClick={() => {
									sortTable("value");
								}}
							>
								Fornecedor
							</StyledTableCell>
							<StyledTableCell align="right">Data de Compra</StyledTableCell>
							<StyledTableCell align="right">Data Prevista</StyledTableCell>
							<StyledTableCell align="right">Data de Recebimento</StyledTableCell>
							<StyledTableCell align="right">Preço R$</StyledTableCell>
							<StyledTableCell align="right">Quantidade</StyledTableCell>
							<StyledTableCell align="right">Editar</StyledTableCell>
							<StyledTableCell align="right">Deletar</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{arrivedRows.map((row) => (
							<StyledTableRow key={row._id}>
								<StyledTableCell align="right">{row.name}</StyledTableCell>
								<StyledTableCell align="right">{row.supplier}</StyledTableCell>
								<StyledTableCell align="right">{row.purchaseDate}</StyledTableCell>
								<StyledTableCell align="right">{row.expectedDate}</StyledTableCell>
								<StyledTableCell align="right">{row.arriveDate}</StyledTableCell>
								<StyledTableCell align="right">{row.value}</StyledTableCell>
								<StyledTableCell align="right">{row.quantity}</StyledTableCell>
								<StyledTableCell align="right">
									<IconButton
										color="inherit"
										aria-label="account"
										onClick={() => {
											history.push(`/purchases/edit/${row._id}`);
										}}
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
