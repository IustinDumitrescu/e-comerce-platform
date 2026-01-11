import { useState } from "react";
import api from "../config/api";
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY_MY_PRODUCTS } from './useMyProducts'

export default function useNewProduct() {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const createNewProduct = async (query) => {
        setLoading(true);

        const formData = new FormData();
        
        formData.append("image", query.image);        
        formData.append("name", query.title);
        formData.append("price", query.price);
        formData.append("categoryId", query.categoryId);
        formData.append("description", query.description);
        
        try {
            const result = await api.post('/my-products/new', formData, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                }
            );

            setLoading(false)

            queryClient.invalidateQueries([QUERY_KEY_MY_PRODUCTS]);

            return result.data;
        } catch (err) {
            setLoading(false);

            return {type: 'error', message: err.response.data.message || 'Error on request !'}   
        }
    };

    return {createNewProduct, loading}
}