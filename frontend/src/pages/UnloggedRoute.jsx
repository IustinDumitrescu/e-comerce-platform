import useUser from "../hooks/useUser";
import { paths } from "../config/routes";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

export default function UnloggedRoute ({children}) {
    const {user, loading } = useUser();

    if (loading) {
        return <LoadingScreen/>
    }

    if (user) {
        return <Navigate to={paths.home} replace />
    }

    return children;
}