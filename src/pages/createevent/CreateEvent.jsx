import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from "../../assets/layout/MobileLayout";
import BackButton from "../../assets/components/BackButton";
import CalendarioAtivado from "../../assets/images/CalendarioAtivado.svg";

// Importa o banco de dados e as funções do Firebase
import { db } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Estados para capturar os dados do formulário
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocal, setEventLocal] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // 2. Função para lidar com o envio e salvar no Firebase
  const handleCreateEvent = async () => {
    // Validação básica para garantir que campos importantes não estão vazios
    if (eventName.trim() === '' || eventDate.trim() === '' || eventLocal.trim() === '') {
      alert("Por favor, preencha o nome, data e local do evento.");
      return;
    }

    // Cria um objeto com os dados do formulário
    const newEvent = {
      nomeEvento: eventName,
      data: eventDate,
      horario: `${eventStart} - ${eventEnd}`,
      local: eventLocal,
      descricao: eventDescription,
      // Adiciona o campo de escala vazio para evitar erros futuros
      escala: {}
    };

    try {
      // Adiciona o documento à coleção 'eventos' e captura a referência (docRef)
      const docRef = await addDoc(collection(db, "eventos"), newEvent);

      console.log("Evento adicionado com sucesso com ID: ", docRef.id);

      // Limpa os campos do formulário após o sucesso
      setEventName('');
      setEventDate('');
      setEventStart('');
      setEventEnd('');
      setEventLocal('');
      setEventDescription('');

      // Agora, navega para a página de detalhes usando o ID do documento recém-criado
      navigate(`/eventDetails/${docRef.id}`);
      
    } catch (e) {
      console.error("Erro ao adicionar evento: ", e);
      alert("Ocorreu um erro ao criar o evento. Verifique a conexão.");
    }
  };

  return (
    <MobileLayout>
      <header className="flex items-center justify-between border-b border-[#F2E8E8] pb-2 w-full px-4">
        <div className="flex-shrink-0">
          <BackButton />
        </div>
        <h1 className="flex-grow text-center text-xl mt-4 mb-4 font-bold text-[#383838]">
          Criar evento
        </h1>
        <div className="w-6"></div>
      </header>
      
      <div>
        <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 py-1 text-[#383838]">
          Nome do evento:
        </h1>
        <input 
          id="eventName" 
          type="text" 
          className="w-full border-b-1 border-[#F2E8E8] rounded-md px-4 py-2 text-[#706382]" 
          placeholder="Digite o nome do evento" 
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>

      <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 py-1 text-[#383838]">
        Data:
      </h1>
      <div className="flex py-2 space-x-40">
        <input 
          id="eventData" 
          type="text" 
          className="w-full border-b-1 border-[#F2E8E8] rounded-md px-4 py-2 text-[#706382]" 
          placeholder="Digite a data" 
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <img className="w-6 mx-8" src={CalendarioAtivado} alt="Eventos" />
      </div>

      <div className="flex px-4 py-2 space-x-10">
        <input 
          id="eventStart" 
          type="text" 
          className="w-40 border-b-1 border-[#F2E8E8] rounded-md px-1 py-2 text-[#706382]" 
          placeholder="Horário de início" 
          value={eventStart}
          onChange={(e) => setEventStart(e.target.value)}
        />
        <input 
          id="eventEnd" 
          type="text" 
          className="w-40 border-b-1 border-[#F2E8E8] rounded-md px-1 py-2 text-[#706382]" 
          placeholder="Horário de término" 
          value={eventEnd}
          onChange={(e) => setEventEnd(e.target.value)}
        />
      </div>

      <div>
        <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 py-1 text-[#383838]">
          Local
        </h1>
        <input 
          id="eventLocal" 
          type="text" 
          className="w-full border-b-1 border-[#F2E8E8] rounded-md px-4 py-2 text-[#706382]" 
          placeholder="Digite o local do evento" 
          value={eventLocal}
          onChange={(e) => setEventLocal(e.target.value)}
        />
      </div>

      <div>
        <h1 className="text-left text-lg mt-4 mb-4 font-bold px-2 pt-20 text-[#383838]">
          Descrição do evento
        </h1>
        <textarea
          id="eventDescription" 
          className="w-full h-32 border-1 border-[#F2E8E8] rounded-md bg-[#e9e9e9] px-4 py-2 text-[#706382] resize-y" 
          placeholder="Faça uma descrição do evento"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        ></textarea>

        <div className="pt-30 justify-center flex py-2 space-x-10">
          <button 
            onClick={handleCreateEvent} 
            className="flex flex-col items-center px-4 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md">
            <span>
              Criar evento
            </span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}

export default CreateEvent;