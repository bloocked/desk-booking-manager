import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const USER_ID = import.meta.env.VITE_DEFAULT_USER_ID;

const Home = () => {
    const [toDate, setToDate] = useState(getFormattedDefaultDate());
    const [fromDate, setFromDate] = useState(getFormattedDefaultDate());
    const [desks, setDesks] = useState([]);
    const [user, setUser] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

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
            setLoadingData(false);
        };

        loadData();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        console.log("From Date:", fromDate);
        console.log("To Date:", toDate);
    }

    if (loadingData) return <h1>Loading...</h1>;

    return (
        <div>
            <form id="date-range-form" onSubmit={handleSubmit}>
                <h2>Select reservation date range:</h2>
                <DatePicker
                    label="From:"
                    date={fromDate}
                    setDate={setFromDate}
                    minDate={getFormattedDefaultDate()}
                />
                <DatePicker label="To:" date={toDate} setDate={setToDate} minDate={fromDate} />
                <button type="submit">See availability</button>
            </form>

            <DeskContainer desks={desks} user={user} fromDate={fromDate} toDate={toDate} />
        </div>
    );
};

const DatePicker = ({ label, date, setDate, minDate }) => {
    return (
        <>
            <label htmlFor="from-date">{label}</label>
            <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
        </>
    );
};

const DeskCard = ({ desk, user, fromDate, toDate }) => {
    const isOccupied = desk.reservations.some((r) => r.startDate < toDate && r.endDate > fromDate);

    return (
        <div className="desk-card">
            <p>{desk.number}</p>
            {isOccupied && <p>Occupied</p>}
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
