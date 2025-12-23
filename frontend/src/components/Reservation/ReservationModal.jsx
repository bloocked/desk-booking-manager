import { useState } from "react";

const ReservationModal = ({ desk, initialFromDate, initialToDate, onClose, onConfirm }) => {
    const [fromDate, setFromDate] = useState(initialFromDate);
    const [toDate, setToDate] = useState(initialToDate);

    const handleSubmit = (event) => {
        event.preventDefault();

        onConfirm(desk.id, fromDate, toDate);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center" onClick={onClose}>
            <div
                className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 border-2"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold">Reserve Desk {desk.number}</h2>
                    <div>
                        <label className="flex mb-1 ml-1">From:</label>
                        <input
                            type="date"
                            required
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="flex mb-1 ml-1">To:</label>
                        <input
                            type="date"
                            required
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;
