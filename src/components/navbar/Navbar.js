import GlobalStyle from "../../styles/global";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import { Link } from 'react-router-dom';
import Logo from "../../assets/logo.jpg";

function NavBar() {

    return (
        <>
            <GlobalStyle />
            <AppBar position="static" style={{ background: "#000", height: 100, justifyContent: "center" }}>
                <Toolbar>
                    <img
                        src={Logo}
                        alt=""
                        height={1280 / 13}
                        width={1085 / 9}
                        className="img-responsive"
                    />
                    <Link to="/products" style={{ color: '#FFF' }}>
                        <Button color="inherit">
                            Produtos
                        </Button>
                    </Link>
                    <Link to="/clients" style={{ color: '#FFF' }}>
                        <Button color="inherit" >
                            Clientes
                        </Button>
                    </Link>
                    <Link to="/stock" style={{ color: '#FFF' }}>
                        <Button color="inherit" >
                            Estoque
                        </Button>
                    </Link>
                    <Link to="/sales" style={{ color: '#FFF' }}>
                        <Button color="inherit" >
                            Vendas
                        </Button>
                    </Link>
                    <Link to="/purchases" style={{ color: '#FFF' }}>
                        <Button color="inherit" >
                            Compras
                        </Button>
                    </Link>
                    <Link to="/" style={{ color: '#FFF' }}>
                        <Button color="inherit" >
                            Relatórios
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default NavBar;
