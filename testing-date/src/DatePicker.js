import React, { useState, useEffect, useRef } from "react";

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

    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    // validasi tanggal menyesuaikan bulan
    useEffect(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    // scroll ref validation
    useEffect(() => {
        if (dayRef.current) {
            const dayIndex = days.indexOf(selectedDay);
            dayRef.current.scrollTop = dayIndex * 50;
        }

        if (monthRef.current) {
            monthRef.current.scrollTop = (selectedMonth - 1) * 50;
            console.log(monthRef.current.scrollTop)
        }

        if (yearRef.current) {
            const yearIndex = years.indexOf(selectedYear);
            yearRef.current.scrollTop = yearIndex * 50;
        }
    }, [selectedDay, selectedMonth, selectedYear, days, years]);

    const handleScroll = (ref, type) => {
        const itemHeight = 50;
        const index = Math.round(ref.current.scrollTop / itemHeight);

        if (type === "day") {
            if (index >= 0 && index < days.length) {
                setSelectedDay(days[index]);
            }
        }
        if (type === "month") {
            if (index >= 0 && index < months.length) {
                setSelectedMonth(index + 1);
            }
        }
        if (type === "year") {
            if (index >= 0 && index < years.length) {
                setSelectedYear(years[index]);
            }
        }
    };

    return (
        <div className="date-picker-container">
            <div className="date-picker">
                <div
                    className="scroll-section"
                    ref={dayRef}
                    onScroll={() => handleScroll(dayRef, "day")}
                >
                    <div style={{ height: "100px" }}></div>

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
                    <div style={{ height: "100px" }}></div>
                </div>
                <div
                    className="scroll-section"
                    ref={monthRef}
                    onScroll={() => handleScroll(monthRef, "month")}
                >
                    <div style={{ height: "100px" }}></div>

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
                    <div style={{ height: "100px" }}></div>
                </div>
                <div
                    className="scroll-section"
                    ref={yearRef}
                    onScroll={() => handleScroll(yearRef, "year")}
                >
                    <div style={{ height: "100px" }}></div>

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
                    <div style={{ height: "100px" }}></div>
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
