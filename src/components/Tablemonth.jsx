"use client";
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const departments = [
    {
        id: 1,
        name: "Computer Engg",
        SEA_P: 39, SEA_PCT: 55.71,
        SEB_P: 45, SEB_PCT: 67.16,
        TEA_P: 5, TEA_PCT: 7.04,
        TEB_P: 20, TEB_PCT: 30.30,
        BEA_P: 0, BEA_PCT: 0.00,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 109, TOTAL_PCT: 31.96,
    },
    {
        id: 2,
        name: "AFT Computer Engg",
        SEA_P: 13, SEA_PCT: 18.57,
        SEB_P: 13, SEB_PCT: 19.40,
        TEA_P: 5, TEA_PCT: 7.04,
        TEB_P: 3, TEB_PCT: 4.55,
        BEA_P: "-", BEA_PCT: 0.00,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 34, TOTAL_PCT: 9.97,
    },
    {
        id: 3,
        name: "Mechanical Engg",
        SEA_P: 35, SEA_PCT: 56.45,
        SEB_P: 32, SEB_PCT: 68.09,
        TEA_P: 22, TEA_PCT: 34.92,
        TEB_P: "-", TEB_PCT: "-",
        BEA_P: 0, BEA_PCT: 0.00,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 89, TOTAL_PCT: 38.03,
    },
    {
        id: 4,
        name: "AFT Mechanical Engg",
        SEA_P: 26, SEA_PCT: 41.94,
        SEB_P: 28, SEB_PCT: 59.57,
        TEA_P: 20, TEA_PCT: 31.75,
        TEB_P: "-", TEB_PCT: "-",
        BEA_P: 0, BEA_PCT: 0.00,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 74, TOTAL_PCT: 31.62,
    },
    {
        id: 5,
        name: "Civil Engg",
        SEA_P: 50, SEA_PCT: 100.0,
        SEB_P: 42, SEB_PCT: 85.71,
        TEA_P: 17, TEA_PCT: 30.36,
        TEB_P: 14, TEB_PCT: 25.45,
        BEA_P: 18, BEA_PCT: 24.00,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 141, TOTAL_PCT: 61.30,
    },
    {
        id: 6,
        name: "AFT Civil Engg",
        SEA_P: "-", SEA_PCT: 0.00,
        SEB_P: "-", SEB_PCT: 0.00,
        TEA_P: "-", TEA_PCT: 0.00,
        TEB_P: "-", TEB_PCT: 0.00,
        BEA_P: "-", BEA_PCT: 0.00,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 0, TOTAL_PCT: 0.00,
    },
    {
        id: 7,
        name: "E & Tc Engg",
        SEA_P: 42, SEA_PCT: 66.67,
        SEB_P: "-", SEB_PCT: "-",
        TEA_P: 20, TEA_PCT: 30.77,
        TEB_P: "-", TEB_PCT: "-",
        BEA_P: 16, BEA_PCT: 26.67,
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 78, TOTAL_PCT: 41.05,
    },
    {
        id: 8,
        name: "AFT E & TC Engg",
        SEA_P: 38, SEA_PCT: 60.32,
        SEB_P: "-", SEB_PCT: "-",
        TEA_P: 12, TEA_PCT: 18.46,
        TEB_P: "-", TEB_PCT: 0.00,
        BEA_P: "-", BEA_PCT: "-",
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 50, TOTAL_PCT: 81.97,
    },
    {
        id: 9,
        name: "AI & DS Engg",
        SEA_P: 38, SEA_PCT: 60.32,
        SEB_P: "-", SEB_PCT: "-",
        TEA_P: 26, TEA_PCT: 41.94,
        TEB_P: "-", TEB_PCT: "-",
        BEA_P: "-", BEA_PCT: "-",
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 64, TOTAL_PCT: 104.92,
    },
    {
        id: 10,
        name: "AFT AI & DS Engg",
        SEA_P: 46, SEA_PCT: 73.02,
        SEB_P: "-", SEB_PCT: "-",
        TEA_P: 5, TEA_PCT: 8.06,
        TEB_P: "-", TEB_PCT: "-",
        BEA_P: "-", BEA_PCT: "-",
        BEB_P: "-", BEB_PCT: "-",
        TOTAL_P: 51, TOTAL_PCT: 40.80,
    },
    { id: 11, name: "MCA", SEA_P: 34, SEA_PCT: 80.95, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 34, TOTAL_PCT: 50.0 },
    { id: 13, name: "MBA", SEA_P: 48, SEA_PCT: 70.59, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 48, TOTAL_PCT: 70.59 },
    { id: 14, name: "AFT MBA", SEA_P: 43, SEA_PCT: 63.24, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 43, TOTAL_PCT: 63.24 },
    { id: 15, name: "FE-A", SEA_P: 51, SEA_PCT: 75.0, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 51, TOTAL_PCT: 75 },
    { id: 16, name: "AFT FE-A", SEA_P: 56, SEA_PCT: 82.35, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 56, TOTAL_PCT: 82.35 },
    { id: 17, name: "FE-B", SEA_P: 46, SEA_PCT: 75.41, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 46, TOTAL_PCT: 75.41 },
    { id: 18, name: "AFT FE-B", SEA_P: 48, SEA_PCT: 78.69, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 48, TOTAL_PCT: 78.69 },
    { id: 19, name: "FE-C", SEA_P: 47, SEA_PCT: 78.33, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 47, TOTAL_PCT: 78.33 },
    { id: 20, name: "AFT FE-C", SEA_P: 46, SEA_PCT: 76.67, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 46, TOTAL_PCT: 76.67 },
    { id: 21, name: "FE-D", SEA_P: 45, SEA_PCT: 80.36, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 45, TOTAL_PCT: 80.36 },
    { id: 22, name: "AFT FE-D", SEA_P: 43, SEA_PCT: 76.79, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 43, TOTAL_PCT: 76.79 },
    { id: 23, name: "FE-E", SEA_P: 59, SEA_PCT: 86.76, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 59, TOTAL_PCT: 86.76 },
    { id: 24, name: "AFT FE-E", SEA_P: 57, SEA_PCT: 83.82, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 57, TOTAL_PCT: 83.82 },
    { id: 25, name: "FE-F", SEA_P: 51, SEA_PCT: 76.12, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 51, TOTAL_PCT: 76.12 },
    { id: 26, name: "AFT FE-F", SEA_P: 54, SEA_PCT: 80.6, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 54, TOTAL_PCT: 80.6 },
    { id: 27, name: "FE-G", SEA_P: 48, SEA_PCT: 85.71, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 48, TOTAL_PCT: 85.71 },
    { id: 28, name: "AFT FE-G", SEA_P: 47, SEA_PCT: 83.93, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 47, TOTAL_PCT: 83.93 },
    { id: 29, name: "FE-H", SEA_P: 45, SEA_PCT: 77.59, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 45, TOTAL_PCT: 77.59 },
    { id: 30, name: "AFT FE-H", SEA_P: 47, SEA_PCT: 81.03, SEB_P: "-", SEB_PCT: "-", TEA_P: "-", TEB_P: "-", BEA_P: "-", BEB_P: "-", TOTAL_P: 47, TOTAL_PCT: 81.03 },
];

