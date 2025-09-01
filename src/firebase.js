// Importa as funções que você vai precisar do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importa o Firestore

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNtLPrI3K9JaT5mhzUsCeFYgftBqYGnKU",
  authDomain: "ministerio-de-eventos.firebaseapp.com",
  databaseURL: "https://ministerio-de-eventos-default-rtdb.firebaseio.com",
  projectId: "ministerio-de-eventos",
  storageBucket: "ministerio-de-eventos.firebasestorage.app",
  messagingSenderId: "337022142873",
  appId: "1:337022142873:web:fa860a9d69539b386e6b08",
  measurementId: "G-3LK554C0KW"
};

// Inicializa o seu aplicativo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa o banco de dados do Cloud Firestore
const db = getFirestore(app);

// Exporta o banco de dados para ser usado em outros arquivos
export { db };