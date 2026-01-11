"use client";
import React, { useState } from "react";

const DepartmentComparison = ({ data, availableDepartments }) => {
  const [selectedDeptA, setSelectedDeptA] = useState(data?.deptA?.name || "");
  const [selectedDeptB, setSelectedDeptB] = useState(data?.deptB?.name || "");

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

        {/* ================= DEPARTMENT A ================= */}
        <div className={`p-6 rounded-xl border-t-8 ${borderA} ${bgColorA}`}>
          <h2 className={`text-2xl font-black mb-6 ${colorA}`}>
            {data?.deptA?.name || "—"}
          </h2>

          <MetricCard
            title="Overall Attendance"
            value={`${data?.deptA?.overall?.attendance ?? 0}%`}
            colorClass={colorA}
            size="text-4xl"
          />

          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Morning"
              value={`${data?.deptA?.overall?.morning ?? 0}%`}
            />
            <MetricCard
              title="Afternoon"
              value={`${data?.deptA?.overall?.afternoon ?? 0}%`}
            />
            <MetricCard
              title="Events"
              value={data?.deptA?.overall?.totalEvents ?? 0}
            />
          </div>

          <MetricCard
            title="Today's Attendance"
            value={`${data?.deptA?.today?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Monthly Attendance"
            value={`${data?.deptA?.month?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Total Classes"
            value={data?.deptA?.totalClasses ?? 0}
          />

          <MetricCard
            title="Best Class"
            value={
              data?.deptA?.bestClass
                ? `${data.deptA.bestClass.className} (${data.deptA.bestClass.avg}%)`
                : "—"
            }
          />

          <MetricCard
            title="Department Rank"
            value={data?.deptA?.departmentRank ?? "—"}
            colorClass={colorA}
          />

          <MetricCard
            title="Recent Event"
            value={data?.deptA?.recentEvent?.name ?? "—"}
          />
        </div>

        {/* ================= DEPARTMENT B ================= */}
        <div className={`p-6 rounded-xl border-t-8 ${borderB} ${bgColorB}`}>
          <h2 className={`text-2xl font-black mb-6 ${colorB}`}>
            {data?.deptB?.name || "—"}
          </h2>

          <MetricCard
            title="Overall Attendance"
            value={`${data?.deptB?.overall?.attendance ?? 0}%`}
            colorClass={colorB}
            size="text-4xl"
          />

          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Morning"
              value={`${data?.deptB?.overall?.morning ?? 0}%`}
            />
            <MetricCard
              title="Afternoon"
              value={`${data?.deptB?.overall?.afternoon ?? 0}%`}
            />
            <MetricCard
              title="Events"
              value={data?.deptB?.overall?.totalEvents ?? 0}
            />
          </div>

          <MetricCard
            title="Today's Attendance"
            value={`${data?.deptB?.today?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Monthly Attendance"
            value={`${data?.deptB?.month?.attendance ?? 0}%`}
          />

          <MetricCard
            title="Total Classes"
            value={data?.deptB?.totalClasses ?? 0}
          />

          <MetricCard
            title="Best Class"
            value={
              data?.deptB?.bestClass
                ? `${data.deptB.bestClass.className} (${data.deptB.bestClass.avg}%)`
                : "—"
            }
          />

          <MetricCard
            title="Department Rank"
            value={data?.deptB?.departmentRank ?? "—"}
            colorClass={colorB}
          />

          <MetricCard
            title="Recent Event"
            value={data?.deptB?.recentEvent?.name ?? "—"}
          />
        </div>

      </div>
    </div>
  );
};

export default DepartmentComparison;
