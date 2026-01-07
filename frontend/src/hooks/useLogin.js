import { useState } from "react";
import axiosConfig from '../config/api';
import useUser from './useUser'

export default function useLogin() {
    const [loading, setLoading] = useState(false);

    const {login} = useUser();

    const loginUser = async (data) => {
        setLoading(true);

        try {
            const response = await axiosConfig.post("/login", data);

            setLoading(false);

            login(response.data);
        
            return response.data;
        } catch (err) {
            setLoading(false);

            return {type: 'error', message: err.response.data.message || 'Error on request !'}   
        }
    };

    return {loginUser, loading}
}