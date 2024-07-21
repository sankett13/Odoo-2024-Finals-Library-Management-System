import React from 'react';

const AccessDeniedModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-sm">
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="mt-3">You don't have access to that page.</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedModal;
