import { useQuery } from "@tanstack/react-query";
import api from "../config/api";

export default function useCategories () {
    return useQuery({
        queryKey: ['my-products-category'],
        queryFn: async () => {
            const res = await api.get('/categories');
            
            return res.data;
        },
        staleTime: 60 * 60 * 1000, // 1 hour – feels like static config
        cacheTime: 2 * 60 * 60 * 1000, // keep in cache for 2 hours
        refetchOnWindowFocus: false,
    })
}