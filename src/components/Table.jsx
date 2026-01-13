"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Loader2 } from "lucide-react";


const getColumnKey = (colName) => {
    const lower = colName.toLowerCase().replace("-", "");
    return lower;
};

export default function DepartmentDailyEventsTable() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch for "today" to get daily status
                const res = await fetch("/api/table?period=today");
                const data = await res.json();

                if (data.success) {
                    processApiData(data.rows);
                } else {
                    setError("Failed to load data");
                }
            } catch (err) {
                console.error(err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Transform API Data: Merge Morning/Afternoon rows into single Department rows
    const processApiData = (apiRows) => {
        const deptMap = {};

        apiRows.forEach((row) => {
            // Extract Dept Name (e.g., "Computer Engg Morning" -> "Computer Engg")
            const deptName = row.label.replace(/ Morning| Afternoon/gi, "").trim();

            if (!deptMap[deptName]) {
                deptMap[deptName] = {
                    id: Object.keys(deptMap).length + 1,
                    name: deptName,
                    fe: 0, sea: 0, seb: 0, tea: 0, teb: 0, bea: 0, beb: 0,
                    strength: 0, // Note: API doesn't return static strength, we will sum present count for now or leave 0
                };
            }

            // Iterate through columns (SE-A, TE-B, etc.) in the row data
            Object.entries(row.data).forEach(([colKey, cellData]) => {
                if (colKey === "TOTAL") return; // Skip total for now

                const uiKey = getColumnKey(colKey); // Map "SE-A" -> "sea"

                // If the key exists in our template, sum the attendance
                if (deptMap[deptName].hasOwnProperty(uiKey)) {
                    // Check if cellData has a value (API returns { P: 0, "%": 0 } or "-")
                    const count = typeof cellData.P === "number" ? cellData.P : 0;

                    // Add to existing count (merging Morning + Afternoon)
                    deptMap[deptName][uiKey] = (deptMap[deptName][uiKey] || 0) + count;
                }
            });
        });

        // Convert Map to Array
        setTableData(Object.values(deptMap));
    };

    const exportToExcel = () => {
        const worksheetData = tableData.map((dept) => ({
            "Sr. No": dept.id,
            "Department Name": dept.name,
            "FE": dept.fe || "-",
            "SEA": dept.sea || "-",
            "SEB": dept.seb || "-",
            "TEA": dept.tea || "-",
            "TEB": dept.teb || "-",
            "BEA": dept.bea || "-",
            "BEB": dept.beb || "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daily_Events_Status");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Daily_Status.xlsx");
    };

    // Helper: If count is 0, show "-", else show count
    // Note: Since API doesn't return Event Names, we only show numbers here.
    const renderCellContent = (content) => {
        if (content === 0 || content === "0") return "-";
        return <span className="font-semibold text-gray-700">{content}</span>;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-blue-600 mr-2" /> Loading Data...
        </div>
    );

    if (error) return (
        <div className="p-6 text-red-500 bg-red-50 min-h-screen flex items-center justify-center">
            {error}
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen md:ml-16">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Daily Attendance Status</h1>
                <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                >
                    Export as Excel
                </button>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg hide-scrollbar border border-gray-200">
                <table className="w-full border-collapse bg-white text-sm text-gray-700">
                    <thead className="bg-blue-600 text-white text-center sticky top-0 z-10">
                        <tr>
                            <th className="p-3 border border-blue-500">Sr. No</th>
                            <th className="p-3 border border-blue-500 text-left">Department Name</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">FE</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">SEA</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">SEB</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">TEA</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">TEB</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">BEA</th>
                            <th className="p-3 border border-blue-500 bg-blue-700">BEB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="p-8 text-center text-gray-500">
                                    No attendance records found for today.
                                </td>
                            </tr>
                        ) : (
                            tableData.map((dept, index) => (
                                <tr key={dept.id} className="hover:bg-blue-50 text-center border-b transition-colors">
                                    <td className="p-3 border">{index + 1}</td>
                                    <td className="p-3 border text-left font-medium text-gray-800">{dept.name}</td>
                                    <td className="p-3 border">{renderCellContent(dept.fe)}</td>
                                    <td className="p-3 border">{renderCellContent(dept.sea)}</td>
                                    <td className="p-3 border">{renderCellContent(dept.seb)}</td>
                                    <td className="p-3 border">{renderCellContent(dept.tea)}</td>
                                    <td className="p-3 border">{renderCellContent(dept.teb)}</td>
                                    <td className="p-3 border">{renderCellContent(dept.bea)}</td>
                                    <td className="p-3 border">{renderCellContent(dept.beb)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-sm text-gray-500 italic">
                * Values represent the total present count (Morning + Afternoon).
            </p>
        </div>
    );
}