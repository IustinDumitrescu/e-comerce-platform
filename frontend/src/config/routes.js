import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyProducts from "../pages/MyProducts";
import Register from "../pages/Register";
import NewProduct from "../pages/NewProduct";
import EditProduct from "../pages/EditProduct";
import Cart from "../pages/Cart";
import ProductListing from "../pages/ProductListing";
import ViewMyProduct from "../pages/ViewMyProduct";
import Product from "../pages/Product";
import Orders from "../pages/Orders";
import OrderBuyer from "../pages/OrderBuyer";
import OrderSeller from "../pages/OrderSeller";

export const LOGGED_AND_UNLOGGED = 'none';

export const UNLOGGED = 'non-logged';

export const LOGGED = 'logged';

export const routes = [
    { name: 'home',  path: '/', component: Home, only: LOGGED_AND_UNLOGGED},
    { name: 'login', path: '/login', component: Login, only: UNLOGGED},
    { name: 'register', path: '/register', component: Register, only: UNLOGGED},
    { name: 'dashboard', path: '/dashboard', component: Dashboard, only: LOGGED },
    { name: 'myProducts', path: '/my-products', component: MyProducts, only: LOGGED},
    { name: 'newProduct', path: '/my-products/new', component: NewProduct, only: LOGGED},
    { name: 'myProduct', path: '/my-products/:id', component: ViewMyProduct, only: LOGGED},
    { name: 'editProduct', path: '/my-products/:id/edit', component: EditProduct, only: LOGGED},
    { name: 'cart', path: '/cart', component: Cart, only: LOGGED_AND_UNLOGGED},
    { name: 'productListing', path: '/products', component: ProductListing, only: LOGGED_AND_UNLOGGED},
    { name: 'product', path: '/products/:id', component: Product, only: LOGGED_AND_UNLOGGED},
    { name: 'buyerOrders', path: '/orders-bought', component: Orders, only: LOGGED, params: {type: 'bought'}},
    { name: 'sellerOrders', path: '/orders-sold', component: Orders, only: LOGGED, params: {type: 'sold'}},
    { name: 'orderBuyer', path: '/orders-bought/:id', component: OrderBuyer, only: LOGGED},
    { name: 'orderSeller', path: '/orders-sold/:id', component: OrderSeller, only: LOGGED}
];

export const paths = (() => {
    const pathItems = {};

    for (const route of routes) {
        pathItems[route.name] = route.path;
    }

    return pathItems;
})();
