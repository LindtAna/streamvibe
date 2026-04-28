import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";


//beschränkt den Zugriff auf Admin-Bereiche 
const RequireAdmin = () => {
    const { auth } = useAuth();
    const location = useLocation();

    // Wenn 'ADMIN' -> die Kind-Elemente via <Outlet /> gerendert.
    // Ansonsten -> Umleitung zur Login-Seite
    return (
        auth?.role === "ADMIN" 
            ? <Outlet /> 
            : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAdmin;