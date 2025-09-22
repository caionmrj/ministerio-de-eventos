// src/assets/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Se não houver usuário, redireciona para a Home E envia uma mensagem no estado da navegação
  if (!user) {
    return (
      <Navigate
        to="/"
        state={{
          message: "Você precisa fazer login para acessar esta página.",
        }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
