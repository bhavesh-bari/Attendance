"use client";

import React, { useEffect, useState } from "react";

import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { Loader2, Download, Filter, Info } from "lucide-react";

const Cell = ({ value, type }) => {
    const isMissing = value === "-";
    const isLowAttendance = type === "%" && typeof value === 'number' && value < 50;

    let className = "border p-2 text-center text-sm align-middle ";

    if (type === 'event') {
        className += "text-xs italic text-gray-500 max-w-[120px] break-words";
    } else if (isMissing) {
        className += "bg-gray-50 text-gray-400 font-light";
    } else if (isLowAttendance) {
        className += "bg-red-50 text-red-600 font-bold";
    } else {
        className += "text-gray-700 font-medium";
    }

    return <td className={className}>{value || "-"}</td>;
};

/* ================= MAIN COMPONENT ================= */
export default function AttendanceTable() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availableDepts, setAvailableDepts] = useState([]);

    /* ================= FILTER STATE ================= */
    const [department, setDepartment] = useState("ALL");
    const [year, setYear] = useState("ALL");
    const [period, setPeriod] = useState("today");
    const [showEvents, setShowEvents] = useState(false);
    const [date, setDate] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const isSingleDay = period === "today" || period === "date";
    const shouldShowEvents = isSingleDay && showEvents;

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (department !== "ALL") params.append("department", department);
        if (year !== "ALL") params.append("year", year);
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
        if (!isSingleDay) setShowEvents(false);
    }, []);


    /* ================= EXPORT TO EXCEL  ================= */
    const exportExcel = () => {
        if (!data || !data.rows.length) return;

        // --- 1. Define Styles ---
        const styles = {
            // Main Header (Dark Blue)
            headerMain: {
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                fill: { fgColor: { rgb: "1E3A8A" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    bottom: { style: "medium", color: { rgb: "FFFFFF" } },
                    right: { style: "thin", color: { rgb: "FFFFFF" } }
                }
            },
            // Sub Header (Light Blue)
            headerSub: {
                font: { bold: true, color: { rgb: "1E3A8A" } },
                fill: { fgColor: { rgb: "DBEAFE" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    bottom: { style: "medium", color: { rgb: "1E3A8A" } },
                    right: { style: "thin", color: { rgb: "FFFFFF" } }
                }
            },
            // Department Column (Left Aligned, Bold)
            cellDept: {
                font: { bold: true, color: { rgb: "111827" } },
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                    right: { style: "medium", color: { rgb: "E5E7EB" } },
                    bottom: { style: "thin", color: { rgb: "E5E7EB" } }
                }
            },
            // Count Column (Standard White)
            cellCount: {
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    right: { style: "thin", color: { rgb: "E5E7EB" } },
                    bottom: { style: "thin", color: { rgb: "E5E7EB" } }
                }
            },
            // Percentage Column (Light Gray Background)
            cellPercent: {
                fill: { fgColor: { rgb: "F3F4F6" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    right: { style: "thin", color: { rgb: "E5E7EB" } },
                    bottom: { style: "thin", color: { rgb: "E5E7EB" } }
                }
            },
            // Event Column (Light Orange Background)
            cellEvent: {
                font: { italic: true, color: { rgb: "4B5563" }, sz: 10 },
                fill: { fgColor: { rgb: "FFF7ED" } },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: {
                    right: { style: "medium", color: { rgb: "E5E7EB" } }, // Thicker border after group
                    bottom: { style: "thin", color: { rgb: "E5E7EB" } }
                }
            },
            // Alert Style (Red for Low Attendance)
            cellLowAttendance: {
                font: { bold: true, color: { rgb: "DC2626" } },
                fill: { fgColor: { rgb: "FEE2E2" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: { bottom: { style: "thin", color: { rgb: "E5E7EB" } } }
            }
        };

        // --- 2. Build Data Arrays ---
        const headerRow1 = ["Department / Shift"];
        const headerRow2 = [""];
        const merges = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }];

        let colIndex = 1;

        data.columns.forEach(col => {
            headerRow1.push(col);

            if (shouldShowEvents) {
                headerRow1.push("", "");
                headerRow2.push("Count", "%", "Event");
                merges.push({ s: { r: 0, c: colIndex }, e: { r: 0, c: colIndex + 2 } });
                colIndex += 3;
            } else {
                headerRow1.push("");
                headerRow2.push("Count", "%");
                merges.push({ s: { r: 0, c: colIndex }, e: { r: 0, c: colIndex + 1 } });
                colIndex += 2;
            }
        });

        // --- 3. Create Sheet ---
        const wsData = [headerRow1, headerRow2];

        data.rows.forEach(row => {
            const rowData = [row.label];
            data.columns.forEach(col => {
                const cellData = row.data[col] || { P: "-", "%": "-", eventName: "-" };
                rowData.push(cellData.P);
                rowData.push(cellData["%"]);
                if (shouldShowEvents) rowData.push(cellData.eventName || "-");
            });
            wsData.push(rowData);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // --- 4. Apply Styling Logic ---
        const range = XLSX.utils.decode_range(ws['!ref']);

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellRef]) continue;

                // --- HEADERS ---
                if (R === 0) {
                    ws[cellRef].s = styles.headerMain;
                }
                else if (R === 1) {
                    ws[cellRef].s = styles.headerSub;
                }
                // --- DATA ROWS ---
                else {
                    const cellVal = ws[cellRef].v;

                    // Column Logic
                    if (C === 0) {
                        // Department Column
                        ws[cellRef].s = styles.cellDept;
                    } else {
                        // Data Columns
                        const effectiveColIndex = C - 1;
                        const groupSize = shouldShowEvents ? 3 : 2;
                        const mod = effectiveColIndex % groupSize;

                        let appliedStyle = {};

                        if (mod === 0) {
                            // 1. Count Column
                            appliedStyle = { ...styles.cellCount };
                        } else if (mod === 1) {
                            // 2. Percentage Column
                            // Check for Low Attendance Warning
                            if (typeof cellVal === 'number' && cellVal < 50) {
                                appliedStyle = { ...styles.cellLowAttendance };
                            } else {
                                appliedStyle = { ...styles.cellPercent };
                            }
                        } else if (mod === 2) {
                            // 3. Event Column
                            appliedStyle = { ...styles.cellEvent };
                        }

                        // Apply a thicker right border to the last column of a group
                        if ((mod === 1 && !shouldShowEvents) || (mod === 2 && shouldShowEvents)) {
                            appliedStyle.border = {
                                ...appliedStyle.border,
                                right: { style: "medium", color: { rgb: "D1D5DB" } } // Thicker Grey Separator
                            };
                        }

                        ws[cellRef].s = appliedStyle;
                    }
                }
            }
        }

        // --- 5. Finalize Layout ---
        ws['!merges'] = merges;

        const wscols = [{ wch: 35 }]; // Wide Dept Column
        data.columns.forEach(() => {
            if (shouldShowEvents) {
                wscols.push({ wch: 8 }, { wch: 8 }, { wch: 25 });
            } else {
                wscols.push({ wch: 8 }, { wch: 8 });
            }
        });
        ws['!cols'] = wscols;

        // --- 6. Save ---
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
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

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    {/* Dept */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                        <select className="border border-gray-300 bg-white p-2 rounded-lg text-sm min-w-[150px]"
                            value={department} onChange={e => setDepartment(e.target.value)}>
                            <option value="ALL">All Departments</option>
                            {availableDepts.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Year</label>
                        <select className="border border-gray-300 bg-white p-2 rounded-lg text-sm min-w-[100px]"
                            value={year} onChange={e => setYear(e.target.value)}>
                            <option value="ALL">All Years</option>
                            <option value="FE">FE</option>
                            <option value="SE">SE</option>
                            <option value="TE">TE</option>
                            <option value="BE">BE</option>
                        </select>
                    </div>

                    {/* Period */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Time Period</label>
                        <select className="border border-gray-300 bg-white p-2 rounded-lg text-sm min-w-[150px]"
                            value={period} onChange={e => {
                                setPeriod(e.target.value);
                                if (e.target.value !== 'today' && e.target.value !== 'date') setShowEvents(false);
                            }}>
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
                            <input type="date" className="border border-gray-300 p-2 rounded-lg text-sm"
                                value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                    )}
                    {period === "range" && (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase">From</label>
                                <input type="date" className="border border-gray-300 p-2 rounded-lg text-sm"
                                    value={from} onChange={e => setFrom(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase">To</label>
                                <input type="date" className="border border-gray-300 p-2 rounded-lg text-sm"
                                    value={to} onChange={e => setTo(e.target.value)} />
                            </div>
                        </>
                    )}

                    {/* Show Events Radio */}
                    {isSingleDay && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Show Event Name</label>
                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                                <label className="flex items-center gap-1 px-2 cursor-pointer">
                                    <input type="radio" name="showEvents" checked={showEvents === true} onChange={() => setShowEvents(true)} className="w-3 h-3 accent-blue-600" />
                                    <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-1 px-2 cursor-pointer">
                                    <input type="radio" name="showEvents" checked={showEvents === false} onChange={() => setShowEvents(false)} className="w-3 h-3 accent-blue-600" />
                                    <span className="text-sm">No</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Filter size={16} />} Apply
                        </button>
                        <button onClick={exportExcel} disabled={!data} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                            <Download size={16} /> Export Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <p>Loading records...</p>
                </div>
            ) : !data || data.rows.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500 shadow-sm">
                    No data found.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hide-scrollbar">
                    <div className="overflow-x-auto custom-scrollbar hide-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                                    <th rowSpan={2} className="p-3 border-r border-gray-700 text-left min-w-[50px]">#</th>
                                    <th rowSpan={2} className="p-3 border-r border-gray-700 text-left min-w-[200px] sticky left-0 bg-gray-800 z-10">Department / Shift</th>
                                    {data.columns.map(col => (
                                        <th key={col} colSpan={shouldShowEvents ? 3 : 2} className="p-3 border-r border-gray-700 text-center font-bold">{col}</th>
                                    ))}
                                </tr>
                                <tr className="bg-gray-700 text-gray-200 text-xs">
                                    {data.columns.map(col => (
                                        <React.Fragment key={col}>
                                            <th className="p-2 border-r border-gray-600 w-16 text-center">Count</th>
                                            <th className="p-2 border-r border-gray-600 w-16 text-center">%</th>
                                            {shouldShowEvents && <th className="p-2 border-r border-gray-600 w-24 text-center">Event</th>}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.rows.map((row, idx) => (
                                    <tr key={row.rowKey} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-3 text-center text-gray-500 border-r">{idx + 1}</td>
                                        <td className="p-3 font-semibold text-gray-800 border-r sticky left-0 bg-white shadow-sm">{row.label}</td>
                                        {data.columns.map(col => {
                                            const cellData = row.data[col] || { P: "-", "%": "-", eventName: "-" };
                                            return (
                                                <React.Fragment key={col}>
                                                    <Cell value={cellData.P} type="count" />
                                                    <Cell value={cellData["%"]} type="%" />
                                                    {shouldShowEvents && <Cell value={cellData.eventName} type="event" />}
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
                <p><span className="font-semibold">Note:</span> For <b>Month</b>, <b>Overall</b>, and <b>Date Range</b>, the <b>Present Count</b> represents an <b>average per day</b>.</p>
            </div>
        </div>
    );
}