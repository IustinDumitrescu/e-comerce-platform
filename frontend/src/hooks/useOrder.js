import { useState } from "react";
import api from "../config/api";

export default function useOrder() {
    const [loading, setLoading] = useState(false);

    const getOrder = async (id, type) => {
        setLoading(true);
        try {
            const result = await api.get(`/orders-${type}/${id}`);

            setLoading(false); 

            return result.data;
        } catch (err) {
            setLoading(false); 

            return {type: 'error', message: err.response.data.message || 'Error on request !'}   
        }
    };

    return {getOrder, loading};
}