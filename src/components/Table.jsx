"use client";
import React from "react";

const columns = ["SE-A", "SE-B", "TE-A", "TE-B", "BE-A", "BE-B"];

const AttendanceTable = ({ data }) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-2 sticky top-0">Sr. No</th>
            <th className="border px-2 py-2 sticky top-0">Department Name</th>
            {columns.map((col) => (
              <React.Fragment key={col}>
                <th className="border px-2 py-2 sticky top-0">{col} P-Count</th>
                <th className="border px-2 py-2 sticky top-0">{col} %</th>
              </React.Fragment>
            ))}
            <th className="border px-2 py-2 sticky top-0">Total P-Count</th>
            <th className="border px-2 py-2 sticky top-0">Total %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dept, index) => (
            <tr key={dept.department} className="hover:bg-gray-50 transition-colors">
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">{dept.department}</td>
              {columns.map((col) => (
                <React.Fragment key={col}>
                  <td className={`border px-2 py-1 text-center ${dept.classes[col]?.pCount === 0 ? "bg-red-500 text-white" : ""}`}>
                    {dept.classes[col]?.pCount || 0}
                  </td>
                  <td className={`border px-2 py-1 text-center ${dept.classes[col]?.percent < 50 ? "bg-red-500 text-white" : ""}`}>
                    {dept.classes[col]?.percent?.toFixed(2) || 0}%
                  </td>
                </React.Fragment>
              ))}
              <td className="border px-2 py-1 text-center">{dept.total.pCount}</td>
              <td className="border px-2 py-1 text-center">{dept.total.percent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
