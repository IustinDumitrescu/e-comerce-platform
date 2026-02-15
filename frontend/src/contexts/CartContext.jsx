import { createContext, useState } from "react";
import { getStorageCart, setStoredCart } from "../utils/storage";

const CartContex = createContext();

export default function CartProvider({children}) {
    const [cartItems, setCart] = useState(() => getStorageCart());

    const addCartItem = (item) => {
        const exists = cartItems.find( cartItem => cartItem.id === item.id );

        if (!exists) {
            setCart([...cartItems, {...item, quantity: 1}]);

            return;
        }

        const newCart = [
            ...cartItems.filter(cartI => cartI.id !== item.id),
            {...exists, quantity: exists.quantity + 1}
        ].sort((a, b) => a.id - b.id);

        setCart(newCart);

        setStoredCart(newCart);
    };

    const removeCartItem = (id) => {
        const exists = cartItems.find( cartItem => cartItem.id === id );

        if (!exists) {
            return;
        }

        if (exists.quantity < 2) {
            setCartItems([...cartItems.filter(cartI => cartI.id !== id)])

            return;
        }

        const newCart = [
            ...cartItems.filter(cartI => cartI.id !== id),
            {...exists, quantity: exists.quantity - 1}
        ].sort((a, b) => a.id - b.id);
         
        setCart(newCart);

        setStoredCart(newCart);
    };

    const deleteCartItem = (id) => {
        const exists = cartItems.find( cartItem => cartItem.id === id );

        if (!exists) {
            return;
        }

        const newCart = [ ...cartItems.filter(cartI => cartI.id !== id)].sort((a, b) => a.id - b.id);

        setCartItems(newCart);

        setStoredCart(newCart);
    }

    const setCartItems = (items) => {
        setCart(items)

        setStoredCart(items);
    };

    return (
        <CartContex.Provider value={{cartItems, addCartItem, removeCartItem, setCartItems, deleteCartItem}}>
            {children}
        </CartContex.Provider>
    );
}

export { CartContex };