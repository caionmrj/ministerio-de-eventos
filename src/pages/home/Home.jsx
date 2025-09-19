// src/pages/Home.jsx
import MobileLayout from "../../assets/layout/MobileLayout";
import Logo from "../../assets/images/Logo.png";
import Login from "../../assets/images/Login.svg";
import Footer from "../../assets/components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
   const { user, signInWithGoogle } = useAuth();
   const navigate = useNavigate();

   const handleLogin = async () => {
     try {
       await signInWithGoogle();
       // Após o login bem-sucedido, redireciona para a página de eventos
       navigate("/events");
     } catch (error) {
       console.error("Erro ao fazer login:", error);
       alert("Erro ao fazer login. Tente novamente.");
     }
   };

   return (
<MobileLayout>
 <header className='bg-[#C9B5E8] flex justify-end p-2'>
  <button 
    onClick={handleLogin}
    className="hover:opacity-80 transition-opacity"
  >
    <img src={Login} alt="Login com Google" className="w-14 h-14" />
  </button>
 </header>
 <section>
  <img className="w-full pb-6 bg-[#C9B5E8]" src={Logo} alt="Ministério de eventos" />
 </section>
   <main>
     <p className="align-center text-sm mt-4 mb-4 px-2 text-center text-[#383838]">
     Bem-vindo ao nosso sistema de organização interna, contamos com a sua ajuda em espalhar a palavra do senhor.
     Lembrando que o aplicativo está em processo de teste, quaisquer problemas por favor relatar a administração do ministério.
     </p>
     {user && (
       <div className="text-center mt-4">
         <button
           onClick={() => navigate('/events')}
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
}
export default Home;