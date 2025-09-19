// src/assets/components/EventDropdown.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Certifique-se de que o caminho está correto

const EventDropdown = ({ eventId }) => { // Note que `setIsEditing` foi removido, pois não é mais usado aqui
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    // Função para excluir o evento e a escala
    const handleDeleteEvent = async () => {
        if (window.confirm("Tem certeza que deseja excluir este evento e sua escala? Esta ação é irreversível.")) {
            try {
                // Deleta o documento do evento
                const eventRef = doc(db, "eventos", eventId);
                await deleteDoc(eventRef);
                
                // Tenta deletar a escala, se ela existir
                const scaleRef = doc(db, "escalas", eventId);
                await deleteDoc(scaleRef).catch(e => console.log("Escala não encontrada para exclusão."));

                alert("Evento excluído com sucesso!");
                navigate('/'); // Redireciona para a página inicial
            } catch (error) {
                console.error("Erro ao excluir o evento:", error);
                alert("Erro ao excluir o evento. Tente novamente.");
            }
        }
    };

    // Função para copiar o link do evento
    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => alert("Link copiado para a área de transferência!"))
            .catch(err => console.error("Erro ao copiar o link:", err));
    };

    // Nova função para redirecionar para a página de edição
    const handleEditEvent = () => {
        navigate(`/create-event/${eventId}`); // Redireciona para a rota com o ID do evento
    };

    return (
        <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="text-[#383838] p-2 rounded-full hover:bg-[#C9B5E8]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                </svg>
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FAFAFA] border border-[##F2E8E8] rounded-md shadow-lg z-10">
                    <button 
                        onClick={() => { handleEditEvent(); setShowDropdown(false); }} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA}">
                        Editar Evento
                    </button>
                    <button 
                        onClick={() => { handleCopyLink(); setShowDropdown(false); }} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA]">
                        Copiar Link
                    </button>
                    <button 
                        onClick={() => { handleDeleteEvent(); setShowDropdown(false); }} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#FAFAFA]">
                        Excluir Evento
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventDropdown;