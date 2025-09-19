import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Se ainda estiver carregando, não mostra nada
    if (loading) {
        return null;
    }

    // Se não estiver autenticado, redireciona para a Home
    if (!user) {
        return <Navigate to="/" />;
    }

    // Se estiver autenticado, renderiza o conteúdo da rota
    return children;
};

export default PrivateRoute;