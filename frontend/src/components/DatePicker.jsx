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

export default DatePicker;