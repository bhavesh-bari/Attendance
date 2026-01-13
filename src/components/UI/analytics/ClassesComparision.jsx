"use client";
import React, { useState, useEffect } from "react";

const ClassComparison = ({ data, availableClasses }) => {
  // Initialize state based on the API response structure
  const [selectedClassA, setSelectedClassA] = useState(data?.left?.className || "");
  const [selectedClassB, setSelectedClassB] = useState(data?.right?.className || "");

  // Update state if new data comes in
  useEffect(() => {
    if (data?.left?.className) setSelectedClassA(data.left.className);
    if (data?.right?.className) setSelectedClassB(data.right.className);
  }, [data]);

  const MetricCard = ({
    title,
    value,
    colorClass = "text-gray-900",
    size = "text-2xl"
  }) => (
    <div className="p-4 bg-white rounded-lg shadow border">
      <p className="text-sm text-gray-500 truncate">{title}</p>
      <p className={`${size} font-bold ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    <div className="mx-auto p-6 bg-gray-50 rounded-xl shadow-2xl">

      {/* SELECTION DROPDOWNS */}
      <div className="flex justify-between mb-6 gap-4">
        <select
          value={selectedClassA}
          onChange={(e) => setSelectedClassA(e.target.value)}
          className="p-2 border rounded-lg w-full md:w-auto"
        >
          {availableClasses?.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedClassB}
          onChange={(e) => setSelectedClassB(e.target.value)}
          className="p-2 border rounded-lg w-full md:w-auto"
        >
          {availableClasses?.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= CLASS A (LEFT) ================= */}
        <div className="p-6 bg-blue-50 rounded-xl border-t-8 border-blue-500">
          <h2 className="text-2xl font-black text-blue-600 mb-6">
            {data?.left?.className || "—"}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({data?.left?.department})
            </span>
          </h2>

          <div className="space-y-3">
            <MetricCard
              title="Overall Attendance"
              value={`${data?.left?.overall?.attendance ?? 0}%`}
              colorClass="text-blue-600"
              size="text-4xl"
            />

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Morning"
                value={`${data?.left?.overall?.morning ?? 0}%`}
              />
              <MetricCard
                title="Afternoon"
                value={`${data?.left?.overall?.afternoon ?? 0}%`}
              />
            </div>

            <MetricCard
              title="Total Events Attended"
              value={data?.left?.overall?.totalEvents ?? 0}
            />

            <MetricCard
              title="Today's Attendance"
              value={`${data?.left?.today?.attendance ?? 0}%`}
            />

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Monthly Attendance"
                value={`${data?.left?.month?.attendance ?? 0}%`}
              />
              <MetricCard
                title="Monthly Events"
                value={data?.left?.month?.totalEvents ?? 0}
              />
            </div>

            <MetricCard
              title="Rank in Dept"
              value={data?.left?.rankInDepartment ?? "—"}
              colorClass="text-blue-600"
            />

            <MetricCard
              title="Recent Event"
              value={data?.left?.recentEvent?.name ?? "—"}
            />
          </div>
        </div>

        {/* ================= CLASS B (RIGHT) ================= */}
        <div className="p-6 bg-green-50 rounded-xl border-t-8 border-green-500">
          <h2 className="text-2xl font-black text-green-600 mb-6">
            {data?.right?.className || "—"}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({data?.right?.department})
            </span>
          </h2>

          <div className="space-y-3">
            <MetricCard
              title="Overall Attendance"
              value={`${data?.right?.overall?.attendance ?? 0}%`}
              colorClass="text-green-600"
              size="text-4xl"
            />

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Morning"
                value={`${data?.right?.overall?.morning ?? 0}%`}
              />
              <MetricCard
                title="Afternoon"
                value={`${data?.right?.overall?.afternoon ?? 0}%`}
              />
            </div>

            <MetricCard
              title="Total Events Attended"
              value={data?.right?.overall?.totalEvents ?? 0}
            />

            <MetricCard
              title="Today's Attendance"
              value={`${data?.right?.today?.attendance ?? 0}%`}
            />

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Monthly Attendance"
                value={`${data?.right?.month?.attendance ?? 0}%`}
              />
              <MetricCard
                title="Monthly Events"
                value={data?.right?.month?.totalEvents ?? 0}
              />
            </div>

            <MetricCard
              title="Rank in Dept"
              value={data?.right?.rankInDepartment ?? "—"}
              colorClass="text-green-600"
            />

            <MetricCard
              title="Recent Event"
              value={data?.right?.recentEvent?.name ?? "—"}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClassComparison;