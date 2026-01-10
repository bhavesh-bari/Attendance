"use client";
import React, { useState, useEffect } from "react";

/* ===========================================================
   DUMMY DEPARTMENT DATA (FULL)
   =========================================================== */

export const DEPARTMENT_DUMMY_DATA = {
    "Mechanical Engineering (ME)": {
        classes: [
            { name: "ME FE A", overall_attendance: 78, morning: 80, afternoon: 76, eventsAttended: 3 },
            { name: "ME FE B", overall_attendance: 82, morning: 85, afternoon: 79, eventsAttended: 2 },
            { name: "ME SE A", overall_attendance: 75, morning: 77, afternoon: 73, eventsAttended: 4 },
            { name: "ME SE B", overall_attendance: 79, morning: 82, afternoon: 76, eventsAttended: 3 },
            { name: "ME TE", overall_attendance: 88, morning: 90, afternoon: 86, eventsAttended: 5 },
        ],
    },

    "Civil Engineering (CE)": {
        classes: [
            { name: "CE FE", overall_attendance: 80, morning: 82, afternoon: 78, eventsAttended: 2 },
            { name: "CE SE A", overall_attendance: 76, morning: 78, afternoon: 72, eventsAttended: 3 },
            { name: "CE SE B", overall_attendance: 73, morning: 75, afternoon: 70, eventsAttended: 2 },
            { name: "CE TE", overall_attendance: 85, morning: 87, afternoon: 83, eventsAttended: 4 },
        ],
    },

    "Computer Science (CS)": {
        classes: [
            { name: "CS FE", overall_attendance: 90, morning: 92, afternoon: 88, eventsAttended: 3 },
            { name: "CS SE A", overall_attendance: 85, morning: 87, afternoon: 82, eventsAttended: 5 },
            { name: "CS SE B", overall_attendance: 82, morning: 84, afternoon: 80, eventsAttended: 4 },
            { name: "CS TE", overall_attendance: 88, morning: 90, afternoon: 86, eventsAttended: 6 },
            { name: "CS BE", overall_attendance: 92, morning: 94, afternoon: 90, eventsAttended: 7 },
        ],
    },

    "Electrical Engineering (EE)": {
        classes: [
            { name: "EE FE", overall_attendance: 78, morning: 80, afternoon: 76, eventsAttended: 2 },
            { name: "EE SE", overall_attendance: 83, morning: 85, afternoon: 81, eventsAttended: 3 },
            { name: "EE TE", overall_attendance: 81, morning: 83, afternoon: 79, eventsAttended: 2 },
            { name: "EE BE", overall_attendance: 89, morning: 90, afternoon: 87, eventsAttended: 4 },
        ],
    },
};


/* ===========================================================
   SMALL METRIC CARD COMPONENT
   =========================================================== */

const MetricCard = ({ title, value, colorClass = "text-gray-900", size = "text-3xl" }) => (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className={`mt-1 ${colorClass} font-extrabold ${size}`}>{value}</p>
    </div>
);


/* ===========================================================
   MAIN CLASS COMPARISON COMPONENT
   =========================================================== */

export default function ClassComparison({ department }) {

    const selectedDept = department || "Mechanical Engineering (ME)";
    const deptClasses = DEPARTMENT_DUMMY_DATA[selectedDept]?.classes || [];

    const [selectedClassA, setSelectedClassA] = useState("");
    const [selectedClassB, setSelectedClassB] = useState("");

    const colorA = "text-blue-600";
    const colorB = "text-green-600";
    const borderA = "border-blue-500";
    const borderB = "border-green-500";
    const bgColorA = "bg-blue-50";
    const bgColorB = "bg-green-50";

    /* ===========================================================
       COMPUTE ATTENDANCE RANK (NEW)
       =========================================================== */
    const sortedByAttendance = [...deptClasses].sort(
        (a, b) => b.overall_attendance - a.overall_attendance
    );

    const classRanks = {};
    sortedByAttendance.forEach((cls, index) => {
        classRanks[cls.name] = index + 1; // Rank starts from 1
    });


    /* Reset selected class when department changes */
    useEffect(() => {
        if (deptClasses.length > 0) {
            setSelectedClassA(deptClasses[0].name);
            setSelectedClassB(
                deptClasses.length > 1 ? deptClasses[1].name : deptClasses[0].name
            );
        }
    }, [selectedDept]);

    const classAData = deptClasses.find((c) => c.name === selectedClassA);
    const classBData = deptClasses.find((c) => c.name === selectedClassB);

    if (!selectedDept || deptClasses.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No classes available for the selected department.
            </div>
        );
    }

    return (
        <div className="mx-auto">

            {/* Selection Row */}
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8 bg-white p-4 rounded-lg">

                {/* Class A */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                    <label className="font-semibold text-gray-700">Class A:</label>
                    <select
                        value={selectedClassA}
                        onChange={(e) => setSelectedClassA(e.target.value)}
                        className={`p-2 border rounded-lg ${borderA} w-full`}
                    >
                        {deptClasses.map((cls) => (
                            <option key={cls.name}>{cls.name}</option>
                        ))}
                    </select>
                </div>

                <span className="text-2xl font-bold text-gray-500 hidden lg:block">VS</span>

                {/* Class B */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                    <label className="font-semibold text-gray-700">Class B:</label>
                    <select
                        value={selectedClassB}
                        onChange={(e) => setSelectedClassB(e.target.value)}
                        className={`p-2 border rounded-lg ${borderB} w-full`}
                    >
                        {deptClasses.map((cls) => (
                            <option key={cls.name}>{cls.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                {/* Class A */}
                <div className={`p-6 rounded-xl shadow-xl border-t-8 ${borderA} ${bgColorA}`}>
                    <h2 className={`text-2xl font-black mb-6 ${colorA}`}>
                        {selectedClassA}
                    </h2>
                    <div className="space-y-4">
                        <MetricCard title="Overall Attendance" value={`${classAData?.overall_attendance}%`} colorClass={colorA} />
                        <MetricCard title="Morning Session" value={`${classAData?.morning}%`} colorClass={colorA} />
                        <MetricCard title="Afternoon Session" value={`${classAData?.afternoon}%`} colorClass={colorA} />
                        <MetricCard title="Events Attended" value={classAData?.eventsAttended} />
                        
                        {/* NEW → Attendance Rank */}
                        <MetricCard
                            title="Attendance Rank"
                            value={`#${classRanks[selectedClassA]}`}
                            colorClass={colorA}
                        />
                    </div>
                </div>

                {/* Class B */}
                <div className={`p-6 rounded-xl shadow-xl border-t-8 ${borderB} ${bgColorB}`}>
                    <h2 className={`text-2xl font-black mb-6 ${colorB}`}>
                        {selectedClassB}
                    </h2>
                    <div className="space-y-4">
                        <MetricCard title="Overall Attendance" value={`${classBData?.overall_attendance}%`} colorClass={colorB} />
                        <MetricCard title="Morning Session" value={`${classBData?.morning}%`} colorClass={colorB} />
                        <MetricCard title="Afternoon Session" value={`${classBData?.afternoon}%`} colorClass={colorB} />
                        <MetricCard title="Events Attended" value={classBData?.eventsAttended} />

                        {/* NEW → Attendance Rank */}
                        <MetricCard
                            title="Attendance Rank"
                            value={`#${classRanks[selectedClassB]}`}
                            colorClass={colorB}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
