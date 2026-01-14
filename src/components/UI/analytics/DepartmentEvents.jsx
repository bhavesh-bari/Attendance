"use client";
import React, { useState, useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import * as Dialog from "@radix-ui/react-dialog";

// Colors
const COLORS = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#8b5cf6", // Violet
    "#14b8a6", // Teal
];

// Tooltip
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border rounded-lg shadow-md p-3 text-sm">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-gray-600">Events: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

// 🔥 UPDATED: Accepts 'events' prop from Parent
export default function DepartmentEvents({ events = [] }) {

    // Process Data: Aggregate events by Department
    const { chartData, groupedEvents } = useMemo(() => {
        const counts = {};
        const groups = {};

        events.forEach(event => {
            const deptName = event.department || "Unknown";

            // Count for Pie Chart
            counts[deptName] = (counts[deptName] || 0) + 1;

            // Group details for Dialog
            if (!groups[deptName]) groups[deptName] = [];
            groups[deptName].push(event);
        });

        const chartData = Object.keys(counts).map(dept => ({
            name: dept,
            value: counts[dept]
        }));

        return { chartData, groupedEvents: groups };
    }, [events]);

    const [selectedDept, setSelectedDept] = useState(null);

    const handleSliceClick = (data) => {
        if (data?.name && groupedEvents[data.name]) {
            setSelectedDept(data.name);
        }
    };

    const handleClose = () => setSelectedDept(null);

    if (events.length === 0) {
        return <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-lg">No event data available.</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full">
            {/* Title */}
            <div className="text-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-indigo-700">
                    Department Events Overview
                </h2>
                <p className="text-gray-600 mt-2">
                    A visual breakdown of events conducted by each department.
                </p>
            </div>

            {/* Pie Chart */}
            <div className="w-full overflow-x-auto hide-scrollbar">
                <div className="min-w-[600px] mx-auto flex justify-center">
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={150}
                                innerRadius={70}
                                paddingAngle={4}
                                onClick={handleSliceClick}
                                label={({ name, percent }) =>
                                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        cursor="pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-600 text-sm">
                Showing total events across {chartData.length} departments.
            </div>

            {/* Dialog for Details */}
            <Dialog.Root open={!!selectedDept} onOpenChange={handleClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg z-50">
                        <Dialog.Title className="text-lg font-semibold text-indigo-700">
                            {selectedDept} — Events
                        </Dialog.Title>

                        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
                            {groupedEvents[selectedDept]?.map((event, idx) => (
                                <div
                                    key={idx}
                                    className="border-l-4 border-indigo-500 pl-3 py-1 bg-gray-50 rounded-r"
                                >
                                    <p className="font-semibold text-gray-800">{event.event}</p>
                                    <p className="text-sm text-gray-600">Date: {event.date}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Classes: {event.classes?.join(", ") || "N/A"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Dialog.Close asChild>
                            <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">
                                Close
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}