// /components/charts/AttendancePieChart.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10B981', '#EF4444']; // Green for Present, Red for Absent

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">{data.name}</p>
                <p className={`text-sm ${data.name === 'Present' ? 'text-green-500' : 'text-red-500'}`}>
                    Count: <span className="font-bold">{data.value.toLocaleString()}</span>
                </p>
                <p className="text-xs text-gray-500">
                    Percentage: <span className="font-bold">{(data.percent * 100).toFixed(1)}%</span>
                </p>
            </div>
        );
    }
    return null;
};

const AttendancePieChart = ({ data }) => {
    // Assuming 'data' is the dailyData array from attendanceData.js
    // For a single day view, we take the latest entry:
    const latestData = data[data.length - 1] || { present: 0, absent: 0 };

    const chartData = [
        { name: 'Present', value: latestData.present, percent: latestData.present / (latestData.present + latestData.absent) },
        { name: 'Absent', value: latestData.absent, percent: latestData.absent / (latestData.present + latestData.absent) },
    ];

    return (
        // ResponsiveContainer ensures the chart fills its parent div
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    labelLine={false}
                    // Animation for engaging load
                    animationDuration={800} 
                >
                    {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            className="transition-all duration-300 hover:opacity-80" // Hover effect
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {/* Optional: Add a legend or a custom label */}
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AttendancePieChart;