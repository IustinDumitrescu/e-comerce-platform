import { createContext, useState } from "react";

const CartContex = createContext();

export default function CartProvider({children}) {
    const [cartItems, setCart] = useState([]);

    const addCartItem = (item) => {
        const exists = cartItems.find( cartItem => cartItem.id === item.id );

        if (!exists) {
            setCart([...cartItems, {...item, quantity: 1}]);

            return;
        }

        setCart([
            ...cartItems.filter(cartI => cartI.id !== item.id),
            {...exists, quantity: exists.quantity + 1}
        ])
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

         setCart([
            ...cartItems.filter(cartI => cartI.id !== id),
            {...exists, quantity: exists.quantity + 1}
        ])
    };

    const setCartItems = (items) => setCart(items);

    return (
        <CartContex.Provider value={{cartItems, addCartItem, removeCartItem, setCartItems}}>
            {children}
        </CartContex.Provider>
    );
}

export { CartContex };