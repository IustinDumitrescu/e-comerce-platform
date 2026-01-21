import api from "../config/api";
import { useQuery } from "@tanstack/react-query";

export default function useOrders({type, paginationModel, sortModel, filterModel}) {
    return useQuery({
       queryKey: [
            `orders_` + type, 
            paginationModel, 
            sortModel, 
            filterModel
       ],
       queryFn: async () => {
            const params = {
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
            };

            if (sortModel?.length) {
                params.orderBy = sortModel[0].field;
                params.order = sortModel[0].sort;
            }

            filterModel?.items.forEach(f => {
                if (f.value) {
                params[`filter[${f.columnField}]`] = f.value;
                }
            });

            const res = await api.get('/orders-' + type.toLowerCase(), { params });

            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: 'always',
        retry: false 
    });
}