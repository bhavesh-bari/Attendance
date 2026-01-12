"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ================= CELL ================= */
const Cell = ({ value }) => (
    <td
        className={`border p-2 text-center ${value === "-" ? "bg-red-100 text-red-700 font-semibold" : ""
            }`}
    >
        {value}
    </td>
);

/* ================= MAIN ================= */
export default function AttendanceTable() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ================= FILTER STATE ================= */
    const [department, setDepartment] = useState("ALL");
    const [period, setPeriod] = useState("overall");
    const [date, setDate] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    /* ================= FETCH ================= */
    const fetchData = async () => {
        setLoading(true);

        const params = new URLSearchParams();
        if (department !== "ALL") params.append("department", department);
        params.append("period", period);

        if (period === "date" && date) params.append("date", date);
        if (period === "range" && from && to) {
            params.append("from", from);
            params.append("to", to);
        }

        const res = await fetch(`/api/table?${params.toString()}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= EXPORT ================= */
    const exportExcel = () => {
        if (!data) return;

        const rows = data.rows.map(r => {
            const obj = { Row: r.label };
            data.columns.forEach(col => {
                obj[`${col} P`] = r.data[col]?.P ?? "-";
                obj[`${col} %`] = r.data[col]?.["%"] ?? "-";
            });
            return obj;
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");
        const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([buf]), "Attendance_Report.xlsx");
    };

    /* ================= RENDER ================= */
    return (
        <div className="md:ml-20 bg-gray-50 p-4">
            <h1 className="text-xl font-bold mb-4">
                Department Attendance Report
            </h1>

            {/* ================= FILTER UI ================= */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                <select
                    className="border p-2 rounded"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                >
                    <option value="ALL">All Departments</option>
                    <option value="MECH">MECH</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="AI_DS">AI_DS</option>
                    <option value="FE">FE</option>
                </select>

                <select
                    className="border p-2 rounded"
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                >
                    <option value="overall">Overall</option>
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                    <option value="date">Single Date</option>
                    <option value="range">Date Range</option>
                </select>

                {period === "date" && (
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                )}

                {period === "range" && (
                    <>
                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                        />
                    </>
                )}

                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white rounded px-3"
                >
                    Apply
                </button>

                <button
                    onClick={exportExcel}
                    className="bg-green-600 text-white rounded px-3"
                >
                    Export
                </button>
            </div>

            {/* ================= TABLE ================= */}
            {loading && <p>Loading...</p>}

            {data && (
                <div className="overflow-x-auto rounded-lg shadow-xl">
                    <table className="w-full border-collapse bg-white text-sm">
                        <thead>
                            <tr className="bg-blue-800 text-white text-center">
                                <th rowSpan={2} className="border p-2">#</th>
                                <th rowSpan={2} className="border p-2">Department</th>

                                {data.columns.map(col => (
                                    <th key={col} colSpan={2} className="border p-2">
                                        {col}
                                    </th>
                                ))}
                            </tr>

                            <tr className="bg-blue-600 text-white text-center">
                                {data.columns.map(col => (
                                    <React.Fragment key={col}>
                                        <th className="border p-2">P</th>
                                        <th className="border p-2">%</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {data.rows.map((row, idx) => (
                                <tr key={row.rowKey} className="hover:bg-gray-50">
                                    <td className="border p-2 text-center">{idx + 1}</td>
                                    <td className="border p-2 font-semibold">{row.label}</td>

                                    {data.columns.map(col => (
                                        <React.Fragment key={col}>
                                            <Cell value={row.data[col]?.P ?? "-"} />
                                            <Cell value={row.data[col]?.["%"] ?? "-"} />
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-sm text-gray-500 mt-3">
                * Red cells indicate missing attendance data.
            </p>
        </div>
    );
}
