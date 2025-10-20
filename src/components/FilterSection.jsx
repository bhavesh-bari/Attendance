// /components/FilterSection.js
"use client";
import React from 'react';
import { initialAttendanceData } from '@/data/attendanceData'; // Ensure this path is correct

const dateOptions = [
    { value: 'Daily', label: 'Today' },
    { value: 'Monthly', label: 'Last 30 Days' },
    { value: 'Mid-Month', label: 'Oct 1 - Oct 15' },
    { value: 'Custom', label: 'Custom Range...' },
];

const sessionOptions = ['Morning (9-1)', 'Afternoon (2-5)', 'Full Day'];

const FilterSection = ({ filters, setFilters }) => {
    // Determine available years and divisions based on the selected department
    const selectedDeptStructure = initialAttendanceData.collegeStructure.find(
        (d) => d.dept === filters.selectedDept
    );

    const availableYears = selectedDeptStructure
        ? selectedDeptStructure.years.map(y => y.year)
        : [];

    const availableDivisions = selectedDeptStructure
        ? (selectedDeptStructure.years.find(y => y.year === filters.selectedYear)?.divisions || [])
        : [];

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value,
            // Reset Year/Division if Department changes
            ...(name === 'selectedDept' && { selectedYear: availableYears[0] || '', selectedDivision: '' }),
            // Reset Division if Year changes
            ...(name === 'selectedYear' && { selectedDivision: '' }),
        }));
    };

    const inputClasses = "w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm";
    const toggleClasses = "flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200";

    return (
        <div className="flex flex-wrap items-center gap-4">

            {/* 1. Department Filter (Hierarchical Top Level) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                <select
                    value={filters.selectedDept}
                    onChange={(e) => handleFilterChange('selectedDept', e.target.value)}
                    className={inputClasses}
                >
                    {initialAttendanceData.collegeStructure.map(dept => (
                        <option key={dept.dept} value={dept.dept}>{dept.dept}</option>
                    ))}
                </select>
            </div>

            {/* 2. Year Filter (Hierarchical Middle Level) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                <select
                    value={filters.selectedYear}
                    onChange={(e) => handleFilterChange('selectedYear', e.target.value)}
                    className={inputClasses}
                    disabled={availableYears.length === 0}
                >
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* 3. Division Filter (Hierarchical Bottom Level) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Division</label>
                <select
                    value={filters.selectedDivision}
                    onChange={(e) => handleFilterChange('selectedDivision', e.target.value)}
                    className={inputClasses}
                    disabled={availableDivisions.length === 0}
                >
                    <option value="">All Divisions</option>
                    {availableDivisions.map(div => (
                        <option key={div} value={div}>{div}</option>
                    ))}
                </select>
            </div>

            {/* 4. Date Range Picker */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
                <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className={inputClasses}
                >
                    {dateOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* 5. Session Filter */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
                <select
                    value={filters.session}
                    onChange={(e) => handleFilterChange('session', e.target.value)}
                    className={inputClasses}
                >
                    {sessionOptions.map(session => (
                        <option key={session} value={session}>{session}</option>
                    ))}
                </select>
            </div>

            {/* 6. Compare Toggle (Optional) */}
            <div className="flex-grow min-w-[150px] pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.isComparing}
                        onChange={(e) => handleFilterChange('isComparing', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                        {filters.isComparing ? 'Comparing YoY' : 'Enable Comparison'}
                    </span>
                </label>
            </div>

        </div>
    );
};

export default FilterSection;