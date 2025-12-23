import DeskCard from "./DeskCard";

const DeskContainer = ({ desks, user, fromDate, toDate, onReservationUpdate }) => {
    if (desks.length === 0) return <h2>No desks.</h2>;

    return (
        <div className="desk-container">
            {desks.map((desk) => (
                <DeskCard
                    key={desk.id}
                    desk={desk}
                    user={user}
                    fromDate={fromDate}
                    toDate={toDate}
                    onReservationUpdate={onReservationUpdate}
                />
            ))}
        </div>
    );
};

export default DeskContainer;
