import { useEffect, useState } from "react";
import ReservationModal from "../Reservation/ReservationModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const DESK_STATUS = {
    AVAILABLE: "available",
    OCCUPIED_SELF: "occupied-self",
    OCCUPIED_OTHER: "occupied-other",
};

const DeskCard = ({ desk, user, fromDate, toDate, onReservationUpdate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [reservedOtherDetails, setReservedUserDetails] = useState(null);
    const [showReservationModal, setShowReservationModal] = useState(false);

    const isOccupied = (reservation) =>
        reservation.startDate < toDate && reservation.endDate > fromDate;

    const activeReservations = desk.reservations.filter((r) => isOccupied(r));
    const otherUserReservation = activeReservations.find((r) => r.userId !== user.id);
    const selfReservation = activeReservations.find((r) => r.userId === user.id);

    let deskStatus = DESK_STATUS.AVAILABLE;

    const isOccupiedByOther = Boolean(otherUserReservation);
    const isOccupiedBySelf = Boolean(selfReservation);

    if (isOccupiedByOther) {
        deskStatus = DESK_STATUS.OCCUPIED_OTHER;
    } else if (isOccupiedBySelf) {
        deskStatus = DESK_STATUS.OCCUPIED_SELF;
    }

    async function handleMouseOver() {
        setIsHovered(true);
    }

    function handleMouseOut() {
        setIsHovered(false);
    }

    async function handleReserve(deskId, fromDate, toDate) {
        try {
            const response = await fetch(`${API_URL}/Reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deskId: deskId,
                    userId: user.id,
                    startDate: fromDate,
                    endDate: toDate,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                alert(`Reservation failed: ${error}`);
                return;
            }

            const data = await response.json();
            setShowReservationModal(false);

            // Refetch desks data to show updated state
            if (onReservationUpdate) {
                await onReservationUpdate();
            }
        } catch (error) {
            alert("Failed to create reservation");
        }
    }

    async function handleCancel() {
        try {
            const response = await fetch(`${API_URL}/Reservations/${selfReservation.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.text();
                alert(`Cancellation failed: ${error}`);
                return;
            }

            // Refetch desks data to show updated state
            if (onReservationUpdate) {
                await onReservationUpdate();
            }

        } catch (error) {
            alert("Failed to cancel reservation");
        }
    }

    useEffect(() => {
        if (isHovered && deskStatus === DESK_STATUS.OCCUPIED_OTHER && !reservedOtherDetails) {
            const otherUserId = otherUserReservation.userId;
            const details = fetch(`${API_URL}/Users/${otherUserId}`)
                .then((res) => res.json())
                .then((data) => setReservedUserDetails(data));
        }
    }, [isHovered, deskStatus]);

    return (
        <div className="desk-card" onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
            <p>{desk.number}</p>
            {isOccupiedBySelf && <p>Occupied by self</p>}

            {isOccupiedByOther && <p>Occupied by Other</p>}

            {isHovered && !showReservationModal && deskStatus === DESK_STATUS.AVAILABLE && (
                <ReserveButton onClick={() => setShowReservationModal(true)} />
            )}
            {showReservationModal && (
                <ReservationModal
                    desk={desk}
                    initialFromDate={fromDate}
                    initialToDate={toDate}
                    onClose={() => setShowReservationModal(false)}
                    onConfirm={handleReserve}
                />
            )}

            {isHovered && deskStatus === DESK_STATUS.OCCUPIED_SELF && <CancelButton onClick={handleCancel} />}

            {isHovered && deskStatus === DESK_STATUS.OCCUPIED_OTHER && reservedOtherDetails && (
                <p>
                    Reserved by: {reservedOtherDetails.firstName} {reservedOtherDetails.lastName}
                </p>
            )}
        </div>
    );
};

export default DeskCard;

const ReserveButton = ({ onClick }) => {
    return <button onClick={onClick}>Reserve</button>;
};

const CancelButton = ({ onClick }) => {
    return <button onClick={onClick}>Cancel</button>;
};
