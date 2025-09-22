// src/pages/home/Home.jsx
import MobileLayout from "../../assets/layout/MobileLayout";
import Logo from "../../assets/images/Logo.png";
import Login from "../../assets/images/Login.svg";
import Footer from "../../assets/components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  // 1. Puxe a função 'logout' e o 'user' do seu contexto de autenticação
  const { user, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message);

  useEffect(() => {
    if (location.state?.message) {
      const timer = setTimeout(() => {
        setMessage(null);
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/events");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert("Você saiu com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Ocorreu um erro ao tentar sair.");
    }
  };

  return (
    <MobileLayout>
      <header className="bg-[#C9B5E8] flex justify-between items-center p-2">
        {user && (
          <span className="text-purple-900 font-bold ml-2">
            Olá, {user.displayName.split(" ")[0]}!
          </span>
        )}

        {!user ? (
          <button
            onClick={handleLogin}
            className="hover:opacity-80 transition-opacity ml-auto"
          >
            <img src={Login} alt="Login com Google" className="w-14 h-14" />
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-auto bg-[#8967B3] text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        )}
      </header>

      <section>
        <img
          className="w-full pb-6 bg-[#C9B5E8]"
          src={Logo}
          alt="Ministério de eventos"
        />
      </section>

      <main>
        {message && (
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-2 my-4"
            role="alert"
          >
            <p className="font-bold">Aviso</p>
            <p>{message}</p>
          </div>
        )}

        <p className="align-center text-sm mt-4 mb-4 px-2 text-center text-[#383838]">
          Bem-vindo ao nosso sistema de organização interna, contamos com a sua
          ajuda em espalhar a palavra do senhor. Lembrando que o aplicativo está
          em processo de teste, quaisquer problemas por favor relatar a
          administração do ministério.
        </p>

        {user && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/events")}
              className="px-6 py-2 bg-[#8967B3] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Ver Eventos
            </button>
          </div>
        )}
      </main>

      <Footer />
    </MobileLayout>
  );
};
export default Home;
