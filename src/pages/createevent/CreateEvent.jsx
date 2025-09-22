// src/pages/createevent/CreateEvent.jsx
import React, { useState, useEffect } from "react";
import MobileLayout from "../../assets/layout/MobileLayout";
import BackButton from "../../assets/components/BackButton";
import Footer from "../../assets/components/Footer";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // 1. Use o hook useLocation para acessar o estado da navegação
  const location = useLocation();

  // 2. Tente obter a data pré-selecionada do estado da localização
  const preSelectedDate = location.state?.selectedDate || "";

  // 3. Defina o estado inicial da data com o valor recebido
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(preSelectedDate);
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLocal, setEventLocal] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        const eventRef = doc(db, "eventos", id);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const data = eventSnap.data();
          setEventName(data.nomeEvento);
          setEventDate(data.data);
          const [start, end] = data.horario.split(" - ");
          setEventStart(start);
          setEventEnd(end);
          setEventLocal(data.local);
          setEventDescription(data.descricao);
        } else {
          console.log("Nenhum evento encontrado para edição!");
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const newEvent = {
      nomeEvento: eventName,
      data: eventDate,
      horario: `${eventStart} - ${eventEnd}`,
      local: eventLocal,
      descricao: eventDescription,
    };

    try {
      if (id) {
        const eventRef = doc(db, "eventos", id);
        await updateDoc(eventRef, newEvent);
        alert("Evento atualizado com sucesso!");
        navigate(`/eventdetails/${id}`);
      } else {
        // Cria o ID baseado no nome do evento e data para evitar duplicados simples
        const newId = `${eventName.replace(/\s+/g, "-")}-${eventDate}`;
        const eventRef = doc(db, "eventos", newId);
        await setDoc(eventRef, newEvent);
        alert("Evento criado com sucesso!");
        navigate(`/eventdetails/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao salvar o evento: ", error);
      alert("Erro ao salvar o evento. Tente novamente.");
    }
  };

  return (
    <MobileLayout>
      <header className="flex items-center justify-between border-b border-[#F2E8E8] pb-2 w-full px-4">
        <div className="flex-shrink-0">
          <BackButton />
        </div>
        <h1 className="flex-grow text-center text-xl mt-4 mb-4 font-bold text-[#383838]">
          {id ? "Editar Evento" : "Criar Evento"}
        </h1>
        <div className="w-6 h-6"></div> {/* Espaçador para alinhar título */}
      </header>

      <form onSubmit={handleCreateEvent} className="p-4 space-y-4">
        <label className="block">
          <span className="text-gray-700">Nome do Evento</span>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Data</span>
          {/* O valor do input de data já está conectado ao estado `eventDate` */}
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </label>
        <div className="flex justify-between space-x-4">
          <label className="block w-1/2">
            <span className="text-gray-700">Início</span>
            <input
              type="time"
              value={eventStart}
              onChange={(e) => setEventStart(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>
          <label className="block w-1/2">
            <span className="text-gray-700">Fim</span>
            <input
              type="time"
              value={eventEnd}
              onChange={(e) => setEventEnd(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>
        </div>
        <label className="block">
          <span className="text-gray-700">Local</span>
          <input
            type="text"
            value={eventLocal}
            onChange={(e) => setEventLocal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Descrição</span>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows="4"
          ></textarea>
        </label>
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#8967B3] text-white rounded-md font-bold"
          >
            {id ? "Salvar Alterações" : "Criar Evento"}
          </button>
        </div>
      </form>
      <Footer />
    </MobileLayout>
  );
};

export default CreateEvent;
