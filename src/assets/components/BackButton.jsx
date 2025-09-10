import { useNavigate } from 'react-router-dom';
import Voltar from "../../assets/images/Voltar.svg";

const BackButton = () => {
  const navigate = useNavigate();

  const BackOnePage = () => {
    navigate(-1);
  };
  
  return (
    <button onClick={BackOnePage}>
        <img className="w-6" src={Voltar} alt="Voltar" />
    </button>
  );
};

export default BackButton;