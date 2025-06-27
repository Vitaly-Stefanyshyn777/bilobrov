import React from "react";
import s from "./Register.module.css";

const RegisterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <button onClick={onClose} className={s.closeBtn}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M4 20C4 16.6863 7.13401 14 12 14C16.866 14 20 16.6863 20 20"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <div className={s.placeholderText}>
          Реєстрація/логін недоступні у цій версії
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
