import { useState } from "react";

const DeskCard = ({ desk, user, fromDate, toDate }) => {
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseOver() {
        setIsHovered(true);
    }

    function handleMouseOut() {
        setIsHovered(false);
    }

    const isOccupied = (reservation) =>
        reservation.startDate < toDate && reservation.endDate > fromDate;

    const occupyingReservations = desk.reservations.filter((r) => isOccupied(r));
    const occupiedByUserOther = occupyingReservations.some((r) => r.userId !== user.id);
    const occupiedByUserSelf = occupyingReservations.some((r) => r.userId === user.id);

    const reservedUser = occupyingReservations.find((r) => r.userId !== user.id);
    if (reservedUser) console.log(reservedUser);

    let deskStatus = "available";

    if (occupiedByUserOther) {
        deskStatus = "occupied-other";
    } else if (occupiedByUserSelf) {
        deskStatus = "occupied-self";
    }

    return (
        <div className="desk-card" onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
            <p>{desk.number}</p>
            {occupiedByUserSelf && <p>Occupied by self</p>}
            {occupiedByUserOther && <p>Occupied by Other</p>}
            {isHovered && deskStatus === "occupied-self" && <CancelButton />}
            {isHovered && deskStatus === "occupied-other" && (
                <p>
                    Reserved by: {reservedUser.firstName} {reservedUser.lastName}
                </p>
            )}
        </div>
    );
};

export default DeskCard;

const CancelButton = () => {
    return <button>Cancel</button>;
};
