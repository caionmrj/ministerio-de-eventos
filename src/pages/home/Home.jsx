// src/pages/Home.jsx
import MobileLayout from "../../assets/layout/MobileLayout";
import Logo from "../../assets/images/Logo.png"; // 1. Ajuste o nome do arquivo, se necessário
import Login from "../../assets/images/Login.svg"; // 2. Ajuste o nome do arquivo, se necessário
import Footer from "../../assets/components/Footer"; // 3. Ajuste o caminho do componente NavBar, se necessário

const Home = () => {
   return (
<MobileLayout>
 <header className=' bg-[#C9B5E8]'>
  <img className="justify-self-end" src={Login} alt="Login" />
 </header>
 <section>
  <img className="w-full pb-6 bg-[#C9B5E8] " src={Logo} alt="Ministério de eventos" />
 </section>
   <main>
     <p className="align-center text-sm mt-4 mb-4 px-2 text-center text-[#383838]">
     Bem-vindo ao nosso sistema de organização interna, contamos com a sua ajuda em espalhar a palavra do senhor.
     Lembrando que o aplicativo está em processo de teste, quaisquer problemas por favor relatar a administração do ministério.
     </p>
   </main>
  <Footer />
  </MobileLayout>
 );
}
export default Home;