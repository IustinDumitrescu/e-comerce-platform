import { createContext, useEffect, useState } from "react";
import api from "../config/api";
import useUser from "../hooks/useUser";

const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUser();

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = async (id) => {
    try {
      await api.post('/notifications/read', {id});

      setNotifications(prev =>
        prev.filter(n => (n.id !== id))
      );

      return {type: 'success', message: 'You read the notification with success !'}
    } catch (err) {
      return {type: 'error', message: err.response.data.message || 'Error on request !'}   
    }
  };

  useEffect(() => {
    if (user) {
      api.get(`/notifications`)
        .then((result) => {
          setNotifications(result.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }, [user])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext }
