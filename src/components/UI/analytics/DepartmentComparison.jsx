"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  CalendarDays,
  Sun,
  Moon,
  Trophy,
  Star,
  Calendar
} from "lucide-react";

const DepartmentComparison = ({ availableDepartments }) => {
  const [leftDept, setLeftDept] = useState("");
  const [rightDept, setRightDept] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (availableDepartments?.length >= 2) {
      setLeftDept(availableDepartments[0].name);
      setRightDept(availableDepartments[1].name);
    }
  }, [availableDepartments]);

  useEffect(() => {
    if (!leftDept || !rightDept) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          mode: "compare",
          compareType: "department",
          left: leftDept,
          right: rightDept
        });
        const res = await fetch(`/api/analytics?${query.toString()}`);
        const data = await res.json();
        if (data.success) setComparisonData(data.compare);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [leftDept, rightDept]);

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color = "text-gray-700",
    bg = "bg-white",
    size = "text-base sm:text-lg md:text-xl"
  }) => (
    <div className={`p-3 sm:p-4 rounded-lg shadow border ${bg}`}>
      <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mb-1">
        {Icon && <Icon size={14} />}
        <span>{title}</span>
      </div>
      <div className={`font-extrabold ${color} ${size}`}>{value}</div>
    </div>
  );

  const renderColumn = (data, color, bgColor, borderColor) => (
    <div className={`p-4 sm:p-6 rounded-xl border-t-8 ${borderColor} ${bgColor}`}>
      <h2 className={`text-lg sm:text-xl md:text-2xl font-black mb-5 ${color}`}>
        {data?.department || "—"}
      </h2>

      <MetricCard
        title="Overall Attendance"
        value={`${data?.overall?.attendance ?? 0}%`}
        icon={TrendingUp}
        color={color}
        bg="bg-white"
        size="text-xl sm:text-2xl md:text-3xl"
      />

      <div className="mt-3">
        <MetricCard
          title="Today's Average"
          value={`${data?.today?.attendance ?? 0}%`}
          icon={CalendarDays}
          bg="bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <MetricCard
          title="Morning"
          value={`${data?.today?.morning ?? 0}%`}
          icon={Sun}
          bg="bg-yellow-50"
          color="text-yellow-700"
        />
        <MetricCard
          title="Afternoon"
          value={`${data?.today?.afternoon ?? 0}%`}
          icon={Moon}
          bg="bg-indigo-50"
          color="text-indigo-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <MetricCard
          title="Total Students"
          value={data?.today?.totalStudents ?? 0}
          icon={Users}
          bg="bg-emerald-50"
          color="text-emerald-700"
        />
        <MetricCard
          title="Events"
          value={data?.overall?.totalEvents ?? 0}
          icon={Calendar}
          bg="bg-pink-50"
          color="text-pink-700"
        />
      </div>

      <div className="mt-3 space-y-3">
        <MetricCard
          title="Monthly Attendance"
          value={`${data?.month?.attendance ?? 0}%`}
          icon={CalendarDays}
        />
        <MetricCard
          title="Total Classes"
          value={data?.totalClasses ?? 0}
          icon={Users}
        />
        <MetricCard
          title="Best Class"
          value={
            data?.bestClass
              ? `${data.bestClass.className} (${data.bestClass.avg}%)`
              : "—"
          }
          icon={Star}
          bg="bg-blue-50"
          color="text-blue-700"
        />
        <MetricCard
          title="Department Rank"
          value={data?.departmentRank ?? "--"}
          icon={Trophy}
          bg="bg-amber-50"
          color="text-amber-700"
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-2xl">
      <div className="flex gap-4 mb-6">
        <select
          value={leftDept}
          onChange={(e) => setLeftDept(e.target.value)}
          className="p-2 border rounded-lg w-full"
        >
          {availableDepartments?.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select
          value={rightDept}
          onChange={(e) => setRightDept(e.target.value)}
          className="p-2 border rounded-lg w-full"
        >
          {availableDepartments?.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading comparison...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderColumn(comparisonData?.left, "text-blue-600", "bg-blue-50", "border-blue-500")}
          {renderColumn(comparisonData?.right, "text-green-600", "bg-green-50", "border-green-500")}
        </div>
      )}
    </div>
  );
};

export default DepartmentComparison;
