import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyProducts from "../pages/MyProducts";
import Register from "../pages/Register";
import NewProduct from "../pages/NewProduct";
import ViewProduct from "../pages/ViewProduct";
import EditProduct from "../pages/EditProduct";

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
    { name: 'viewProduct', path: '/my-products/:id', component: ViewProduct, only: LOGGED},
    { name: 'editProduct', path: '/my-products/:id/edit', component: EditProduct, only: LOGGED}
];

export const paths = (() => {
    const pathItems = {};

    for (const route of routes) {
        pathItems[route.name] = route.path;
    }

    return pathItems;
})();
