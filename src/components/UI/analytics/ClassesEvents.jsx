"use client";
import React, { useState, useMemo, useRef } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Sector
} from "recharts";

const COLORS = [
    "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6",
    "#8b5cf6", "#14b8a6", "#f43f5e", "#06b6d4", "#84cc16",
    "#fbbf24", "#d946ef", "#a855f7", "#64748b", "#ec4899",
    "#0ea5e9", "#22c55e", "#f97316", "#71717a", "#475569"
];

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 2}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

export default function ClassesEvents({ department, events = [] }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const detailsRef = useRef(null);

    // --- DATA PROCESSING ---
    const { chartData, groupedEvents, colorMap } = useMemo(() => {
        const counts = {};
        const groups = {};

        events.forEach(event => {
            const classList = Array.isArray(event.classes) ? event.classes : [event.classes];

            classList.forEach(className => {
                if (!className) return;

                // Count for Pie
                counts[className] = (counts[className] || 0) + 1;

                // Group for Detail Cards
                if (!groups[className]) groups[className] = [];
                groups[className].push(event);
            });
        });

        const sortedClasses = Object.keys(counts).sort();
        const mapping = {};
        sortedClasses.forEach((cls, index) => {
            mapping[cls] = COLORS[index % COLORS.length];
        });

        const chartData = sortedClasses.map(cls => ({
            name: cls,
            value: counts[cls]
        }));

        return { chartData, groupedEvents: groups, colorMap: mapping };
    }, [events]);

    const handleSliceClick = (data) => {
        if (data?.name) {
            setSelectedClass(data.name);
            setTimeout(() => {
                detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <p className="text-slate-500 font-medium">No class data found for {department}.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-10 antialiased text-slate-900">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                        {department}
                    </h1>
                    <p className="mt-2 text-slate-500 max-w-md">
                        Class-wise event distribution. Select a class to view their specific TimeLine.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    <span className="text-sm font-bold text-slate-700">{chartData.length} Active Classes</span>
                </div>
            </div>

            {/* --- CHART & LEGEND SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="lg:col-span-7 h-[300px] md:h-[400px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={chartData}
                                innerRadius="65%"
                                outerRadius="85%"
                                paddingAngle={5}
                                dataKey="value"
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                onClick={handleSliceClick}
                                stroke="none"
                                className="cursor-pointer"
                            >
                                {chartData.map((entry) => (
                                    <Cell
                                        key={`cell-${entry.name}`}
                                        fill={colorMap[entry.name]}
                                        className={`transition-all duration-300 ${selectedClass === entry.name ? 'opacity-100 scale-105' : 'opacity-90'}`}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                    if (active && payload?.[0]) {
                                        return (
                                            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold">
                                                {payload[0].name}: {payload[0].value} Events
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <span className="block text-4xl font-black text-slate-800 leading-none">{events.length}</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Total Events</span>
                    </div>
                </div>

                {/* --- LEGEND GRID --- */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {chartData.map((entry) => (
                        <button
                            key={entry.name}
                            onClick={() => handleSliceClick(entry)}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${selectedClass === entry.name
                                ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20'
                                : 'bg-slate-50 border-transparent hover:bg-slate-100'
                                }`}
                        >
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colorMap[entry.name] }} />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tight truncate">{entry.name}</p>
                                <p className="text-lg font-black text-slate-700 leading-none">{entry.value}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- DETAILS SECTION --- */}
            <div ref={detailsRef} className="pt-4">
                {!selectedClass ? (
                    <div className="group flex flex-col items-center justify-center p-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] transition-colors hover:bg-slate-100/50">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Class Schedules</h3>
                        <p className="text-slate-500 mt-1 text-center">Select a class segment above to view specific event details.</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center justify-between bg-white p-2 pr-6 rounded-full border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black"
                                    style={{ backgroundColor: colorMap[selectedClass] }}
                                >
                                    {selectedClass.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">Class {selectedClass}</h3>
                                    <p className="text-sm font-medium text-slate-500">{groupedEvents[selectedClass]?.length} Events Scheduled</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedClass(null)}
                                className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Clear Selection
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedEvents[selectedClass]?.map((event, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-white overflow-hidden rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                                <svg className="w-5 h-5 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="px-3 py-1 bg-cyan-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                Class Event
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 min-h-[3.5rem]">
                                            {event.event}
                                        </h4>

                                        <div className="space-y-3 pt-4 border-t border-slate-50">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Date</span>
                                                <span className="text-slate-700 font-bold">{event.date}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">
                                                    Classe
                                                </span>
                                                <div className="flex flex-wrap justify-end gap-1">
                                                    {(Array.isArray(event.classes) ? event.classes : [event.classes]).map((cls, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-2 py-0.5 text-[9px] font-bold rounded transition-colors ${cls === selectedClass
                                                                ? 'bg-amber-400 text-white'
                                                                : 'bg-slate-100 text-slate-500'
                                                                }
                                                                
                                                                `}
                                                            style={{ backgroundColor: colorMap[selectedClass] }}
                                                        >
                                                            {cls}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}