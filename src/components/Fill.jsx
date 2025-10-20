"use client";
import React, { useState } from "react";

const YEAR_OPTIONS = ["2nd Year", "3rd Year", "4th Year"];
const SHIFT_OPTIONS = ["Morning", "Afternoon"];

const initialClasses = [
    { id: 1, dept: "CSE", year: "3rd Year", div: "A", totalStudents: 60 },
    { id: 2, dept: "ECE", year: "2nd Year", div: "B", totalStudents: 55 },
];

const AttendanceComponent = () => {
    const [classes] = useState(initialClasses);
    const [attendanceData, setAttendanceData] = useState([]);
    const [newAttendance, setNewAttendance] = useState({
        shift: SHIFT_OPTIONS[0],
        classId: "",
        presentStudents: 0,
        eventName: "",
    });

    // --- Handlers ---
    const handleAttendanceChange = (e) => {
        const { name, value } = e.target;
        setNewAttendance((prev) => ({
            ...prev,
            [name]: name === "presentStudents" ? Number(value) : value,
        }));
    };

    const handleSubmitAttendance = (e) => {
        e.preventDefault();
        if (!newAttendance.classId || newAttendance.presentStudents < 0) return;

        const record = {
            id: Date.now(),
            ...newAttendance,
            className: classes.find((c) => c.id === Number(newAttendance.classId))
                ?.dept + " - " + classes.find((c) => c.id === Number(newAttendance.classId))
                    ?.year + " - " + classes.find((c) => c.id === Number(newAttendance.classId))
                    ?.div,
        };

        setAttendanceData((prev) => [...prev, record]);
        setNewAttendance({ shift: SHIFT_OPTIONS[0], classId: "", presentStudents: 0, eventName: "" });
    };

    // --- Styling ---
    const inputClasses =
        "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";
    const baseButtonClasses =
        "px-4 py-2 font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300";

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans overflow-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-900">
                    Attendance System 📝
                </h1>

                {/* Attendance Form */}
                <form
                    onSubmit={handleSubmitAttendance}
                    className="p-6 space-y-4 bg-white rounded-xl shadow-xl border-t-4 border-indigo-500"
                >
                    <h3 className="text-2xl font-bold text-gray-800">Fill Attendance</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            name="shift"
                            value={newAttendance.shift}
                            onChange={handleAttendanceChange}
                            className={inputClasses}
                        >
                            {SHIFT_OPTIONS.map((shift) => (
                                <option key={shift} value={shift}>
                                    {shift} Shift
                                </option>
                            ))}
                        </select>

                        <select
                            name="classId"
                            value={newAttendance.classId}
                            onChange={handleAttendanceChange}
                            className={inputClasses}
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.dept} - {cls.year} - {cls.div} (Total: {cls.totalStudents})
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="presentStudents"
                            min="0"
                            placeholder="No. of Students Present"
                            value={newAttendance.presentStudents}
                            onChange={handleAttendanceChange}
                            className={inputClasses}
                            required
                        />

                        <input
                            type="text"
                            name="eventName"
                            placeholder="Event Name (if any)"
                            value={newAttendance.eventName}
                            onChange={handleAttendanceChange}
                            className={inputClasses}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`${baseButtonClasses} w-full bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01]`}
                    >
                        Submit Attendance
                    </button>
                </form>

                {/* Attendance Records */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Attendance Records ({attendanceData.length})
                    </h2>
                    {attendanceData.map((record) => (
                        <div
                            key={record.id}
                            className="p-4 border-l-4 rounded-lg bg-white border-green-500 shadow hover:shadow-xl transition-all duration-300"
                        >
                            <p className="font-bold text-lg">
                                {record.className} - {record.shift} Shift
                            </p>
                            <p>
                                Present Students: {record.presentStudents}{" "}
                                {record.eventName && (
                                    <span>| Event: {record.eventName}</span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendanceComponent;
