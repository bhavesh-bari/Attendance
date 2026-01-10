"use client";
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// --- UPDATED DATA STRUCTURE (Holding Event Names/Status for the Day) ---
const departments = [
    // Attendance/Event status for today (Nov 20, 2025)
    { id: 1, name: "Computer Engg", fe: "", sea: "Workshop", seb: 67, tea: "Tech Talk", teb: 66, bea: 66, beb: "", strength: 340 },
    { id: 2, name: "Mechanical Engg", fe: "", sea: 62, seb: "Industrial Visit", tea: 63, teb: "", bea: 40, beb: "", strength: 212 },
    { id: 3, name: "Civil Engg", fe: "", sea: 45, seb: "", tea: "Seminar", teb: 42, bea: "Site Visit", beb: "", strength: 180 },
    { id: 4, name: "E & Tc Engg", fe: "FY Orientation", sea: 75, seb: "", tea: 66, teb: "", bea: 60, beb: "", strength: 201 },
    { id: 5, name: "AI & DS Engg", fe: "", sea: "Code Blitz", seb: "", tea: 62, teb: "", bea: "", beb: "", strength: 134 },
    { id: 6, name: "MCA", fe: 57, sea: "", seb: "", tea: 37, teb: "", bea: "", beb: "", strength: 94 }, // Attendance data retained
    { id: 7, name: "MBA", fe: "MBA Induction", sea: "", seb: "", tea: 61, teb: "", bea: "", beb: "", strength: 61 },
    // For FE sections, using event name or just attendance for that day
    { id: 8, name: "FE-A", fe: 68, strength: 0 },
    { id: 9, name: "FE-B", fe: "Quiz Competition", strength: 0 },
    { id: 10, name: "FE-C", fe: 60, strength: 0 },
    { id: 11, name: "FE-D", fe: 56, strength: 0 },
    { id: 12, name: "FE-E", fe: "Guest Speaker", strength: 0 },
    { id: 13, name: "FE-F", fe: 67, strength: 0 },
    { id: 14, name: "FE-G", fe: 56, strength: 0 },
    { id: 15, name: "FE-H", fe: "Project Demo", strength: 0 },
];

// Helper function to render the cell content
// If the content is a string (event name), display it highlighted. Otherwise, display the number or '-'.
const renderCellContent = (content) => {
    if (typeof content === 'string' && content !== "") {
        // If it's a string, assume it's an event name
        return <span className="text-red-700 font-bold text-xs px-1 py-0.5 rounded-full bg-red-100 italic">{content}</span>;
    }
    // Otherwise, display the number or '-'
    return content || "-";
};

export default function DepartmentDailyEventsTable() {
    const exportToExcel = () => {
        // Prepare data for Excel
        const worksheetData = departments.map((dept) => ({
            "Sr. No": dept.id,
            "Department Name": dept.name,
            "FE (Event/Att.)": dept.fe || "-",
            "SEA (Event/Att.)": dept.sea || "-",
            "SEB (Event/Att.)": dept.seb || "-",
            "TEA (Event/Att.)": dept.tea || "-",
            "TEB (Event/Att.)": dept.teb || "-",
            "BEA (Event/Att.)": dept.bea || "-",
            "BEB (Event/Att.)": dept.beb || "-",
            "Department Strength": dept.strength,
        }));

        // Create worksheet & workbook
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daily_Events_Status");

        // Generate Excel file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Daily_Events_Status.xlsx");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen md:ml-16">
            <div className="flex justify-between items-center mb-4">
                {/* Updated Title to reflect daily event status */}
                <h1 className="text-2xl font-bold text-gray-800">Daily Events/Attendance Status (Today)</h1>
                <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                >
                    Export as Excel
                </button>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white text-sm text-gray-700">
                    <thead className="bg-blue-600 text-white text-center sticky top-0">
                        <tr>
                            <th className="p-2 border">Sr. No</th>
                            <th className="p-2 border">Department Name</th>
                            {/* Updated column headers to indicate dual purpose */}
                            <th className="p-2 border bg-blue-700">FE (Event/Att.)</th>
                            <th className="p-2 border bg-blue-700">SEA (Event/Att.)</th>
                            <th className="p-2 border bg-blue-700">SEB (Event/Att.)</th>
                            <th className="p-2 border bg-blue-700">TEA (Event/Att.)</th>
                            <th className="p-2 border bg-blue-700">TEB (Event/Att.)</th>
                            <th className="p-2 border bg-blue-700">BEA (Event/Att.)</th>
                            <th className="p-2 border bg-blue-700">BEB (Event/Att.)</th>
                            <th className="p-2 border">Dept. Strength</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id} className="hover:bg-blue-50 text-center border-b">
                                <td className="p-2 border">{dept.id}</td>
                                <td className="p-2 border text-left font-medium">{dept.name}</td>
                                {/* Use the helper function to render content */}
                                <td className="p-2 border">{renderCellContent(dept.fe)}</td>
                                <td className="p-2 border">{renderCellContent(dept.sea)}</td>
                                <td className="p-2 border">{renderCellContent(dept.seb)}</td>
                                <td className="p-2 border">{renderCellContent(dept.tea)}</td>
                                <td className="p-2 border">{renderCellContent(dept.teb)}</td>
                                <td className="p-2 border">{renderCellContent(dept.bea)}</td>
                                <td className="p-2 border">{renderCellContent(dept.beb)}</td>
                                <td className="p-2 border font-semibold">{dept.strength}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-sm text-gray-600">
                *Cells containing **text in red** indicate an event is scheduled for that section today. Cells containing **numbers** indicate the standard attendance record.
            </p>
        </div>
    );
}