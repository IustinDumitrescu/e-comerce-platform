import { useContext } from "react";
import { CartContex } from "../contexts/CartContext";

export default function useCart() {
    const context = useContext(CartContex);

    if (!context) {
        throw new Error('useUser must be used within an AuthContext')
    }

    return context;
}