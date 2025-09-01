import React, { useState } from 'react';

const Calendar = () => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const diasDaSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Lógica para gerar os dias do calendário
  const gerarDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDiaDoMes = new Date(ano, mes, 1).getDay(); // 0 para domingo, 1 para segunda, etc.
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

    const dias = [];

    // Adiciona os dias do mês anterior para preencher a primeira semana
    for (let i = primeiroDiaDoMes; i > 0; i--) {
      dias.push({
        numero: ultimoDiaMesAnterior - i + 1,
        mes: 'anterior',
      });
    }

    // Adiciona os dias do mês atual
    for (let i = 1; i <= ultimoDiaDoMes; i++) {
      dias.push({
        numero: i,
        mes: 'atual',
      });
    }

    // Adiciona os dias do próximo mês para preencher a última semana
    const diasRestantes = 42 - dias.length; // 6 linhas * 7 dias = 42 células
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({
        numero: i,
        mes: 'proximo',
      });
    }

    return dias;
  };

  const handleNavegacao = (offset) => {
    setDataAtual(prevData => {
      const novaData = new Date(prevData);
      novaData.setMonth(novaData.getMonth() + offset);
      return novaData;
    });
  };

  const handleSelecaoDia = (dia) => {
    setDataSelecionada(new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dia.numero));
  };
  
  const dias = gerarDiasDoMes();

  return (
    <div className="bg-[#FAFAFA] rounded-xl shadow-lg p-6 max-w-sm mx-auto">
      {/* Cabeçalho de Navegação */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleNavegacao(-1)}
          className="text-[#383838] p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-grow text-center text-[#383838] text-lg font-bold">
          {meses[dataAtual.getMonth()]} {dataAtual.getFullYear()}
        </div>
        <button
          onClick={() => handleNavegacao(1)}
          className="text-[#383838] p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Nomes dos Dias da Semana */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {diasDaSemana.map((dia, index) => (
          <div key={index} className="text-[#383838] font-semibold text-sm">
            {dia}
          </div>
        ))}
      </div>

      {/* Dias do Mês */}
      <div className="grid grid-cols-7 gap-2 text-center mt-2">
        {dias.map((dia, index) => {
          const isToday = dia.mes === 'atual' &&
            dia.numero === new Date().getDate() &&
            dataAtual.getMonth() === new Date().getMonth() &&
            dataAtual.getFullYear() === new Date().getFullYear();

          const isSelected = dia.mes === 'atual' &&
            dia.numero === dataSelecionada.getDate() &&
            dataAtual.getMonth() === dataSelecionada.getMonth() &&
            dataAtual.getFullYear() === dataSelecionada.getFullYear();

          return (
            <button
              key={index}
              onClick={() => dia.mes === 'atual' && handleSelecaoDia(dia)}
              className={`
                p-2 rounded-full transition-colors font-medium
                ${dia.mes !== 'atual' ? 'text-gray-400 cursor-not-allowed' : 'text-[#383838] hover:bg-[#C9B5E8]'}
                ${isSelected && !isToday && 'text-[#706382] font-bold'}
                ${isToday && 'bg-[#8967B3] text-[#FAFAFA] font-bold'}
              `}
            >
              {dia.numero}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;