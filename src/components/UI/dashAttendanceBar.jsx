"use client";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    LabelList, // 👈 Added LabelList
} from "recharts";

// --------------------------------------------------
// 🎨 FIXED COLOR PALETTE (Supports unlimited departments)
// --------------------------------------------------
const departmentColorPalette = [
    "#1E90FF", // Blue
    "#28A745", // Green
    "#FF8C00", // Orange
    "#8A2BE2", // Purple
    "#DC143C", // Red
    "#20B2AA", // Teal
    "#FF1493", // Pink
    "#6A5ACD", // Indigo
    "#708090", // Slate
    "#A0522D", // Brown
];

// Utility to lighten colors (for morning shade)
const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) + amt;
    const g = ((num >> 8) & 0x00ff) + amt;
    const b = (num & 0x0000ff) + amt;

    return (
        "#" +
        (
            0x1000000 +
            (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 +
            (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 +
            (b < 255 ? (b < 1 ? 0 : b) : 255)
        )
            .toString(16)
            .slice(1)
    );
};

// Assign consistent colors to departments
const getDepartmentColors = (departments) => {
    const deptColorMap = {};
    departments.forEach((dept, index) => {
        const base = departmentColorPalette[index % departmentColorPalette.length];
        deptColorMap[dept] = {
            afternoon: base,
            morning: lightenColor(base, 38),
        };
    });
    return deptColorMap;
};

// Custom Tooltip to show department
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Assuming the first payload item has the department property
        const department = payload[0].payload.department;

        return (
            <div className="bg-white border rounded-lg shadow-md p-3 text-sm">
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-gray-600 mb-1">Department: {department}</p>
                {payload.map((entry) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: <span className="font-semibold">{entry.value}%</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


export default function DepartmentBarChart() {
    // 🔹 USE YOUR DATA EXACTLY AS GIVEN
    const extendedDepartmentData = [
        {
            department: "Computer Science",
            classes: [
                { name: "CS101", overall: 89, morning: 91, afternoon: 88 },
                { name: "CS102", overall: 85, morning: 84, afternoon: 86 },
                { name: "CS201", overall: 92, morning: 93, afternoon: 90 },
                { name: "CS202", overall: 87, morning: 88, afternoon: 85 },
                { name: "CS301", overall: 94, morning: 95, afternoon: 93 },
                { name: "CS302", overall: 90, morning: 92, afternoon: 89 },
                { name: "CS401", overall: 88, morning: 86, afternoon: 89 },
                { name: "CS402", overall: 91, morning: 91, afternoon: 91 },
            ],
        },
        {
            department: "Mechanical Engineering",
            classes: [
                { name: "ME101", overall: 78, morning: 79, afternoon: 76 },
                { name: "ME202", overall: 82, morning: 83, afternoon: 81 },
                { name: "ME301", overall: 85, morning: 87, afternoon: 84 },
                { name: "ME302", overall: 79, morning: 80, afternoon: 77 },
                { name: "ME401", overall: 88, morning: 89, afternoon: 86 },
                { name: "ME402", overall: 84, morning: 85, afternoon: 83 },
                { name: "ME501", overall: 81, morning: 82, afternoon: 79 },
            ],
        },
        {
            department: "Electrical Engineering",
            classes: [
                { name: "EE101", overall: 80, morning: 82, afternoon: 79 },
                { name: "EE102", overall: 83, morning: 84, afternoon: 81 },
                { name: "EE201", overall: 88, morning: 89, afternoon: 87 },
                { name: "EE202", overall: 77, morning: 78, afternoon: 75 },
                { name: "EE301", overall: 90, morning: 91, afternoon: 88 },
                { name: "EE302", overall: 85, morning: 87, afternoon: 84 },
                { name: "EE401", overall: 86, morning: 85, afternoon: 86 },
                { name: "EE402", overall: 89, morning: 90, afternoon: 87 },
                { name: "EE501", overall: 91, morning: 92, afternoon: 90 },
                { name: "EE502", overall: 82, morning: 83, afternoon: 80 },
            ],
        },
        {
            department: "Civil Engineering",
            classes: [
                { name: "CE101", overall: 75, morning: 77, afternoon: 74 },
                { name: "CE201", overall: 81, morning: 82, afternoon: 79 },
                { name: "CE301", overall: 84, morning: 85, afternoon: 83 },
                { name: "CE401", overall: 87, morning: 88, afternoon: 86 },
                { name: "CE501", overall: 79, morning: 81, afternoon: 78 },
            ],
        },
        {
            department: "Physics",
            classes: [
                { name: "PHY101", overall: 90, morning: 91, afternoon: 89 },
                { name: "PHY102", overall: 87, morning: 86, afternoon: 88 },
                { name: "PHY201", overall: 93, morning: 94, afternoon: 92 },
                { name: "PHY202", overall: 85, morning: 87, afternoon: 84 },
                { name: "PHY301", overall: 91, morning: 92, afternoon: 90 },
                { name: "PHY302", overall: 88, morning: 89, afternoon: 87 },
            ],
        },
        {
            department: "Chemistry",
            classes: [
                { name: "CHM101", overall: 84, morning: 86, afternoon: 83 },
                { name: "CHM102", overall: 80, morning: 81, afternoon: 78 },
                { name: "CHM201", overall: 87, morning: 88, afternoon: 86 },
                { name: "CHM202", overall: 91, morning: 92, afternoon: 90 },
                { name: "CHM301", overall: 85, morning: 86, afternoon: 84 },
                { name: "CHM302", overall: 78, morning: 79, afternoon: 77 },
                { name: "CHM401", overall: 82, morning: 83, afternoon: 80 },
                { name: "CHM402", overall: 89, morning: 90, afternoon: 87 },
                { name: "CHM501", overall: 86, morning: 87, afternoon: 85 },
            ],
        },
        {
            department: "Mathematics",
            classes: [
                { name: "MTH101", overall: 85, morning: 87, afternoon: 84 },
                { name: "MTH102", overall: 88, morning: 89, afternoon: 86 },
                { name: "MTH201", overall: 92, morning: 93, afternoon: 91 },
                { name: "MTH202", overall: 80, morning: 81, afternoon: 79 },
                { name: "MTH301", overall: 94, morning: 95, afternoon: 93 },
                { name: "MTH302", overall: 83, morning: 84, afternoon: 82 },
                { name: "MTH401", overall: 87, morning: 88, afternoon: 85 },
                { name: "MTH402", overall: 90, morning: 91, afternoon: 89 },
            ],
        },
    ];

    // Flatten the data
    const flatData = extendedDepartmentData.flatMap((dept) =>
        dept.classes.map((cls) => ({
            ...cls,
            department: dept.department,
        }))
    );

    // Collect department names
    const deptNames = extendedDepartmentData.map((d) => d.department);
    const deptColorMap = getDepartmentColors(deptNames);

    // 🔥 Dynamic width logic for scrollable chart
    // Base width: 900px, plus 45px per data point for two bars (morning/afternoon)
    const dynamicWidth = Math.max(900, flatData.length * 45);

    return (
        <div className="w-full h-[650px] bg-white p-4 rounded-xl shadow overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Department Attendance by Class and Shift</h2>

            {/* Scrollable Chart Container */}
            <div className="w-full overflow-x-auto hide-scrollbar" style={{ height: "480px" }}>
                <div style={{ minWidth: dynamicWidth, height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={flatData}
                            barGap={10}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }} // Increased top margin for labels
                            barCategoryGap="25%"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={90}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* MORNING (light shade) */}
                            <Bar dataKey="morning" name="Morning" radius={[5, 5, 0, 0]} barSize={26}>
                                {flatData.map((entry, i) => (
                                    <Cell
                                        key={`morning-cell-${i}`}
                                        fill={deptColorMap[entry.department].morning}
                                    />
                                ))}

                                <LabelList
                                    dataKey="morning"
                                    position="top"
                                    offset={8}
                                    formatter={(v) => `${v}%`}
                                    style={{ fill: "#000000", fontWeight: "bold" }}  // 🔥 Black text
                                />

                            </Bar>


                            <Bar dataKey="afternoon" name="Afternoon" radius={[5, 5, 0, 0]} barSize={26}>
                                {flatData.map((entry, i) => (
                                    <Cell
                                        key={`afternoon-cell-${i}`}
                                        fill={deptColorMap[entry.department].afternoon}
                                    />
                                ))}

                                <LabelList
                                    dataKey="afternoon"
                                    position="top"
                                    offset={8}
                                    formatter={(v) => `${v}%`}
                                    style={{ fill: "#ff0000", fontWeight: "bold" }}  // 🔥 Grey text
                                />

                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <hr className="my-4" />

            {/* LEGEND FOR DEPARTMENTS */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                <span className="font-bold w-full text-center text-sm mb-2">Department Color Key:</span>
                {deptNames.map((dept) => (
                    <div key={dept} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded shadow-md"
                            style={{
                                // Use the dark shade as the primary department color in the legend
                                backgroundColor: deptColorMap[dept].afternoon,
                            }}
                        ></div>
                        <span className="text-sm">{dept}</span>
                    </div>
                ))}
            </div>

            {/* Legend for Shift */}
            <div className="mt-4 text-center text-sm text-gray-600">
                <span className="font-bold">Shift Key:</span>
                <span className="ml-2" style={{ color: "#777" }}>&#9632; Light Bar = Morning</span>
                <span className="ml-4" style={{ color: "#333" }}>&#9632; Dark Bar = Afternoon</span>
            </div>
        </div>
    );
}