import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";


export const RequiresAuth = ({children}) => {
    const {userState:{isUserLoggedIn}} = useUser();
    let location = useLocation();
    return isUserLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace={true} />;
}