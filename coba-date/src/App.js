import { useState } from "react";
import "./App.css";
import DatePicker from "../src/lib/index";
import { convertDate } from "./lib/time";

function App() {
    const [time, setTime] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState("default");

    function handleToggle(isOpen) {
        setIsOpen(isOpen);
    }

    function handleThemeToggle(theme) {
        setTheme(theme);
        setIsOpen(true);
    }

    function handleSelect(time) {
        setTime(time);
        setIsOpen(false);
    }

    return (
        <div className="App">
            <p className="select-time ">{convertDate(time, "YYYY-MM-DD")}</p>
            <div>
                <button
                    className="select-btn sm"
                    onClick={() => handleThemeToggle("default")}
                >
                    default
                </button>
                <button
                    className="select-btn sm"
                    onClick={() => handleThemeToggle("dark")}
                >
                    dark
                </button>
                <button
                    className="select-btn sm"
                    onClick={() => handleThemeToggle("ios")}
                >
                    ios
                </button>
                <button
                    className="select-btn sm"
                    onClick={() => handleThemeToggle("android")}
                >
                    android
                </button>
                <button
                    className="select-btn sm"
                    onClick={() => handleThemeToggle("android-dark")}
                >
                    android-dark
                </button>
            </div>
            <DatePicker
                value={time}
                max={new Date()}
                theme={theme}
                isOpen={isOpen}
                showCaption
                dateConfig={{
                    year: {
                        format: "YYYY",
                        caption: "Year",
                        step: 1,
                    },
                    month: {
                        format: "M",
                        caption: "Month",
                        step: 1,
                    },
                    date: {
                        format: "D",
                        caption: "Day",
                        step: 1,
                    },
                }}
                onSelect={handleSelect}
                onCancel={() => handleToggle(false)}
            />
        </div>
    );
}

export default App;
