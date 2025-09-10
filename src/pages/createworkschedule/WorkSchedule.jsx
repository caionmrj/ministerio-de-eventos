import MobileLayout from "../../assets/layout/MobileLayout";
import { useNavigate } from 'react-router-dom';
import BackButton from "../../assets/components/BackButton";
import CalendarioAtivado from "../../assets/images/CalendarioAtivado.svg";

const WorkSchedule = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <header className="bg-[#FAFAFA] flex items-center justify-center border-b border-[#F2E8E8] pb-2 w-100%">
        <BackButton/>
        <h1 className="text-xl mt-4 mb-4 text-center px-30 font-bold text-[#383838]">
          Escala
        </h1>
      </header>
    <div>
      <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 py-1 text-[#383838]">
         Função:
      </h1>
      <input id="eventName" type="text" className="w-full  border-b-1 border-[#F2E8E8]  rounded-md px-4 py-2 text-[#706382]" placeholder="O que será realizado?" />
    </div>
      <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 py-1 text-[#383838]">
         Nome do voluntário:
      </h1>
     <input id="eventName" type="text" className="w-full  border-b-1 border-[#F2E8E8]  rounded-md px-4 py-2 text-[#706382]" placeholder="Digite o nome do voluntário" />
     <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 py-1 text-[#383838]">
         Horário:
     </h1>
    <div className="flex px-4 py-2 space-x-10">
      <input id="eventStart" type="text" className="w-40  border-b-1 border-[#F2E8E8]  rounded-md px-1 py-2 text-[#706382]" placeholder="Horário de início" />
      <input id="eventEnd" type="text" className="w-40  border-b-1 border-[#F2E8E8]  rounded-md px-1 py-2 text-[#706382]" placeholder="Horário de término" />
    </div>
    <div>
      <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 pt-50 text-[#383838]">
         o que será realizado:
      </h1>
      <textarea
      className="w-full h-50 border-1 border-[#F2E8E8] rounded-md bg-[#e9e9e9] px-4 py-2 text-[#706382] resize-y"placeholder="Faça uma descrição do evento">
      </textarea>
    <div className="pt-10 justify-center flex py-2">
         <button onClick={() => navigate('/eventDetails')} className="flex flex-col items-center px-4 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md">
           <span className="">
           Criar evento
           </span>
         </button>
    </div>
    </div>
    </MobileLayout>
  );
};

export default WorkSchedule;
