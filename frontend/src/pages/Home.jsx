import { useEffect, useState } from "react";
import { getFormattedDefaultDate } from "../utils/date";
import DatePicker from "../components/DatePicker";
import DeskContainer from "../components/Desk/DeskContainer";

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

export default Home;
