import React, { useEffect } from "react";


interface PopupProps {
  message: string;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup">
      <div className="popup-content">
        <span>{message}</span>
      </div>
    </div>
  );
};
