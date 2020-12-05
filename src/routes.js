import { BrowserRouter, Route, Switch } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Clients from "./pages/Clients";
import EditClient from "./pages/Clients/edit";
import Home from "./pages/Home";
import Products from "./pages/Products";
import EditProduct from "./pages/Products/edit";
import Purchases from "./pages/Purchases";
import EditPurchase from "./pages/Purchases/edit";
import Sales from "./pages/Sales";
import EditSales from "./pages/Sales/edit";
import Stock from "./pages/Stock";
import EditStock from "./pages/Stock/edit";

function Routes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/products" exact component={Products}></Route>
        <Route path="/products/edit/:id" component={EditProduct}></Route>
        <Route path="/sales" exact component={Sales}></Route>
        <Route path="/sales/edit/:id" component={EditSales}></Route>
        <Route path="/purchases" exact component={Purchases}></Route>
        <Route path="/purchases/edit/:id" component={EditPurchase}></Route>
        <Route path="/clients" exact component={Clients}></Route>
        <Route path="/clients/edit/:id" component={EditClient}></Route>
        <Route path="/stock/" exact component={Stock}></Route>
        <Route path="/stock/edit/:id" component={EditStock}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
