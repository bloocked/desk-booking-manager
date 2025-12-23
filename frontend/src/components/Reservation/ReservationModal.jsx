import { useState } from "react";

const ReservationModal = ({ desk, initialFromDate, initialToDate, onClose, onConfirm }) => {
    const [fromDate, setFromDate] = useState(initialFromDate);
    const [toDate, setToDate] = useState(initialToDate);

    const handleSubmit = (event) => {
        event.preventDefault();

        onConfirm(desk.id, fromDate, toDate);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Reserve Desk {desk.number}</h2>
                <label>From:</label>
                <input type="date" required value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                <label>To:</label>
                <input type="date" required value={toDate} onChange={(e) => setToDate(e.target.value)} />
                <button type="submit">Confirm Reservation</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default ReservationModal;