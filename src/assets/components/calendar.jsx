import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const Calendar = () => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  // Novo estado para armazenar os eventos buscados
  const [events, setEvents] = useState(new Map());

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Efeito para buscar os eventos do Firestore quando o componente montar
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "eventos"));
      const eventsMap = new Map();
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        // A data no Firestore está no formato YYYY-MM-DD
        const eventDate = eventData.data;
        if (eventDate) {
          // Agrupa eventos pela data
          const eventsForDay = eventsMap.get(eventDate) || [];
          eventsMap.set(eventDate, [
            ...eventsForDay,
            { id: doc.id, ...eventData },
          ]);
        }
      });
      setEvents(eventsMap);
    };

    fetchEvents();
  }, []);

  const diasDaSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const gerarDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    const dias = [];

    for (let i = primeiroDiaDoMes; i > 0; i--) {
      dias.push({ numero: ultimoDiaMesAnterior - i + 1, mes: "anterior" });
    }
    for (let i = 1; i <= ultimoDiaDoMes; i++) {
      dias.push({ numero: i, mes: "atual" });
    }
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({ numero: i, mes: "proximo" });
    }
    return dias;
  };

  const handleNavegacao = (offset) => {
    setDataAtual((prevData) => {
      const novaData = new Date(prevData);
      novaData.setMonth(novaData.getMonth() + offset);
      return novaData;
    });
  };

  // Nova função para lidar com o clique em um dia
  const handleDayClick = (dia) => {
    if (dia.mes !== "atual") return;

    const ano = dataAtual.getFullYear();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
    const diaNumero = dia.numero.toString().padStart(2, "0");
    const dateString = `${ano}-${mes}-${diaNumero}`; // Formato YYYY-MM-DD

    const eventsOnDay = events.get(dateString);

    if (eventsOnDay && eventsOnDay.length > 0) {
      // Se houver evento, navega para a página de detalhes do primeiro evento do dia
      navigate(`/eventDetails/${eventsOnDay[0].id}`);
    } else if (isAdmin) {
      // Se não houver evento e o usuário for admin, navega para criar evento
      // com a data pré-selecionada
      navigate("/createevent", { state: { selectedDate: dateString } });
    } else {
      // Se não for admin e não houver evento, apenas seleciona o dia visualmente
      setDataSelecionada(new Date(ano, dataAtual.getMonth(), dia.numero));
    }
  };

  const dias = gerarDiasDoMes();

  return (
    <div className="bg-[#FAFAFA] rounded-xl shadow-lg p-6 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleNavegacao(-1)}
          className="text-[#383838] p-2 rounded-full hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-grow text-center text-[#383838] text-lg font-bold">
          {meses[dataAtual.getMonth()]} {dataAtual.getFullYear()}
        </div>
        <button
          onClick={() => handleNavegacao(1)}
          className="text-[#383838] p-2 rounded-full hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {diasDaSemana.map((dia, index) => (
          <div key={index} className="text-[#383838] font-semibold text-sm">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mt-2">
        {dias.map((dia, index) => {
          if (dia.mes !== "atual") {
            return (
              <div key={index} className="p-2 text-gray-400">
                {dia.numero}
              </div>
            );
          }

          const ano = dataAtual.getFullYear();
          const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
          const diaNumero = dia.numero.toString().padStart(2, "0");
          const dateString = `${ano}-${mes}-${diaNumero}`;

          const hasEvent = events.has(dateString);
          const isToday =
            dia.numero === new Date().getDate() &&
            dataAtual.getMonth() === new Date().getMonth() &&
            ano === new Date().getFullYear();

          return (
            <button
              key={index}
              onClick={() => handleDayClick(dia)}
              className={`p-2 rounded-full transition-colors font-medium relative
                ${
                  isToday
                    ? "bg-[#8967B3] text-[#FAFAFA]"
                    : "text-[#383838] hover:bg-gray-200"
                }
              `}
            >
              {dia.numero}
              {/* Círculo roxo para indicar evento */}
              {hasEvent && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#C9B5E8] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
