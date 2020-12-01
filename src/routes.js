import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Clients from "./pages/Clients";
import EditClient from "./pages/Clients/edit";
import Stock from "./pages/Stock";

function Routes() {
    return (
        <BrowserRouter>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/products" component={Products}></Route>
                <Route path="/sales" component={Sales}></Route>
                <Route path="/purchases" component={Purchases}></Route>
                <Route path="/clients" exact component={Clients}></Route>
                <Route path="/clients/edit/:id" component={EditClient}></Route>
                <Route path="/stock" component={Stock}></Route>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
