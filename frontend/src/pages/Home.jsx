import { useEffect, useState } from "react";
import { getFormattedDefaultDate } from "../utils/date";
import DatePicker from "../components/DatePicker";
import DeskContainer from "../components/Desk/DeskContainer";
import NavButton from "../components/Button/NavButton";

const API_URL = import.meta.env.VITE_API_URL;
const USER_ID = import.meta.env.VITE_DEFAULT_USER_ID;

const Home = () => {
    const [toDate, setToDate] = useState(getFormattedDefaultDate());
    const [fromDate, setFromDate] = useState(getFormattedDefaultDate());
    const [desks, setDesks] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const response = await fetch(`${API_URL}/Users/${USER_ID}`);

            if (!response.ok) {
                const error = await response.text();
                alert(`Failed to load user data: ${error}`);
                return;
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    const loadDesks = async () => {
        try {
            const response = await fetch(`${API_URL}/Desks`);

            if (!response.ok) {
                const error = await response.text();
                alert(`Failed to load desks data: ${error}`);
                return;
            }

            const data = await response.json();
            setDesks(data);
        } catch (error) {
            console.error("Error loading desks data:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadUser(), loadDesks()]);
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
        <div className="min-h-screen m-15">
            <form
                id="date-range-form"
                className="flex flex-col m-4 pb-4 border-b-2 border-gray-300"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between pb-2">
                    <h2 className="text-4xl pb-4">Select reservation date range:</h2>
                    <NavButton to="/profile" label="Go to Profile" />
                </div>

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
            </form>

            <DeskContainer
                desks={desks}
                user={user}
                fromDate={fromDate}
                toDate={toDate}
                onReservationUpdate={loadDesks}
            />
        </div>
    );
};

export default Home;
