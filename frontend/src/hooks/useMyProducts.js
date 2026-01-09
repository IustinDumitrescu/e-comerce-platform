import { useQuery } from '@tanstack/react-query';
import api from '../config/api'

export default function useMyProducts({
        paginationModel,
        sortModel, 
        filterModel 
    }) {
        return useQuery({
            queryKey: ['my-products', paginationModel, sortModel, filterModel],
            queryFn: async () => {
                const params = {
                    page: paginationModel.page + 1,
                    limit: paginationModel.pageSize,
                };

                if (sortModel.length > 0) {
                    params.orderBy = sortModel[0].field;
                    params.order = sortModel[0].sort;
                }

                filterModel.items.forEach(f => {
                    if (f.value) {
                        params[`filter[${f.columnField}]`] = f.value;
                    }
                });

                const res = await api.get('/my-products', { params });

                return res.data;
            },
            staleTime: 5 * 60 * 1000,        // 5 minutes "fresh"
            refetchOnWindowFocus: false,     // stop refetching on tab focus
            refetchOnReconnect: true,        // OK when offline→online
            refetchOnMount: false,           // do not refetch when remounting
            retry: false                     // optional, avoid silent retries
        });
}