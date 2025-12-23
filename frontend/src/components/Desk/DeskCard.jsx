import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const DESK_STATUS = {
    AVAILABLE: "available",
    OCCUPIED_SELF: "occupied-self",
    OCCUPIED_OTHER: "occupied-other",
};

const DeskCard = ({ desk, user, fromDate, toDate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [reservedOtherDetails, setReservedUserDetails] = useState(null);

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
            {isHovered && deskStatus === DESK_STATUS.OCCUPIED_SELF && <CancelButton />}
            {isHovered && deskStatus === DESK_STATUS.OCCUPIED_OTHER && reservedOtherDetails && (
                <p>
                    Reserved by: {reservedOtherDetails.firstName} {reservedOtherDetails.lastName}
                </p>
            )}
        </div>
    );
};

export default DeskCard;

const CancelButton = () => {
    return <button>Cancel</button>;
};
