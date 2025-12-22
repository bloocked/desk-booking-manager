import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const USER_ID = import.meta.env.VITE_DEFAULT_USER_ID;

const Home = () => {
    const [toDate, setToDate] = useState(getFormattedDefaultDate());
    const [fromDate, setFromDate] = useState(getFormattedDefaultDate());
    const [desks, setDesks] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [user, desks] = await Promise.all([
                fetch(`${API_URL}/Users/${USER_ID}`)
                    .then((res) => res.json())
                    .then((data) => setUser(data)),

                fetch(`${API_URL}/Desks`)
                    .then((res) => res.json())
                    .then((data) => setDesks(data)),
            ]);
            setLoading(false);
        };

        loadData();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        console.log("From Date:", fromDate);
        console.log("To Date:", toDate);
    }

    if (loading) return <h1>Loading...</h1>;

    return (
        <div>
            <form id="date-range-form" onSubmit={handleSubmit}>
                <h2>Select reservation date range:</h2>
                <DatePicker
                    id="from-date"
                    label="From:"
                    date={fromDate}
                    setDate={setFromDate}
                    minDate={getFormattedDefaultDate()}
                    maxDate={toDate}
                />
                <DatePicker
                    id="to-date"
                    label="To:"
                    date={toDate}
                    setDate={setToDate}
                    minDate={fromDate}
                />
                <button type="submit">See availability</button>
            </form>

            <DeskContainer desks={desks} user={user} fromDate={fromDate} toDate={toDate} />
        </div>
    );
};

const DatePicker = ({ id, label, date, setDate, minDate, maxDate }) => {
    return (
        <>
            <label htmlFor="from-date">{label}</label>
            <input
                id={id}
                type="date"
                min={minDate}
                max={maxDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
        </>
    );
};

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

    let deskStatus = "available";

        if (occupiedByUserOther) {
            deskStatus = "occupied-other";
        }
        else if (occupiedByUserSelf) {
            deskStatus = "occupied-self";
        }

    return (
        <div className="desk-card" onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
            <p>{desk.number}</p>
            {occupiedByUserSelf && <p>Occupied by self</p>}
            {occupiedByUserOther && <p>Occupied by Other</p>}
            {isHovered && <p>Hovered</p>}
        </div>
    );
};

const DeskContainer = ({ desks, user, fromDate, toDate }) => {
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
                />
            ))}
        </div>
    );
};

function getFormattedDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default Home;
