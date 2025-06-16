import {useEffect, useRef, useState} from "react";
import {Edit2, More, TickCircle, Trash} from "iconsax-react";
import {deleteExamById} from "../utils/ExamsPageApi.js";

export default function ActionMenu({ examId, onDeleteSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDeleteClass = async () => {
        const success = await deleteExamById(examId);
        if (success && onDeleteSuccess) {
            onDeleteSuccess(examId);
        }
        setIsOpen(false);
    };



    return (
        <div className="relative inline-block text-center" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center items-center w-5 h-5 rounded-full hover:bg-gray-200 transition"
            >
                <More size="20" color="#334155" variant="Linear" className="rotate-90" />
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-32 origin-top rounded-xl bg-big-stone-900 shadow-2xl ring-1 ring-black/10 z-50"
                     style={{ animation: 'fadeInScale 0.1s ease-out forwards' }}>
                    <div className="py-1 px-1">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex justify-center items-center w-full gap-2 px-4 py-2 text-sm rounded-lg text-white hover:bg-emerald-100 hover:text-emerald-700"
                        >
                            <TickCircle size="16" variant="Bold" />
                            ثبت نمره
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex justify-center items-center w-full gap-2 px-4 py-2 text-sm rounded-lg text-white hover:bg-sky-200 hover:text-sky-700"
                        >
                            <Edit2 size="16" variant="Bold" />
                            ویرایش
                        </button>
                        <button
                            onClick={handleDeleteClass}
                            className="flex justify-center items-center w-full gap-2 px-4 py-2 text-sm rounded-lg text-white hover:bg-red-100 hover:text-red-700"
                        >
                            <Trash size="16" variant="Bold" />
                            حذف
                        </button>
                    </div>
                </div>
            )}

            <style>{`
              @keyframes fadeInScale {
                0% {
                  opacity: 0;
                  transform: scale(0.95);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
        </div>
    );
}
