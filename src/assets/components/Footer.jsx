import { useNavigate, useLocation } from "react-router-dom";
import HomeAtivado from "../../assets/images/HomeAtivado.svg";
import HomeDesativado from "../../assets/images/HomeDesativado.svg";
import CalendarioAtivado from "../../assets/images/CalendarioAtivado.svg";
import CalendarioDesativado from "../../assets/images/CalendarioDesativado.svg";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="fixed bg-[#FAFAFA] bottom-0 w-full max-w-sm p-4 z-[999] border-t mt-8 border-[#F2E8E8]">
      <nav>
        <ul className="flex justify-around items-center">
          <li className="flex flex-col items-center">
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center"
            >
              {currentPath === "/" ? (
                <img className="w-6" src={HomeAtivado} alt="Início" />
              ) : (
                <img className="w-6" src={HomeDesativado} alt="Início" />
              )}
              <span className="text-textcolor hover:text-primary font-graphik-bold">
                Início
              </span>
            </button>
          </li>
          {/* Aba Eventos */}
          <li className="flex flex-col items-center">
            <button
              onClick={() => navigate("/events")}
              className="flex flex-col items-center"
            >
              {currentPath === "/events" ? (
                <img className="w-6" src={CalendarioAtivado} alt="Eventos" />
              ) : (
                <img className="w-6" src={CalendarioDesativado} alt="Eventos" />
              )}
              <span className="text-textcolor hover:text-primary font-graphik-bold">
                Eventos
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
