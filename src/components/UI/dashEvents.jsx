"use client";
import React, { useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer, LabelList,
} from "recharts";

// --- Colors ---
const DEPARTMENT_PALETTE = [
    "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444",
    "#EC4899", "#06B6D4", "#6366F1", "#F97316", "#64748B"
];

const getDepartmentColors = (depts) => {
    const map = {};
    depts.forEach((d, i) => map[d] = DEPARTMENT_PALETTE[i % DEPARTMENT_PALETTE.length]);
    return map;
};

// --- Main Component ---
export default function EventDisplay({ data = [] }) {

    // 1. Process Data
    const { mode, formattedData, colorMap } = useMemo(() => {
        if (!data || data.length === 0) return { mode: 'empty', formattedData: [] };

        const isSingleDay = data[0].hasOwnProperty("eventName");
        const depts = [...new Set(data.map((d) => d.department || "Unknown"))];

        if (isSingleDay) {
            return { mode: 'single', formattedData: data, colorMap: getDepartmentColors(depts) };
        } else {
            return {
                mode: 'range',
                formattedData: data.map(i => ({
                    name: i.className,
                    department: i.department || "Unknown",
                    events_count: i.count
                })),
                colorMap: getDepartmentColors(depts)
            };
        }
    }, [data]);

    if (mode === 'empty') {
        return (
            <div className="w-full h-48 bg-gray-50 border-dashed border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                No events found.
            </div>
        );
    }

    // 2. Single Day View (Cards)
    if (mode === 'single') {
        return (
            <div className="w-full bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-bold mb-4">📅 Today's Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formattedData.map((item, idx) => (
                        <div key={idx} className="border-l-4 border bg-gray-50 p-4 rounded shadow-sm"
                            style={{ borderColor: colorMap[item.department] }}>
                            <h3 className="font-bold">{item.className}</h3>
                            <p className="text-sm text-gray-500">{item.department}</p>
                            <p className="mt-2 text-blue-600 font-medium">{item.eventName}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 3. Range View (Chart) - FIXED VISUALS FOR MD+ SCREENS

    // Logic: 
    // If we have few items (<= 6), we CENTER the chart and give it a fixed width.
    // If we have many items (> 6), we allow it to overflow and scroll.
    const isScrollable = formattedData.length > 6;

    // 120px per bar gives them room to breathe without being huge
    const calculatedWidth = formattedData.length * 120;

    const maxVal = formattedData.reduce((m, i) => Math.max(m, i.events_count), 0);
    const yDomain = [0, maxVal < 5 ? 5 : maxVal + 2];

    return (
        <div className="w-full bg-white p-4 rounded-xl shadow border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-lg font-bold text-gray-800">📊 Event Frequency</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Total: {formattedData.length}
                </span>
            </div>


            <div className={`w-full flex ${isScrollable ? 'overflow-x-auto justify-start' : 'overflow-hidden justify-center'}`}>


                <div style={{ width: Math.max(calculatedWidth, 300), height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                            barCategoryGap="20%" // Tighter gap looks better
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis domain={yDomain} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />

                            <Bar
                                dataKey="events_count"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={60} // Prevents bars from becoming excessively fat
                            >
                                {formattedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colorMap[entry.department] || "#888"} />
                                ))}
                                <LabelList dataKey="events_count" position="top" style={{ fill: "#666", fontSize: 12, fontWeight: "bold" }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                {Object.keys(colorMap).map(dept => (
                    <div key={dept} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: colorMap[dept] }}></span>
                        <span className="text-xs font-medium text-gray-600">{dept}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}