import React from "react";
import s from "./MenuPopup.module.css";

const MenuPopup: React.FC<{ onClose: () => void; openPopup: () => void }> = ({
  onClose,
}) => {
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
            <rect
              x="4"
              y="6"
              width="16"
              height="2"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="4"
              y="11"
              width="16"
              height="2"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="4"
              y="16"
              width="16"
              height="2"
              rx="1"
              fill="currentColor"
            />
          </svg>
        </button>
        <div className={s.placeholderText}>Меню недоступне у цій версії</div>
      </div>
    </div>
  );
};

export default MenuPopup;
