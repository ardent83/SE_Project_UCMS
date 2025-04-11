import React, { useState, useEffect, useRef } from 'react';

const Alert = ({ message, duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [remainingTime, setRemainingTime] = useState(duration);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            intervalRef.current = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 100) {
                        clearInterval(intervalRef.current);
                        setIsVisible(false);
                        if (onClose) {
                            onClose();
                        }
                        return 0;
                    }
                    return prevTime - 100;
                });
            }, 100);
        }

        return () => clearInterval(intervalRef.current);
    }, [isVisible, duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        clearInterval(intervalRef.current);
        if (onClose) {
            onClose();
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border-red-500 text-red-700 px-4 py-3 rounded-md shadow-lg flex items-center justify-between transition-opacity duration-300`}
        >
            <p className="text-sm font-bold">{message}</p>
            <div className="flex items-center">
                <button
                    onClick={handleClose}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Alert;