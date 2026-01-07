import axiosConfig from '../config/api';
import { useState } from 'react';

export default function useRegister() {
    const [loading, setLoading] = useState(false);

    const register = async (data) => {
        setLoading(true);

        try {
            const response = await axiosConfig.post("/register", data);

            setLoading(false);
        
            return response.data;
        } catch (err) {
            setLoading(false);

            return {type: 'error', message: err.response.data.message || 'Error on request !'}   
        }
    }   

    return {register, loading};
}