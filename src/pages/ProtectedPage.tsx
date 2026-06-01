import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../Hooks/useAuth"

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
    const { authDetails } = useContext(AuthContext);
    if (!authDetails) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
}

export default ProtectedPage;