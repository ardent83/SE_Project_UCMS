import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; 

const Modal = ({ show, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000] p-4" 
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(5px)', 
        WebkitBackdropFilter: 'blur(5px)', 
      }}
    >
      <div
        ref={modalRef}
        className="
          bg-gray-800 p-6 rounded-lg shadow-2xl relative
          transform transition-all duration-300 ease-out scale-95 opacity-0
        "
        style={{
          transform: show ? 'scale(1)' : 'scale(0.95)',
          opacity: show ? 1 : 0,
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>,
    document.body 
  );
};

export default Modal;