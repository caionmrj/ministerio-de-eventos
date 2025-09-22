import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import emailjs from "@emailjs/browser";

const SuggestionBox = ({ eventName, eventDate }) => {
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      setStatus({ message: "Por favor, escreva sua sugestão.", type: "error" });
      return;
    }
    if (!user) {
      setStatus({
        message: "Você precisa estar logado para enviar uma sugestão.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: "", type: "" });

    const formattedDate = eventDate.split("-").reverse().join("/");


    const templateParams = {
      subject: `${eventName} ${formattedDate} + sugestão`,
      event_name: eventName,
      from_email: user.email,
      message: suggestion, 
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      setStatus({
        message: "Sugestão enviada com sucesso! Obrigado.",
        type: "success",
      });
      setSuggestion(""); // Limpa o campo após o envio
    } catch (error) {
      console.error("Erro ao enviar e-mail via EmailJS:", error);
      setStatus({
        message: "Erro ao enviar. Tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-4 border-t border-[#F2E8E8]">
      <h3 className="text-lg font-bold text-[#383838]">
        Tem uma sugestão para este evento?
      </h3>
      <p className="text-sm text-[#706382] mb-4">
        Sua ideia é importante para nós! Envie sua sugestão para a organização.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Digite sua sugestão aqui..."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-6 py-2 bg-[#8967B3] text-white font-bold rounded-md w-full disabled:bg-gray-400 hover:bg-opacity-90 transition-colors"
        >
          {isSubmitting ? "Enviando..." : "Enviar Sugestão"}
        </button>
      </form>
      {status.message && (
        <p
          className={`mt-4 text-center text-sm font-bold ${
            status.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default SuggestionBox;
