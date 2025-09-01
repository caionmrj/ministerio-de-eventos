import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import CalendarioAtivado from "../images/CalendarioAtivado.svg";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Busca todos os documentos da coleção "eventos"
        const querySnapshot = await getDocs(collection(db, "eventos"));
        const allEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Função auxiliar para converter a string 'DD/MM/YYYY' para um objeto Date
        const parseDate = (dateString) => {
          if (!dateString) return null;
          const [day, month, year] = dateString.split('/').map(Number);
          // O objeto Date() usa o formato (ano, mês-1, dia)
          return new Date(year, month - 1, day);
        };
        
        const today = new Date();
        // Zera a hora para comparar apenas a data do evento com a de hoje
        today.setHours(0, 0, 0, 0); 

        // Filtra os eventos que ainda não aconteceram
        const filteredEvents = allEvents.filter(event => {
            const eventDate = parseDate(event.data);
            // Retorna apenas eventos com data válida e que são iguais ou posteriores à data de hoje
            return eventDate && eventDate >= today;
        });

        // Ordena os eventos por data, do mais próximo para o mais distante
        const sortedEvents = filteredEvents.sort((a, b) => {
            const dateA = parseDate(a.data);
            const dateB = parseDate(b.data);
            // Compara os timestamps (milissegundos) para uma ordenação precisa
            return dateA.getTime() - dateB.getTime();
        });

        // Limita o número de eventos exibidos para 3
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
    return <p className="text-center text-[#706382]">Carregando eventos...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-[#706382]">Nenhum evento futuro encontrado.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-left text-lg font-bold text-[#383838] px-4">Próximos eventos</h2>
      <div>
        {events.map(event => (
          <div 
            key={event.id} 
            className="flex items-center justify-between border-b border-[#F2E8E8] py-4 px-4 cursor-pointer"
            onClick={() => navigate(`/eventDetails/${event.id}`)}
          >
            <div className="flex items-center space-x-4">
              <img className="w-6 h-6" src={CalendarioAtivado} alt="Ícone de evento" />
              <div>
                <p className="font-bold text-[#383838]">{event.nomeEvento}</p>
                <p className="text-sm text-[#706382]">{event.data}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-[#8967B3]">Ver detalhes</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;