"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Loader2, Download, Filter } from "lucide-react";
import { Info } from "lucide-react";
/* ================= CELL COMPONENT ================= */
const Cell = ({ value, type }) => {
    const isMissing = value === "-";
    const isLowAttendance = type === "%" && typeof value === 'number' && value < 50;

    let className = "border p-2 text-center text-sm ";
    if (isMissing) {
        className += "bg-gray-50 text-gray-400 font-light";
    } else if (isLowAttendance) {
        className += "bg-red-50 text-red-600 font-bold";
    } else {
        className += "text-gray-700 font-medium";
    }

    return <td className={className}>{value}</td>;
};

/* ================= MAIN COMPONENT ================= */
export default function AttendanceTable() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availableDepts, setAvailableDepts] = useState([]);

    /* ================= FILTER STATE ================= */
    const [department, setDepartment] = useState("ALL");
    const [year, setYear] = useState("ALL"); // <--- NEW STATE
    const [period, setPeriod] = useState("today");
    const [date, setDate] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
        setLoading(true);

        const params = new URLSearchParams();
        if (department !== "ALL") params.append("department", department);
        if (year !== "ALL") params.append("year", year); // <--- PASS PARAM
        params.append("period", period);

        if (period === "date" && date) params.append("date", date);
        if (period === "range" && from && to) {
            params.append("from", from);
            params.append("to", to);
        }

        try {
            const res = await fetch(`/api/table?${params.toString()}`);
            const json = await res.json();

            if (json.success) {
                setData(json);
                if (json.departments) setAvailableDepts(json.departments);
            }
        } catch (error) {
            console.error("Failed to fetch table data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= EXPORT TO EXCEL ================= */
    const exportExcel = () => {
        if (!data || !data.rows.length) return;

        const rows = data.rows.map(r => {
            const obj = { "Shift/Dept": r.label };
            data.columns.forEach(col => {
                const cellData = r.data[col] || { P: "-", "%": "-" };
                obj[`${col} (Count)`] = cellData.P;
                obj[`${col} (%)`] = cellData["%"];
            });
            return obj;
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        const wscols = Object.keys(rows[0]).map(k => ({ wch: k.length + 5 }));
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance_Report");
        const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([buf]), `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    /* ================= RENDER ================= */
    return (
        <div className="p-6 bg-gray-50 min-h-screen md:ml-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Detailed Attendance Report
                    </h1>
                    <p className="text-sm text-gray-500">View attendance metrics by department, year, and shift.</p>
                </div>
            </div>

            {/* ================= FILTER TOOLBAR ================= */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-wrap items-end gap-4">

                    {/* Department Dropdown */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                        <select
                            className="border border-gray-300 bg-white text-gray-700 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                        >
                            <option value="ALL">All Departments</option>
                            {availableDepts.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* NEW: Year Dropdown */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Year</label>
                        <select
                            className="border border-gray-300 bg-white text-gray-700 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[100px]"
                            value={year}
                            onChange={e => setYear(e.target.value)}
                        >
                            <option value="ALL">All Years</option>
                            <option value="FE">FE</option>
                            <option value="SE">SE</option>
                            <option value="TE">TE</option>
                            <option value="BE">BE</option>
                        </select>
                    </div>

                    {/* Period Dropdown */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Time Period</label>
                        <select
                            className="border border-gray-300 bg-white text-gray-700 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
                            value={period}
                            onChange={e => setPeriod(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="overall">Overall</option>
                            <option value="month">This Month</option>
                            <option value="date">Single Date</option>
                            <option value="range">Date Range</option>
                        </select>
                    </div>

                    {/* Conditional Date Inputs */}
                    {period === "date" && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Select Date</label>
                            <input
                                type="date"
                                className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                    )}

                    {period === "range" && (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase">From</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={from}
                                    onChange={e => setFrom(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase">To</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={to}
                                    onChange={e => setTo(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Filter size={16} />}
                            Apply Filter
                        </button>

                        <button
                            onClick={exportExcel}
                            disabled={!data}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            <Download size={16} />
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= DATA TABLE ================= */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <p>Loading records...</p>
                </div>
            ) : !data || data.rows.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500 shadow-sm">
                    No data found for the selected criteria.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hide-scrollbar">
                    <div className="overflow-x-auto custom-scrollbar hide-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                {/* Top Header: Years/Divisions */}
                                <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                                    <th rowSpan={2} className="p-3 border-r border-gray-700 text-left min-w-[50px]">#</th>
                                    <th rowSpan={2} className="p-3 border-r border-gray-700 text-left min-w-[200px] sticky left-0 bg-gray-800 z-10">Department / Shift</th>

                                    {data.columns.map(col => (
                                        <th key={col} colSpan={2} className="p-3 border-r border-gray-700 text-center font-bold">
                                            {col}
                                        </th>
                                    ))}
                                </tr>

                                {/* Sub Header: P vs % */}
                                <tr className="bg-gray-700 text-gray-200 text-xs">
                                    {data.columns.map(col => (
                                        <React.Fragment key={col}>
                                            <th className="p-2 border-r border-gray-600 w-16 text-center">Count</th>
                                            <th className="p-2 border-r border-gray-600 w-16 text-center">%</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {data.rows.map((row, idx) => (
                                    <tr key={row.rowKey} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-3 text-center text-gray-500 border-r">{idx + 1}</td>
                                        <td className="p-3 font-semibold text-gray-800 border-r sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            {row.label}
                                        </td>
                                        {data.columns.map(col => {
                                            const cellData = row.data[col] || { P: "-", "%": "-" };
                                            return (
                                                <React.Fragment key={col}>
                                                    <Cell value={cellData.P} type="count" />
                                                    <Cell value={cellData["%"]} type="%" />
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            <div className="mt-4 flex items-start gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                    <span className="font-semibold">Note:</span> For <b>Month</b>, <b>Overall</b>,
                    and <b>Date Range</b>, the <b>Present Count</b> represents an
                    <b> average per day</b>.
                </p>
            </div>

        </div>
    );
}