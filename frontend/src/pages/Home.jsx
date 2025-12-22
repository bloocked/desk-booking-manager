import { useState } from "react";

const Home = () => {
    const [toDate, setToDate] = useState(getFormattedDefaultDate());
    const [fromDate, setFromDate] = useState(getFormattedDefaultDate());

    function handleSubmit(event) {
        event.preventDefault();

        console.log("From Date:", fromDate);
        console.log("To Date:", toDate);
    }

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
                <DatePicker 
                    label="To:"
                    date={toDate}
                    setDate={setToDate}
                    minDate={fromDate}
                />
                <button type="submit">See availability</button>
            </form>
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

const TableCard = ({table}) => {
    

    return (
        <div>
            <h2>Table Card</h2>
        </div>
    );
}

const TableContainer = ({tables}) => {
    return (
        <div>
            <h2>Table Container</h2>
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
