import React from "react";

const SearchPopup: React.FC<{ close: () => void }> = ({ close }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "200px",
    }}
  >
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#ccc"
        strokeWidth="2"
        fill="#f6f6f6"
      />
      <path
        d="M8 12h8M12 8v8"
        stroke="#ccc"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <p style={{ color: "#aaa", marginTop: 16 }}>Тут буде SearchPopup</p>
    <button onClick={close} style={{ marginTop: 24 }}>
      Закрити
    </button>
  </div>
);

export default SearchPopup;
