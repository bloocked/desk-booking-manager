import DeskCard from "./DeskCard";

const DeskContainer = ({ desks, user, fromDate, toDate, onReservationUpdate }) => {
    if (desks.length === 0) return <h2>No desks.</h2>;

    return (
        <div className="desk-container m-4 grid grid-cols-4 gap-4">
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
