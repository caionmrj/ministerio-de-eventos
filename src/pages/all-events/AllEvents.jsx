import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import MobileLayout from "../../assets/layout/MobileLayout";
import BackButton from "../../assets/components/BackButton";
import Footer from "../../assets/components/Footer";

const AllEvents = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndGroupEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "eventos"),
          orderBy("data", "asc")
        );
        const querySnapshot = await getDocs(eventsQuery);

        const allEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Log para depuração: veja o que o Firebase está retornando
        console.log("Eventos recebidos do Firebase:", allEvents);

        const groups = allEvents.reduce((acc, event) => {
          // Pula eventos que não têm uma data válida
          if (!event.data || typeof event.data !== "string") {
            return acc;
          }

          const eventDate = new Date(event.data + "T00:00:00");

          // **CORREÇÃO PRINCIPAL**: Verifica se a data é válida antes de continuar
          if (isNaN(eventDate.getTime())) {
            console.warn("Evento com data inválida foi ignorado:", event);
            return acc;
          }

          const groupKey = eventDate.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          });

          const capitalizedKey =
            groupKey.charAt(0).toUpperCase() + groupKey.slice(1);

          if (!acc[capitalizedKey]) {
            acc[capitalizedKey] = [];
          }
          acc[capitalizedKey].push(event);
          return acc;
        }, {});

        setGroupedEvents(groups);
      } catch (error) {
        console.error("Erro ao buscar ou agrupar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupEvents();
  }, []);

  const formatEventDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <MobileLayout>
      <header className="flex items-center justify-between border-b border-[#F2E8E8] pb-2 w-full px-4 sticky top-0 bg-[#FAFAFA] z-10">
        <div className="flex-shrink-0">
          <BackButton />
        </div>
        <h1 className="flex-grow text-center text-xl mt-4 mb-4 font-bold text-[#383838]">
          Todos os Eventos
        </h1>
        <div className="w-6 h-6"></div>
      </header>

      <main className="px-4 pb-20">
        {loading ? (
          <p className="text-center text-[#706382] mt-8">
            Carregando eventos...
          </p>
        ) : Object.keys(groupedEvents).length === 0 ? (
          <p className="text-center text-[#706382] mt-8">
            Nenhum evento encontrado.
          </p>
        ) : (
          Object.keys(groupedEvents).map((groupKey) => (
            <section key={groupKey} className="mt-8">
              <h2 className="text-lg font-bold text-[#8967B3] border-b-2 border-[#C9B5E8] pb-2 mb-4">
                {groupKey}
              </h2>
              <div className="space-y-4">
                {groupedEvents[groupKey].map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/eventDetails/${event.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <p className="font-bold text-[#383838]">
                        {event.nomeEvento}
                      </p>
                      <p className="text-sm text-[#706382]">
                        {formatEventDate(event.data)} - {event.horario}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#8967B3]">
                      &gt;
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />
    </MobileLayout>
  );
};

export default AllEvents;
