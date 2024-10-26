import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute ({children}){
    const {token} = useSelector(store => store.auth);
    if(token !== null){
        return children
    } else{
        return <Navigate to="/login"/>
    }
}

export default PrivateRoute;