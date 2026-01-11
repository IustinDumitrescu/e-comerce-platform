import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

export const QUERY_KEY_MY_PRODUCTS = 'my-products';

export default function useMyProducts({ paginationModel, sortModel, filterModel }) {
  return useQuery({
    queryKey: [
      QUERY_KEY_MY_PRODUCTS,
      paginationModel.page,
      paginationModel.pageSize,
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

      const res = await api.get('/my-products', { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: 'always', // ensures refresh if stale
    retry: false
  });
}
