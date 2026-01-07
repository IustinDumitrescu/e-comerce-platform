import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useUser() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useUser must be used within an AuthContext')
    }

    return context;
}