"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import * as Dialog from "@radix-ui/react-dialog";

// Colors for pie chart slices
const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#14b8a6", // Teal
];

// Tooltip for pie chart slices
const ClassTooltip = ({ active, payload }) => {
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

// Safely process events into class-wise counts
const processClassData = (events = []) => {
    const classEventsMap = new Map();

    events.forEach((event) => {
        (event.classes || []).forEach((className) => {
            const currentCount = classEventsMap.get(className) || 0;
            classEventsMap.set(className, currentCount + 1);
        });
    });

    return Array.from(classEventsMap, ([name, value]) => ({ name, value }));
};

export default function DepartmentClassEventsChart({ department, events = [] }) {
    const classData = processClassData(events);

    const [selectedClass, setSelectedClass] = React.useState(null);

    const getClassEvents = (className) =>
        events.filter((event) => event.classes.includes(className));

    const handleClassSliceClick = (data) => setSelectedClass(data.name);

    const handleDialogClose = () => setSelectedClass(null);

    if (!events || events.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No event data available for the selected department/filters.
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full">
            {/* Title only */}
            <div className="flex justify-center mb-4">
                <h2 className="text-xl font-bold text-indigo-700">
                    {department} — Events by Class
                </h2>
            </div>

            {/* Horizontal scroll wrapper with hidden scrollbars */}
            <div className="w-full overflow-x-auto hide-scrollbar">
                <div className="min-w-[600px] mx-auto flex justify-center">
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={classData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={150}
                                innerRadius={70}
                                paddingAngle={4}
                                onClick={handleClassSliceClick}
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {classData.map((entry, index) => (
                                    <Cell
                                        key={`class-cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        cursor="pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<ClassTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Dialog for class event details */}
            <Dialog.Root open={!!selectedClass} onOpenChange={handleDialogClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
                        <Dialog.Title className="text-lg font-semibold text-indigo-700">
                            Events for {selectedClass}
                        </Dialog.Title>

                        {/* Scroll area with hidden scrollbar */}
                        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
                            {getClassEvents(selectedClass).map((event, idx) => (
                                <div
                                    key={idx}
                                    className="border-l-4 border-indigo-500 pl-3 py-1 bg-gray-50 rounded-r"
                                >
                                    <p className="font-semibold text-gray-800">
                                        {event.event}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Date: {event.date}
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
