import React, { useState, useEffect } from "react";

const DatePicker = () => {
    const today = new Date();

    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const years = Array.from(
        { length: 101 },
        (_, i) => today.getFullYear() - i
    );

    useEffect(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    const handleScroll = (e, type) => {
        const index = Math.round(e.target.scrollTop / 50) + 2;
        if (type === "day") setSelectedDay(days[index]);
        if (type === "month") setSelectedMonth(index + 1);
        if (type === "year") setSelectedYear(years[index]);
    };

    return (
        <div className="date-picker-container">
            <div className="date-picker">
                <div
                    className="scroll-section"
                    onScroll={(e) => handleScroll(e, "day")}
                >
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`scroll-item ${
                                selectedDay === day ? "selected" : ""
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div
                    className="scroll-section"
                    onScroll={(e) => handleScroll(e, "month")}
                >
                    {months.map((month, i) => (
                        <div
                            key={i}
                            className={`scroll-item ${
                                selectedMonth === i + 1 ? "selected" : ""
                            }`}
                        >
                            {month}
                        </div>
                    ))}
                </div>
                <div
                    className="scroll-section"
                    onScroll={(e) => handleScroll(e, "year")}
                >
                    {years.map((year, i) => (
                        <div
                            key={i}
                            className={`scroll-item ${
                                selectedYear === year ? "selected" : ""
                            }`}
                        >
                            {year}
                        </div>
                    ))}
                </div>
            </div>
            <div className="selected-date">
                Selected Date:{" "}
                {`${selectedDay} ${months[selectedMonth - 1]} ${selectedYear}`}
            </div>
        </div>
    );
};

export default DatePicker;
