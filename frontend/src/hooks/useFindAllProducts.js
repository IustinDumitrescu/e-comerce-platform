import { useState } from "react";
import api from "../config/api";

export default function useFindAllProducts() {
  const [loading, setLoading] = useState(false);

  const getProducts = async (params) => {
    setLoading(true);
    try {
      const result = await api.get('/products', { params }); // assume response.data.products exists
      setLoading(false);

      return { success: true, products: result.data };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Error on request!',
        products: [],
      };
    }
  };

  return { getProducts, loading };
}