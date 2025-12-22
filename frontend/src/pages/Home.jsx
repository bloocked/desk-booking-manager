import { useEffect, useState } from "react";

const Home = () => {
    const [toDate, setToDate] = useState(getFormattedDefaultDate());
    const [fromDate, setFromDate] = useState(getFormattedDefaultDate());
    const [desks, setDesks] = useState([]);
    const [user, setUser] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const userId = import.meta.env.VITE_DEFAULT_USER_ID;

        const loadData = async () => {
            const [user, desks] = await Promise.all([
                fetch(`${apiUrl}/Users/${userId}`)
                    .then((res) => res.json())
                    .then((data) => setUser(data)),

                fetch(`${apiUrl}/Desks`)
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

            <DeskContainer desks={desks} />
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

const DeskCard = ({ desk }) => {
    return (
        <div>
            <button>{desk.number}</button>
        </div>
    );
};

const DeskContainer = ({ desks }) => {
    if (desks.length === 0) return <h2>No desks.</h2>;

    return (
        <div>
            {desks.map((desk) => (
                <DeskCard key={desk.id} desk={desk} />
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
