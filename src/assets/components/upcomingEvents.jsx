import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import CalendarioAtivado from "../images/CalendarioAtivado.svg";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(collection(db, "eventos"));
        const allEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Função para converter a data string (YYYY-MM-DD) para um objeto Date
        const parseDate = (dateString) => {
          if (!dateString) return null;
          // Adiciona T00:00:00 para garantir que a data seja interpretada no fuso horário local
          // e não como UTC, evitando erros de "um dia a menos".
          return new Date(dateString + "T00:00:00");
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera o horário para comparar apenas as datas

        // Filtra para pegar apenas os eventos futuros ou de hoje
        const filteredEvents = allEvents.filter((event) => {
          const eventDate = parseDate(event.data);
          return eventDate && eventDate >= today;
        });

        // Ordena os eventos filtrados por data, do mais próximo para o mais distante
        const sortedEvents = filteredEvents.sort((a, b) => {
          const dateA = parseDate(a.data);
          const dateB = parseDate(b.data);
          return dateA.getTime() - dateB.getTime();
        });

        // Pega apenas os 3 primeiros eventos da lista ordenada
        const limitedEvents = sortedEvents.slice(0, 3);
        setEvents(limitedEvents);
      } catch (e) {
        console.error("Erro ao buscar eventos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-[#706382] mt-8">Carregando eventos...</p>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-left text-lg font-bold text-[#383838] px-4">
        Próximos eventos
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-[#706382] px-4 py-4">
          Nenhum evento futuro cadastrado.
        </p>
      ) : (
        <div>
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between border-b border-[#F2E8E8] py-4 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/eventDetails/${event.id}`)}
            >
              <div className="flex items-center space-x-4">
                <img
                  className="w-6 h-6"
                  src={CalendarioAtivado}
                  alt="Ícone de evento"
                />
                <div>
                  <p className="font-bold text-[#383838]">{event.nomeEvento}</p>
                  <p className="text-sm text-[#706382]">
                    {event.data
                      ? event.data.split("-").reverse().join("/")
                      : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#8967B3]">
                Ver detalhes
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Botão para ver todos os eventos */}
      <div className="px-4 mt-6">
        <button
          onClick={() => navigate("/allevents")}
          className="w-full px-6 py-3 bg-[#F2E8E8] text-[#8967B3] font-bold rounded-md hover:bg-[#e8dbe8] transition-colors"
        >
          Ver todos os eventos do ano
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
