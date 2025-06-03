import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [remainingTime, setRemainingTime] = useState(duration);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);
    const progressRef = useRef(100);

    const alertTypes = {
        success: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', progress: 'bg-green-500' },
        info: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', progress: 'bg-blue-500' },
        warning: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', progress: 'bg-yellow-500' },
        error: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', progress: 'bg-red-500' },
    };

    const { bg, border, text, progress } = alertTypes[type] || alertTypes.info;

    const closeAlert = useCallback(() => {
        setIsVisible(false);
        clearInterval(intervalRef.current);
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        const tick = () => {
            setRemainingTime(prev => {
                const updated = prev - 100;
                progressRef.current = parseFloat(((updated / duration) * 100).toFixed(5));
                if (updated <= 0) {
                    closeAlert();
                    return 0;
                }
                return updated;
            });
        };

        if (isVisible && !isPaused) {
            intervalRef.current = setInterval(tick, 100);
        }

        return () => clearInterval(intervalRef.current);
    }, [isVisible, isPaused, duration, closeAlert]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') closeAlert();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [closeAlert]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${bg} ${border} ${text} px-6 py-4 rounded-xl shadow-lg flex items-center justify-between`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="flex items-center">
                        <span className="mr-2">{/* Optional icon based on type */}</span>
                        <div className="text-body-04 text-neutralgray-10 text-wrap">
                            {message.split('\n').map((line, index) => (
                                <span className="text-wrap" key={index}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={closeAlert}
                        className={`ml-4 ${text} hover:opacity-75 focus:outline-none`}
                        aria-label="Close Alert"
                    >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-1 rounded-b-xl overflow-hidden">
                        <div
                            className={`${progress} h-1 transition-width duration-300 ease-out`}
                            style={{ width: `${progressRef.current}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Alert;