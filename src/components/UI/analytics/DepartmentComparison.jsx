"use client";
import React, { useState } from "react";

const DepartmentComparison = ({ data, availableDepartments }) => {
    const [selectedDeptA, setSelectedDeptA] = useState(data.deptA.name);
    const [selectedDeptB, setSelectedDeptB] = useState(data.deptB.name);

    const colorA = "text-blue-600";
    const colorB = "text-green-600";
    const bgColorA = "bg-blue-50";
    const bgColorB = "bg-green-50";
    const borderA = "border-blue-500";
    const borderB = "border-green-500";

    const MetricCard = ({
        title,
        value,
        colorClass = "text-gray-900",
        size = "text-3xl",
    }) => (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p
                className={`mt-1 ${colorClass} font-extrabold ${size} break-words leading-tight`}
            >
                {value}
            </p>
        </div>
    );

    return (
        <div className="mx-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-4 border-b-2 pb-2 break-words text-center sm:text-left">
                Department Performance Comparison ⚔️
            </h1>

            {/* Department selection */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 p-4 bg-white rounded-lg shadow-md space-y-4 md:space-y-0">
                {/* Department A */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full md:w-auto min-w-0">
                    <label className="font-semibold text-gray-700 mb-1 sm:mb-0">
                        Select Department A:
                    </label>
                    <select
                        value={selectedDeptA}
                        onChange={(e) => setSelectedDeptA(e.target.value)}
                        className={`p-2 border rounded-lg w-full sm:w-auto focus:ring-blue-500 ${borderA} ml-0 sm:ml-3`}
                    >
                        {availableDepartments.map((dept) => (
                            <option key={dept.id} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                <span className="text-2xl font-bold text-gray-500">VS</span>

                {/* Department B */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full md:w-auto min-w-0">
                    <label className="font-semibold text-gray-700 mb-1 sm:mb-0">
                        Select Department B:
                    </label>
                    <select
                        value={selectedDeptB}
                        onChange={(e) => setSelectedDeptB(e.target.value)}
                        className={`p-2 border rounded-lg w-full sm:w-auto focus:ring-green-500 ${borderB} ml-0 sm:ml-3`}
                    >
                        {availableDepartments.map((dept) => (
                            <option key={dept.id} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                {/* Department A */}
                <div
                    className={`p-6 rounded-xl shadow-xl border-t-8 ${borderA} ${bgColorA} transition-all duration-500 min-w-0`}
                >
                    <h2 className={`text-xl sm:text-2xl font-black mb-6 ${colorA} break-words`}>
                        {data.deptA.name}
                    </h2>

                    <div className="space-y-4">

                        <MetricCard
                            title="Overall Attendance"
                            value={`${data.deptA.overallAttendance.toFixed(1)}%`}
                            colorClass={colorA}
                            size="text-3xl sm:text-4xl"
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <MetricCard
                                title="Today Overall"
                                value={`${data.deptA.today.overall.toFixed(1)}%`}
                                colorClass={colorA}
                                size="text-sm sm:text-xl"
                            />
                            <MetricCard
                                title="Morning"
                                value={`${data.deptA.today.morning.toFixed(1)}%`}
                                colorClass={colorA}
                                size="text-sm sm:text-xl"
                            />
                            <MetricCard
                                title="Afternoon"
                                value={`${data.deptA.today.afternoon.toFixed(1)}%`}
                                colorClass={colorA}
                                size="text-sm sm:text-xl"
                            />
                        </div>

                        <MetricCard
                            title="This Month Avg. Attendance"
                            value={`${data.deptA.thisMonthAvg.toFixed(1)}%`}
                            colorClass={colorA}
                        />

                        <MetricCard
                            title="Total Divisions & Years"
                            value={`${data.deptA.totalDivisions} Div / ${data.deptA.totalYears} Yrs`}
                        />

                        <MetricCard
                            title="No. of Events Done (YTD)"
                            value={data.deptA.eventsDone}
                        />

                        <MetricCard
                            title="Recent Event"
                            value={data.deptA.recentEvent}
                            size="text-base sm:text-xl"
                        />

                        <MetricCard
                            title="Best Performing Class"
                            value={data.deptA.bestClass}
                            size="text-base sm:text-xl"
                        />
                    </div>
                </div>

                {/* Department B */}
                <div
                    className={`p-6 rounded-xl shadow-xl border-t-8 ${borderB} ${bgColorB} transition-all duration-500 min-w-0`}
                >
                    <h2 className={`text-xl sm:text-2xl font-black mb-6 ${colorB} break-words`}>
                        {data.deptB.name}
                    </h2>

                    <div className="space-y-4">
                        <MetricCard
                            title="Overall Attendance"
                            value={`${data.deptB.overallAttendance.toFixed(1)}%`}
                            colorClass={colorB}
                            size="text-3xl sm:text-4xl"
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <MetricCard
                                title="Today Overall"
                                value={`${data.deptB.today.overall.toFixed(1)}%`}
                                colorClass={colorB}
                                size="text-sm sm:text-xl"
                            />
                            <MetricCard
                                title="Morning"
                                value={`${data.deptB.today.morning.toFixed(1)}%`}
                                colorClass={colorB}
                                size="text-sm sm:text-xl"
                            />
                            <MetricCard
                                title="Afternoon"
                                value={`${data.deptB.today.afternoon.toFixed(1)}%`}
                                colorClass={colorB}
                                size="text-sm sm:text-xl"
                            />
                        </div>

                        <MetricCard
                            title="This Month Avg. Attendance"
                            value={`${data.deptB.thisMonthAvg.toFixed(1)}%`}
                            colorClass={colorB}
                        />

                        <MetricCard
                            title="Total Divisions & Years"
                            value={`${data.deptB.totalDivisions} Div / ${data.deptB.totalYears} Yrs`}
                        />

                        <MetricCard
                            title="No. of Events Done (YTD)"
                            value={data.deptB.eventsDone}
                        />

                        <MetricCard
                            title="Recent Event"
                            value={data.deptB.recentEvent}
                            size="text-base sm:text-xl"
                        />

                        <MetricCard
                            title="Best Performing Class"
                            value={data.deptB.bestClass}
                            size="text-base sm:text-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentComparison;
