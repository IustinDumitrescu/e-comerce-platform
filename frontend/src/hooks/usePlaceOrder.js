import { useState } from "react";
import api from "../config/api";

export default function usePlaceOrder() {
    const [loading, setLoading] = useState(false);

    const placeOrder = async (cartItems) => {
        setLoading(true);

        try {
            const result = await api.post('/create-order', {products: cartItems});

            setLoading(false);

            return result.data;
        } catch (err) {
           setLoading(false); 

           return {type: 'error', message: err.response.data.message || 'Error on request !'}   
        }
    };

    return {placeOrder, loading}
}