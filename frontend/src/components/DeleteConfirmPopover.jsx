import React from 'react';
const DeleteConfirmModalContent = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="p-2"> 
      <p className="text-base text-gray-100 mb-4 text-center font-medium">
        {message}
      </p>
      <div className="flex justify-around gap-3">
        <button
          onClick={onConfirm} 
          className="
            flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded
            hover:bg-red-700 transition-colors font-semibold
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75
          "
        >
          بله، حذف کن
        </button>
        <button
          onClick={onCancel} 
          className="
            flex-1 bg-gray-700 text-gray-200 text-sm py-2 px-3 rounded
            hover:bg-gray-600 transition-colors font-semibold
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
          "
        >
           خیر، لازم نیست
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModalContent;