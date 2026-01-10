import React from "react";

// Filter component is now controlled by props
function Filter({ filters, onFilterChange, excludedFilters = [] }) {

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    const isExcluded = (name) => excludedFilters.includes(name);

    return (
        <div className="w-full overflow-x-auto py-2 hide-scrollbar" >
            <div className="flex gap-4 min-w-max px-2">

                {/* Department Filter */}
                {!isExcluded("department") && (
                    <select
                        name="department"
                        value={filters.department}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All Departments">All Departments</option>
                        <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                        <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                        <option value="Computer Science (CS)">Computer Science (CS)</option>
                        <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
                    </select>
                )}

                {/* Shift Filter */}
                {!isExcluded("shift") && (
                    <select
                        name="shift"
                        value={filters.shift}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="overall">Overall</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="both">Both</option>
                    </select>
                )}

                {/* Time Period Filter */}
                {!isExcluded("timePeriod") && (
                    <select
                        name="timePeriod"
                        value={filters.timePeriod}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="overall">Overall</option>
                        <option value="today">Today</option>
                        <option value="monthly">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                )}

                {/* Custom Date Range - Only show if timePeriod is custom */}
                {filters.timePeriod === "custom" && !isExcluded("startDate") && !isExcluded("endDate") && (
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleSelectChange}
                            className="border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleSelectChange}
                            className="border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

export default Filter;