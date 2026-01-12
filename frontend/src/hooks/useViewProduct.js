import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEY_MY_PRODUCTS } from "./useMyProducts";
import api from "../config/api";

export default function useViewProduct() {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const getProduct = async (id) => {
        setLoading(true);
        try {
            const cachedList = queryClient.getQueryData([QUERY_KEY_MY_PRODUCTS]);
            const cachedProduct = cachedList?.items?.find(p => p.id === Number(id));

            if (cachedProduct) return cachedProduct;

            const result = await api.get('/products/product-' + id);
            return result.data;
        } catch {
            return { type: 'error' };
        } finally {
            setLoading(false);
        }
    };
    
    return { getProduct, loading };
}