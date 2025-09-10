// src/pages/CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import MobileLayout from "../../assets/layout/MobileLayout";
import BackButton from "../../assets/components/BackButton";
import Footer from '../../assets/components/Footer';

// Importa o `useParams` para ler o ID da URL
import { useParams, useNavigate } from 'react-router-dom'; 

// Importa as funções necessárias do Firebase
import { db } from '../../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const CreateEvent = () => {
    // Usa o `useParams` para obter o ID do evento, se existir
    const { id } = useParams(); 
    const navigate = useNavigate();

    // Estados para os campos do formulário
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');
    const [eventLocal, setEventLocal] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    // Efeito para carregar os dados do evento se um ID for passado na URL
    useEffect(() => {
        // Verifica se o ID do evento existe
        if (id) {
            const fetchEvent = async () => {
                const eventRef = doc(db, 'eventos', id);
                const eventSnap = await getDoc(eventRef);

                if (eventSnap.exists()) {
                    const data = eventSnap.data();
                    // Preenche os estados com os dados do evento
                    setEventName(data.nomeEvento);
                    setEventDate(data.data);
                    // Separa o horário de início e fim
                    const [start, end] = data.horario.split(' - ');
                    setEventStart(start);
                    setEventEnd(end);
                    setEventLocal(data.local);
                    setEventDescription(data.descricao);
                } else {
                    console.log("Nenhum evento encontrado para edição!");
                    // Você pode redirecionar o usuário ou mostrar uma mensagem de erro
                }
            };
            fetchEvent();
        }
    }, [id]); // O efeito é executado toda vez que o ID na URL muda

    // Função para lidar com a submissão do formulário
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        
        // Objeto do evento com os dados do formulário
        const newEvent = {
            nomeEvento: eventName,
            data: eventDate,
            horario: `${eventStart} - ${eventEnd}`,
            local: eventLocal,
            descricao: eventDescription,
        };
        
        try {
            if (id) {
                // Se o ID existe, atualiza o documento (editar)
                const eventRef = doc(db, "eventos", id);
                await updateDoc(eventRef, newEvent);
                alert("Evento atualizado com sucesso!");
                navigate(`/eventdetails/${id}`); // Redireciona para os detalhes do evento
            } else {
                // Se o ID não existe, cria um novo documento
                const eventRef = doc(db, "eventos", eventName);
                await setDoc(eventRef, newEvent);
                alert("Evento criado com sucesso!");
                navigate(`/eventdetails/${eventName}`); // Redireciona para os detalhes do novo evento
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
                    {/* Altera o título dinamicamente */}
                    {id ? 'Editar Evento' : 'Criar Evento'}
                </h1>
            </header>
            
            <form onSubmit={handleCreateEvent} className="p-4">
                <label className="block mb-2">
                    <span className="text-gray-700">Nome do Evento</span>
                    <input 
                        type="text" 
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required 
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Data</span>
                    <input 
                        type="date" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required 
                    />
                </label>
                <div className="flex justify-between mb-2">
                    <label className="block w-5/12">
                        <span className="text-gray-700">Início</span>
                        <input 
                            type="time" 
                            value={eventStart}
                            onChange={(e) => setEventStart(e.target.value)} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required 
                        />
                    </label>
                    <label className="block w-5/12">
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
                <label className="block mb-2">
                    <span className="text-gray-700">Local</span>
                    <input 
                        type="text" 
                        value={eventLocal}
                        onChange={(e) => setEventLocal(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Descrição</span>
                    <textarea 
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        rows="4"
                        />
                </label>
                <div className="flex justify-center mt-4">
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-[#8967B3] text-white rounded-md font-bold"
                    >
                        {/* Altera o texto do botão dinamicamente */}
                        {id ? 'Salvar Alterações' : 'Criar Evento'}
                    </button>
                </div>
            </form>
            <Footer />
        </MobileLayout>
    );
};

export default CreateEvent;