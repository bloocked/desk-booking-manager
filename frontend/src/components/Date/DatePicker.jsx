const DatePicker = ({ id, label, date, setDate, minDate, maxDate }) => {
    return (
        <div className="flex items-center mb-2 gap-2">
            <label htmlFor={id} className="w-20 text-xl">
                {label}
            </label>
            <input
                className="w-40 border border-gray-300 rounded p-1 text-xl"
                id={id}
                type="date"
                min={minDate}
                max={maxDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
        </div>
    );
};

export default DatePicker;
