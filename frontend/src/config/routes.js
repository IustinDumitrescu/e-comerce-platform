import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const LOGGED_AND_UNLOGGED = 'none';

export const UNLOGGED = 'non-logged';

export const LOGGED = 'logged';

export const routes = [
    { name: 'home',  path: '/', component: Home, only: LOGGED_AND_UNLOGGED},
    { name: 'login', path: '/login', component: Login, only: UNLOGGED},
    { name: 'register', path: '/register', component: Register, only: LOGGED}
];

export const paths = (() => {
    const pathItems = {};

    for (const route of routes) {
        pathItems[route.name] = route.path;
    }

    return pathItems;
})();
