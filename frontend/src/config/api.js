import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-Frontend-Token": import.meta.env.VITE_FRONTEND_TOKEN,
    }
})

export default api;