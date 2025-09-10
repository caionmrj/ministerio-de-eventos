import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Components
import MobileLayout from "../../assets/layout/MobileLayout";
import BackButton from "../../assets/components/BackButton";
import Footer from '../../assets/components/Footer';
import EventDropdown from '../../assets/components/EventDropdown';

// Firebase
import { db } from '../../firebase';

const EventDetails = () => {
    // Router hooks
    const navigate = useNavigate();
    const { id } = useParams();

    // Event states
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState(null);
    
    // Schedule states
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

        const scheduleFunctions = newFunctions.filter(func => func.funcao.trim() !== '' || func.nome.trim() !== '');

        try {
            const scheduleRef = doc(db, "escalas", id);
            
            // Verifica se a escala já existe para decidir entre criar ou atualizar
            const scheduleSnap = await getDoc(scheduleRef);
            if (scheduleSnap.exists()) {
                await updateDoc(scheduleRef, { funcoes: scheduleFunctions });
            } else {
                await setDoc(scheduleRef, { eventoId: id, funcoes: scheduleFunctions });
            }

            alert("Escala salva com sucesso!");
            setScheduleData({ funcoes: scheduleFunctions });
            setShowScheduleForm(false);
        } catch (e) {
            console.error("Erro ao salvar escala: ", e);
            alert("Erro ao salvar a escala.");
        }
    };

    // Função para excluir a escala do Firestore
    const handleDeleteSchedule = async () => {
        if (window.confirm("Tem certeza que deseja excluir esta escala? Esta ação é irreversível.")) {
            try {
                const scaleRef = doc(db, "escalas", id);
                await deleteDoc(scaleRef);
                setScheduleData(null);
                setNewFunctions([{ funcao: '', nome: '' }]);
                setShowScheduleForm(false);
                alert("Escala excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir a escala:", error);
                alert("Erro ao excluir a escala. Tente novamente.");
            }
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
                }

                const scheduleRef = doc(db, "escalas", id);
                const scheduleSnap = await getDoc(scheduleRef);

                if (scheduleSnap.exists()) {
                    const data = scheduleSnap.data();
                    setScheduleData(data);
                    setNewFunctions(data.funcoes || [{ funcao: '', nome: '' }]);
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

    // Render helpers
    const renderEventDetails = () => (
        <section className="px-4 pt-4">
            <h1 className="text-left text-2xl font-bold text-[#383838] mb-6">
                {eventData.nomeEvento}
            </h1>
            
            <div className="space-y-4">
                {[
                    { label: 'Data', value: eventData.data ? eventData.data.split('-').reverse().join('/') : eventData.data },
                    { label: 'Horário', value: eventData.horario },
                    { label: 'Local', value: eventData.local },
                    { label: 'Descrição', value: eventData.descricao }
                ].map(({ label, value }) => (
                    <div key={label}>
                        <h2 className="text-left text-lg font-bold text-[#383838]">{label}:</h2>
                        <p className="text-[#706382]">{value}</p>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <MobileLayout>
            <header className="flex items-center justify-between border-b border-[#F2E8E8] pb-2 w-full px-4">
                <div className="flex-shrink-0">
                    <BackButton />
                </div>
                <h1 className="flex-grow text-center text-xl mt-4 mb-4 font-bold text-[#383838]">
                    Detalhes do evento
                </h1>
                <EventDropdown eventId={id} />
            </header>

            {/* Seção principal do evento */}
            {renderEventDetails()}

            {/* Seção da Escala de Serviços */}
            <section className="px-4 mt-8 pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-left text-2xl font-bold text-[#383838]">Escala do evento</h2>
                    <button
                        onClick={() => setShowScheduleForm(!showScheduleForm)}
                        className="px-6 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md"
                    >
                        {showScheduleForm ? 'Cancelar' : scheduleData ? 'Editar Escala' : 'Criar Escala'}
                    </button>
                </div>

                {/* Renderização Condicional da Escala */}
                {!showScheduleForm && scheduleData && scheduleData.funcoes.length > 0 ? (
                    <div className="space-y-4">
                        {scheduleData.funcoes.map((item, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="text-left text-lg font-bold text-[#383838]">
                                    {item.funcao}:
                                </h3>
                                <p className="text-[#706382]">
                                    {item.nome}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : !showScheduleForm && (
                    <p className="text-[#706382] mt-2">Nenhuma escala cadastrada.</p>
                )}
                
                {/* Formulário de Escala */}
                {showScheduleForm && (
                    <div className="mt-4">
                        {newFunctions.map((item, index) => (
                            <div key={index} className="flex flex-col mb-4">
                                <input
                                    type="text"
                                    className="w-full mb-2 p-3 border border-[#F2E8E8] rounded-md text-[#706382]"
                                    placeholder="Função"
                                    value={item.funcao}
                                    onChange={(e) => handleFunctionChange(e, index, 'funcao')}
                                />
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        className="flex-1 p-3 border border-[#F2E8E8] rounded-md text-[#706382]"
                                        placeholder="Nome"
                                        value={item.nome}
                                        onChange={(e) => handleFunctionChange(e, index, 'nome')}
                                    />
                                    {newFunctions.length > 1 && (
                                        <button 
                                            onClick={() => handleRemoveFunction(index)} 
                                            className="ml-2 px-3 py-2 text-[#8967B3] font-bold rounded-md hover:bg-[#F2E8E8]"
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex flex-col space-y-3 mt-6">
                            <button
                                onClick={handleAddFunction}
                                className="px-6 py-2 bg-[#F2E8E8] text-[#8967B3] font-medium rounded-md"
                            >
                                Adicionar Função
                            </button>
                            <button
                                onClick={handleCreateSchedule}
                                className="px-6 py-2 bg-[#8967B3] text-[#FAFAFA] rounded-md"
                            >
                                Salvar Escala
                            </button>
                            {scheduleData && (
                                <button
                                    onClick={handleDeleteSchedule}
                                    className="px-6 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Excluir Escala
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </section>
            
            <Footer />
        </MobileLayout>
    );
};

export default EventDetails;