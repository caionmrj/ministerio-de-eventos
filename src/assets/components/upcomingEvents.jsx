import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import CalendarioAtivado from "../images/CalendarioAtivado.svg";

const UpcomingEvents = () => {
  console.log("UpcomingEvents component mounted");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Busca todos os documentos da coleção "eventos"
        console.log("Buscando eventos...");
        const querySnapshot = await getDocs(collection(db, "eventos"));
        console.log("Quantidade de eventos encontrados:", querySnapshot.size);
        const allEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Dados do evento:", { id: doc.id, ...data });
          return { id: doc.id, ...data };
        });

        // Função auxiliar para converter string de data para objeto Date
        const parseDate = (dateString) => {
          if (!dateString) return null;
          
          console.log("Tentando parsear data:", dateString);
          
          // Tenta diferentes formatos de data
          let parts;
          
          // Tenta formato DD/MM/YYYY
          if (dateString.includes('/')) {
            parts = dateString.split('/');
            if (parts.length === 3) {
              const [day, month, year] = parts.map(Number);
              console.log("Data parseada:", { day, month, year });
              return new Date(year, month - 1, day);
            }
          }
          
          // Tenta formato YYYY-MM-DD
          if (dateString.includes('-')) {
            parts = dateString.split('-');
            if (parts.length === 3) {
              const [year, month, day] = parts.map(Number);
              console.log("Data parseada:", { day, month, year });
              return new Date(year, month - 1, day);
            }
          }
          
          // Se chegou aqui, tenta criar a data diretamente
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date;
          }
          
          console.log("Falha ao parsear data:", dateString);
          return null;
        };
        
        const today = new Date();
        // Zera a hora para comparar apenas a data do evento com a de hoje
        today.setHours(0, 0, 0, 0); 

        // Filtra os eventos que ainda não aconteceram
        console.log("Data de hoje:", today);
        const filteredEvents = allEvents.filter(event => {
            const eventDate = parseDate(event.data);
            console.log("Data do evento:", event.nomeEvento, eventDate);
            // Retorna apenas eventos com data válida e que são iguais ou posteriores à data de hoje
            const isValid = eventDate && eventDate >= today;
            console.log("Evento válido?", event.nomeEvento, isValid);
            return isValid;
        });

        console.log("Eventos filtrados:", filteredEvents);

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
                <p className="text-sm text-[#706382]">
                  {event.data ? event.data.split('-').reverse().join('/') : ''}
                </p>
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