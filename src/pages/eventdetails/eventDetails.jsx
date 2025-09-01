import React, { useState, useEffect } from 'react';
import MobileLayout from "../../assets/layout/MobileLayout";
import BackButton from "../../assets/components/BackButton";
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../assets/components/Footer';

import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  
  const [newFunctions, setNewFunctions] = useState([{ funcao: '', nome: '' }]);

  const handleAddFunction = () => {
    setNewFunctions([...newFunctions, { funcao: '', nome: '' }]);
  };

  const handleRemoveFunction = (index) => {
    const list = [...newFunctions];
    list.splice(index, 1);
    setNewFunctions(list);
  };

  const handleFunctionChange = (e, index, type) => {
    const { value } = e.target;
    const list = [...newFunctions];
    list[index][type] = value;
    setNewFunctions(list);
  };

  const handleCreateSchedule = async () => {
    if (!id) {
      alert("ID do evento não encontrado.");
      return;
    }

    const newSchedule = {
      eventoId: id,
      funcoes: newFunctions.filter(func => func.funcao.trim() !== '' || func.nome.trim() !== ''),
    };

    try {
      await setDoc(doc(db, "escalas", id), newSchedule);
      console.log("Escala adicionada/atualizada com sucesso!");
      alert("Escala salva com sucesso!");
      setScheduleData(newSchedule);
      setShowScheduleForm(false);
    } catch (e) {
      console.error("Erro ao salvar escala: ", e);
      alert("Erro ao salvar a escala.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const eventRef = doc(db, "eventos", id);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setEventData(eventSnap.data());
        } else {
          console.log("Nenhum documento de evento encontrado!");
        }

        const scheduleRef = doc(db, "escalas", id);
        const scheduleSnap = await getDoc(scheduleRef);

        if (scheduleSnap.exists()) {
          setScheduleData(scheduleSnap.data());
          setNewFunctions(scheduleSnap.data().funcoes || [{ funcao: '', nome: '' }]);
        } else {
          console.log("Nenhuma escala encontrada para este evento.");
        }

      } catch (e) {
        console.error("Erro ao buscar documentos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Carregando...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!eventData) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Evento não encontrado.</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <header className="flex items-center justify-between border-b border-[#F2E8E8] pb-2 w-full px-4">
        <div className="flex-shrink-0">
          <BackButton />
        </div>
        <h1 className="flex-grow text-center text-xl mt-4 mb-4 font-bold text-[#383838]">
          Detalhes do evento
        </h1>
        <div className="w-6"></div>
      </header>
      
      <div>
        <h1 className="text-left text-base mt-4 mb-4 font-bold px-4 py-1 text-[#383838]">
          {eventData.nomeEvento}
        </h1>
      </div>

      <section className="flex border-b border-[#F2E8E8] pb-4">
        <div className="px-4">
          <p className="text-left text-sm font-semibold mt-4 mb-0 text-[#383838]">
            Data:
          </p>
          <p className="w-30 text-left text-sm mt-0 text-[#706382]">
            {eventData.data}
          </p>
        </div>
        <div className="px-4">
          <p className="text-left text-sm font-semibold mt-4 mb-0 text-[#383838]">
            Horário:
          </p>
          <p className="w-30 text-left text-sm mt-1.5 text-[#706382]">
            {eventData.horario}
          </p>
        </div>
      </section>

      <section className="flex border-b border-[#F2E8E8] pb-4">
        <div className="px-4">
          <p className="text-left text-sm font-semibold mt-4 mb-0 text-[#383838]">
            Local:
          </p>
          <p className="w-full text-left text-sm mt-0 text-[#706382]">
            {eventData.local}
          </p>
        </div>
      </section>

      <div>
        <h1 className="text-left text-lg mt-4 mb-4 font-bold px-4 py-1 text-[#383838]">
          Descrição
        </h1>
        <p className="w-full text-left text-sm mt-0 mb-8 px-4 text-[#706382]">
          {eventData.descricao}
        </p>
      </div>

      <section className="mb-20">
        {scheduleData && (
          <div className="flex mb-4 mt-4">
            <h1 className="w-full text-xl text-center px-20 font-bold text-[#383838]">
              Escala de serviços
            </h1>
          </div>
        )}
        
        {scheduleData && !showScheduleForm ? (
          <div className="px-4">
            {scheduleData.funcoes.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-left text-sm font-semibold mb-0 text-[#383838]">
                  {item.funcao}:
                </p>
                <p className="w-30 text-left text-sm mt-0 text-[#706382]">
                  {item.nome}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {showScheduleForm && (
          <div className="px-4">
            <h2 className="text-left text-lg mt-4 mb-4 font-bold text-[#383838]">
              {scheduleData ? 'Editar Escala' : 'Criar Escala'}
            </h2>
            {newFunctions.map((item, index) => (
              <div key={index} className="flex mb-2 space-x-2">
                <input 
                  type="text" 
                  className="flex-1 border-b-1 border-[#F2E8E8] rounded-md px-2 py-1" 
                  placeholder="Nome da função" 
                  value={item.funcao} 
                  onChange={(e) => handleFunctionChange(e, index, 'funcao')} 
                />
                <input 
                  type="text" 
                  className="flex-1 border-b-1 border-[#F2E8E8] rounded-md px-2 py-1" 
                  placeholder="Nome da pessoa" 
                  value={item.nome} 
                  onChange={(e) => handleFunctionChange(e, index, 'nome')} 
                />
                {newFunctions.length > 1 && (
                  <button onClick={() => handleRemoveFunction(index)} className="text-red-500 font-bold px-2 py-1">
                    X
                  </button>
                )}
              </div>
            ))}
            <div className="justify-center flex py-2">
              <button
                onClick={handleAddFunction}
                className="px-4 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md"
              >
                Adicionar Função
              </button>
            </div>
            <div className="py-2 justify-center flex">
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md"
              >
                Salvar Escala
              </button>
            </div>
          </div>
        )}
      </section>
      
      <div className="fixed bottom-20 mt-10 px-10 py-4 flex justify-between space-x-30">
        <button className="flex-1 px-2 border border-[#F2E8E8] text-[#383838] rounded-md">
          <span>Contato</span>
        </button>
        <button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
          className="flex flex-col items-center px-4 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md"
        >
          <span>
            {scheduleData ? 'Editar Escala' : 'Criar Escala'}
          </span>
        </button>
      </div>
      <Footer />
    </MobileLayout>
  );
};

export default EventDetails;