"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Sun,
  Moon,
  Trophy,
  CalendarDays
} from "lucide-react";

const ClassesComparison = ({ availableClasses = [] }) => {
  const [leftClass, setLeftClass] = useState("");
  const [rightClass, setRightClass] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (availableClasses.length >= 2) {
      setLeftClass(availableClasses[0].name);
      setRightClass(availableClasses[1].name);
    }
  }, [availableClasses]);

  useEffect(() => {
    if (!leftClass || !rightClass) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          mode: "compare",
          compareType: "class",
          left: leftClass,
          right: rightClass
        });
        const res = await fetch(`/api/analytics?${query.toString()}`);
        const result = await res.json();
        if (result.success) setData(result.compare);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [leftClass, rightClass]);

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
      <div className={`font-bold ${color} ${size}`}>{value}</div>
    </div>
  );

  const renderClass = (clsData, color, bgColor, borderColor) => (
    <div className={`p-4 sm:p-6 ${bgColor} rounded-xl border-t-8 ${borderColor}`}>
      <h2 className={`text-lg sm:text-xl md:text-2xl font-black ${color} mb-5`}>
        {clsData?.className || "—"}
        <span className="text-xs sm:text-sm font-normal text-gray-500 ml-2">
          ({clsData?.department})
        </span>
      </h2>

      <div className="space-y-3">
        <MetricCard
          title="Overall Attendance"
          value={`${clsData?.overall?.attendance ?? 0}%`}
          icon={TrendingUp}
          color={color}
          size="text-xl sm:text-2xl md:text-3xl"
        />

        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Morning"
            value={`${clsData?.today?.morning ?? 0}%`}
            icon={Sun}
            bg="bg-yellow-50"
            color="text-yellow-700"
          />
          <MetricCard
            title="Afternoon"
            value={`${clsData?.today?.afternoon ?? 0}%`}
            icon={Moon}
            bg="bg-indigo-50"
            color="text-indigo-700"
          />
        </div>


        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="This Month Avg"
            value={`${clsData?.month?.attendance ?? 0} %`}
            icon={Users}
            bg="bg-pink-50"
            color="text-pink-700"
          />
          <MetricCard
            title="Today Average"
            value={`${clsData?.today?.attendance ?? 0}%`}
            icon={CalendarDays}
          />

        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Total Students"
            value={clsData?.today?.totalStudents ?? 0}
            icon={Users}
            bg="bg-emerald-50"
            color="text-emerald-700"
          />
          <MetricCard
            title="Total Events"
            value={clsData?.overall?.totalEvents || "-"}
            icon={Trophy}
            bg="bg-emerald-50"
            color="text-emerald-700"
          /> </div>
        <div className="mt-3">          <MetricCard
          title="Rank in Dept"
          value={clsData?.rankInDepartment || "-"}
          icon={Trophy}
          bg="bg-amber-50"
          color="text-amber-700"
        />
        </div>

      </div>
    </div>
  );

  return (
    <div className="mx-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-2xl">
      <div className="flex gap-4 mb-6">
        <select
          value={leftClass}
          onChange={(e) => setLeftClass(e.target.value)}
          className="p-2 border rounded-lg w-full"
        >
          {availableClasses.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={rightClass}
          onChange={(e) => setRightClass(e.target.value)}
          className="p-2 border rounded-lg w-full"
        >
          {availableClasses.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderClass(data?.left, "text-blue-600", "bg-blue-50", "border-blue-500")}
          {renderClass(data?.right, "text-green-600", "bg-green-50", "border-green-500")}
        </div>
      )}
    </div>
  );
};

export default ClassesComparison;
