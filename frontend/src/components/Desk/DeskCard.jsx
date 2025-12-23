import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";
import ReservationModal from "../Reservation/ReservationModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const DESK_STATUS = {
    AVAILABLE: "available",
    MAINTENANCE: "maintenance",
    OCCUPIED_SELF: "occupied-self",
    OCCUPIED_OTHER: "occupied-other",
};

const DeskCard = ({ desk, user, fromDate, toDate, onReservationUpdate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [reservedOtherDetails, setReservedUserDetails] = useState(null);
    const [showReservationModal, setShowReservationModal] = useState(false);

    const isOccupied = (scheduledOccupancy) =>
        scheduledOccupancy.startDate <= toDate && scheduledOccupancy.endDate >= fromDate;

    const activeMaintenances = desk.maintenances.filter((m) => isOccupied(m));

    const activeReservations = desk.reservations.filter((r) => isOccupied(r));
    const otherUserReservation = activeReservations.find((r) => r.userId !== user.id);
    const selfReservation = activeReservations.find((r) => r.userId === user.id);

    let deskStatus = DESK_STATUS.AVAILABLE;

    const isMaintenanceActive = activeMaintenances.length > 0;
    const isOccupiedByOther = Boolean(otherUserReservation);
    const isOccupiedBySelf = Boolean(selfReservation);

    if (isMaintenanceActive) {
        deskStatus = DESK_STATUS.MAINTENANCE;
    } else if (isOccupiedBySelf) {
        deskStatus = DESK_STATUS.OCCUPIED_SELF;
    } else if (isOccupiedByOther) {
        deskStatus = DESK_STATUS.OCCUPIED_OTHER;
    }

    const isSingularDate = fromDate === toDate;

    async function handleMouseOver() {
        setIsHovered(true);
    }

    function handleMouseOut() {
        setIsHovered(false);
    }

    async function handleReserve(deskId, fromDate, toDate) {
        const response = await apiFetch(`Reservations/`, {
            method: "POST",
            body: JSON.stringify({
                deskId: deskId,
                userId: user.id,
                startDate: fromDate,
                endDate: toDate,
            }),
        }).catch((error) => {
            alert("Failed to create reservation");
        });

        setShowReservationModal(false);
        setIsHovered(false);

        // Refetch desks data to show updated state
        if (onReservationUpdate) {
            await onReservationUpdate();
        }
    }

    async function handleCancel() {
        if (isSingularDate) {
            await apiFetch(`Reservations/${selfReservation.id}?cancelDate=${fromDate}`, {
                method: "DELETE",
            }).catch((error) => {
                alert("Failed to cancel reservation for the selected date");
            });
        } else {
            await apiFetch(`Reservations/${selfReservation.id}`, {
                method: "DELETE",
            }).catch((error) => {
                alert("Failed to cancel reservation");
            });
        }

        // refetch desks data to show updated state
        if (onReservationUpdate) {
            await onReservationUpdate();
        }
    }

    useEffect(() => {
        if (isHovered && deskStatus === DESK_STATUS.OCCUPIED_OTHER && !reservedOtherDetails) {
            const otherUserId = otherUserReservation.userId;

            apiFetch(`Users/${otherUserId}`)
                .then((data) => setReservedUserDetails(data))
                .catch((error) => console.error("Failed to load user details:", error));
        }
    }, [isHovered, deskStatus]);

    const getStatusColor = () => {
        switch (deskStatus) {
            case DESK_STATUS.AVAILABLE:
                return "bg-green-100";
            case DESK_STATUS.MAINTENANCE:
                return "bg-red-100";
            case DESK_STATUS.OCCUPIED_SELF:
                return "bg-blue-100";
            case DESK_STATUS.OCCUPIED_OTHER:
                return "bg-gray-100";
            default:
                return "bg-white";
        }
    };

    const renderDeskActions = () => {
        if (!isHovered) return null;

        if (deskStatus === DESK_STATUS.AVAILABLE) {
            return (
                <ReserveButton
                    onClick={() => {
                        setShowReservationModal(true);
                    }}
                />
            );
        }

        if (deskStatus === DESK_STATUS.MAINTENANCE) {
            return <p>Under Maintenance</p>;
        }

        if (deskStatus === DESK_STATUS.OCCUPIED_SELF) {
            const title = isSingularDate ? "Cancel for This Day" : "Cancel Reservation";
            return <CancelButton onClick={handleCancel} title={title} />;
        }

        if (deskStatus === DESK_STATUS.OCCUPIED_OTHER && reservedOtherDetails) {
            return (
                <p>
                    Reserved by: {reservedOtherDetails.firstName} {reservedOtherDetails.lastName}
                </p>
            );
        }
    };

    return (
        <div
            className={`desk-card border-2 rounded p-4 h-35 text-center flex flex-col justify-center ${getStatusColor()}`}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}
        >
            {!isHovered && <p className="text-2xl">{desk.number}</p>}
            {isHovered && renderDeskActions()}
            {showReservationModal && (
                <ReservationModal
                    desk={desk}
                    initialFromDate={fromDate}
                    initialToDate={toDate}
                    onClose={() => {
                        setShowReservationModal(false);
                        setIsHovered(false);
                    }}
                    onConfirm={handleReserve}
                />
            )}
        </div>
    );
};

export default DeskCard;

const ReserveButton = ({ onClick }) => {
    return (
        <button
            className="border-2 border-green-500 rounded p-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold transition-colors"
            onClick={onClick}
        >
            Reserve
        </button>
    );
};

const CancelButton = ({ onClick, title }) => {
    return (
        <button
            className="border-2 border-blue-500 rounded p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition-colors"
            onClick={onClick}
        >
            {title}
        </button>
    );
};
