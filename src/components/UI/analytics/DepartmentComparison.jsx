"use client";
import React, { useState, useEffect } from "react";

const DepartmentComparison = ({ data, availableDepartments }) => {
  // Initialize state based on API data structure (left/right)
  // Note: We use 'department' instead of 'name' based on your API
  const [selectedDeptA, setSelectedDeptA] = useState(data?.left?.department || "");
  const [selectedDeptB, setSelectedDeptB] = useState(data?.right?.department || "");

  // Update state if data prop changes
  useEffect(() => {
    if (data?.left?.department) setSelectedDeptA(data.left.department);
    if (data?.right?.department) setSelectedDeptB(data.right.department);
  }, [data]);

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
    <div className="p-4 bg-white rounded-lg shadow border min-w-0">
      <p className="text-sm text-gray-500 truncate">{title}</p>
      <p className={`${size} font-extrabold ${colorClass} break-words`}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="mx-auto p-6 bg-gray-50 rounded-xl shadow-2xl">

      {/* SELECTION */}
      <div className="flex justify-between mb-6">
        <select
          value={selectedDeptA}
          onChange={(e) => setSelectedDeptA(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {availableDepartments?.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDeptB}
          onChange={(e) => setSelectedDeptB(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {availableDepartments?.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= DEPARTMENT A (LEFT) ================= */}
        <div className={`p-6 rounded-xl border-t-8 ${borderA} ${bgColorA}`}>
          <h2 className={`text-2xl font-black mb-6 ${colorA}`}>
            {data?.left?.department || "—"}
          </h2>

          <MetricCard
            title="Overall Attendance"
            value={`${data?.left?.overall?.attendance ?? 0}%`}
            colorClass={colorA}
            size="text-4xl"
          />

          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Morning"
              value={`${data?.left?.overall?.morning ?? 0}%`}
              size="text-xl"
            />
            <MetricCard
              title="Afternoon"
              value={`${data?.left?.overall?.afternoon ?? 0}%`}
              size="text-xl"
            />
            <MetricCard
              title="Events"
              value={data?.left?.overall?.totalEvents ?? 0}
              size="text-xl"
            />
          </div>

          <MetricCard
            title="Today's Attendance"
            value={`${data?.left?.today?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Monthly Attendance"
            value={`${data?.left?.month?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Total Classes"
            value={data?.left?.totalClasses ?? 0}
          />

          <MetricCard
            title="Best Class"
            value={
              data?.left?.bestClass
                ? `${data.left.bestClass.className} (${data.left.bestClass.avg}%)`
                : "—"
            }
          />

          <MetricCard
            title="Department Rank"
            value={data?.left?.departmentRank ?? "—"}
            colorClass={colorA}
          />

          <MetricCard
            title="Recent Event"
            value={data?.left?.recentEvent?.name ?? "—"}
          />
        </div>

        {/* ================= DEPARTMENT B (RIGHT) ================= */}
        <div className={`p-6 rounded-xl border-t-8 ${borderB} ${bgColorB}`}>
          <h2 className={`text-2xl font-black mb-6 ${colorB}`}>
            {data?.right?.department || "—"}
          </h2>

          <MetricCard
            title="Overall Attendance"
            value={`${data?.right?.overall?.attendance ?? 0}%`}
            colorClass={colorB}
            size="text-4xl"
          />

          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Morning"
              value={`${data?.right?.overall?.morning ?? 0}%`}
              size="text-xl"
            />
            <MetricCard
              title="Afternoon"
              value={`${data?.right?.overall?.afternoon ?? 0}%`}
              size="text-xl"
            />
            <MetricCard
              title="Events"
              value={data?.right?.overall?.totalEvents ?? 0}
              size="text-xl"
            />
          </div>

          <MetricCard
            title="Today's Attendance"
            value={`${data?.right?.today?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Monthly Attendance"
            value={`${data?.right?.month?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Total Classes"
            value={data?.right?.totalClasses ?? 0}
          />

          <MetricCard
            title="Best Class"
            value={
              data?.right?.bestClass
                ? `${data.right.bestClass.className} (${data.right.bestClass.avg}%)`
                : "—"
            }
          />

          <MetricCard
            title="Department Rank"
            value={data?.right?.departmentRank ?? "—"}
            colorClass={colorB}
          />

          <MetricCard
            title="Recent Event"
            value={data?.right?.recentEvent?.name ?? "—"}
          />
        </div>

      </div>
    </div>
  );
};

export default DepartmentComparison;