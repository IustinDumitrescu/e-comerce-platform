import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

export default function useNotifications() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('useUser must be used within an AuthContext')
    }

    return context;
}