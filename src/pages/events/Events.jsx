// src/pages/Home.jsx
import MobileLayout from "../../assets/layout/MobileLayout";
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "../../assets/components/Footer";
import BackButton from "../../assets/components/BackButton";
import Calendar from "../../assets/components/calendar";
import UpcomingEvents from "../../assets/components/upcomingEvents";

const Events = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const currentPath = location.pathname;
   return (
<MobileLayout>
   <header className="flex items-center justify-between border-b border-[#F2E8E8] pb-2 w-full px-4">
      <div className="flex-shrink-0">
      <BackButton />
      </div>
  <h1 className="flex-grow text-center text-xl mt-4 mb-4 font-bold text-[#383838]">
    Eventos
  </h1>
  <div className="w-6"></div>
   </header>
   <section>
      <Calendar />
   </section>
   <section>
      <UpcomingEvents />
   </section>
   <div className="flex justify-center mt-20 mb-6">
      <button onClick={() => navigate('/createevent')} className="px-4 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md">
           <span className="">
           Criar evento
           </span>
      </button>
   </div>
  <Footer />
  </MobileLayout>
 );
}
export default Events;