const cell = (value) => (
    <td
        className={`border p-2 text-center ${value === "-" ? "bg-red-100 text-red-700 font-semibold" : ""
            }`}
    >
        {value}
    </td>
);

export default function GroupedAttendanceTable() {
    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(departments);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");
        const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([buf]), "Attendance_Report.xlsx");
    };

    return (
        <div className="md:ml-20 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Department Attendance Report</h1>
                <button
                    onClick={exportExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow"
                >
                    Export Excel
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-xl">
                <table className="w-full border-collapse bg-white text-sm">
                    <thead>
                        <tr className="bg-blue-700 text-white text-center">
                            <th rowSpan={2} className="border p-2 w-12">Sr</th>
                            <th rowSpan={2} className="border p-2 w-48">Department</th>

                            {/* SE */}
                            <th colSpan={2} className="border p-2 bg-blue-800">SE-A</th>
                            <th colSpan={2} className="border p-2 bg-blue-800">SE-B</th>

                            {/* TE */}
                            <th colSpan={2} className="border p-2 bg-blue-800">TE-A</th>
                            <th colSpan={2} className="border p-2 bg-blue-800">TE-B</th>

                            {/* BE */}
                            <th colSpan={2} className="border p-2 bg-blue-800">BE-A</th>
                            <th colSpan={2} className="border p-2 bg-blue-800">BE-B</th>

                            {/* TOTAL */}
                            <th colSpan={2} className="border p-2 bg-blue-900">TOTAL</th>
                        </tr>

                        <tr className="bg-blue-600 text-white text-center">
                            {/* SE-A */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>

                            {/* SE-B */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>

                            {/* TE-A */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>

                            {/* TE-B */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>

                            {/* BE-A */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>

                            {/* BE-B */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>

                            {/* TOTAL */}
                            <th className="border p-2">P</th>
                            <th className="border p-2">%</th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-50 whitespace-nowrap">
                                <td className="border p-2 text-center">{d.id}</td>
                                <td className="border p-2 font-semibold">{d.name}</td>

                                {cell(d.SEA_P)} {cell(d.SEA_PCT)}
                                {cell(d.SEB_P)} {cell(d.SEB_PCT)}
                                {cell(d.TEA_P)} {cell(d.TEA_PCT)}
                                {cell(d.TEB_P)} {cell(d.TEB_PCT)}
                                {cell(d.BEA_P)} {cell(d.BEA_PCT)}
                                {cell(d.BEB_P)} {cell(d.BEB_PCT)}
                                {cell(d.TOTAL_P)} {cell(d.TOTAL_PCT)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-sm text-gray-500 mt-3">
                * Red cells indicate missing attendance values.
            </p>
        </div>
    );
}
