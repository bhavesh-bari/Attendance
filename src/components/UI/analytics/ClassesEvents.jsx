"use client";
import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import * as Dialog from "@radix-ui/react-dialog";

const COLORS = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#14b8a6",
];

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

// 🔥 UPDATED: Accepts dynamic 'department' and 'events' array
export default function ClassesEvents({ department, events = [] }) {

    // Process Data: Map events to classes (One event can belong to multiple classes)
    const classData = useMemo(() => {
        const classEventsMap = new Map();

        events.forEach((event) => {
            if (Array.isArray(event.classes)) {
                event.classes.forEach((className) => {
                    const currentCount = classEventsMap.get(className) || 0;
                    classEventsMap.set(className, currentCount + 1);
                });
            }
        });

        return Array.from(classEventsMap, ([name, value]) => ({ name, value }));
    }, [events]);

    const [selectedClass, setSelectedClass] = useState(null);

    const getClassEvents = (className) =>
        events.filter((event) => event.classes && event.classes.includes(className));

    const handleClassSliceClick = (data) => setSelectedClass(data.name);
    const handleDialogClose = () => setSelectedClass(null);

    if (!events || events.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{department}</h2>
                No event data available for the selected department.
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full">
            <div className="flex justify-center mb-4">
                <h2 className="text-xl font-bold text-indigo-700">
                    {department} — Events by Class
                </h2>
            </div>

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

            {/* Dialog */}
            <Dialog.Root open={!!selectedClass} onOpenChange={handleDialogClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg z-50">
                        <Dialog.Title className="text-lg font-semibold text-indigo-700">
                            Events for {selectedClass}
                        </Dialog.Title>

                        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
                            {getClassEvents(selectedClass).map((event, idx) => (
                                <div
                                    key={idx}
                                    className="border-l-4 border-indigo-500 pl-3 py-1 bg-gray-50 rounded-r"
                                >
                                    <p className="font-semibold text-gray-800">{event.event}</p>
                                    <p className="text-sm text-gray-600">Date: {event.date}</p>
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