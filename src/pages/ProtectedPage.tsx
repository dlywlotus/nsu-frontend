import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../Hooks/useAuth"
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
    const { authDetails, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner isLoading={isLoading} />
            </div>
        );
    }

    if (!authDetails) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
}

export default ProtectedPage;