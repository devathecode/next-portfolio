"use client";

import React, {useRef} from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: any
};

const AddModal: React.FC<ModalProps> = ({isOpen, onClose, children}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleBackgroundClick}
                    ref={modalRef}
                >
                    <div className="bg-white rounded-lg">
                        <div className="flex justify-between items-center mb-4 relative">
                            <button
                                className="text-gray-500 hover:text-gray-700 focus:outline-none absolute -top-2 -right-2"
                                onClick={onClose}>
                                <span className="sr-only">Close</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            )}
        </>)
}

export default AddModal;
