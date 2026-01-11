"use client";
import React, { useState, useEffect } from "react";

/* ===========================================================
   DUMMY DEPARTMENT DATA (UPDATED)
   =========================================================== */

export const DEPARTMENT_DUMMY_DATA = {
  "Mechanical Engineering (ME)": {
    classes: [
      { name: "ME FE A", overall_attendance: 78, morning: 80, afternoon: 76, eventsAttended: 3 },
      { name: "ME FE B", overall_attendance: 82, morning: 85, afternoon: 79, eventsAttended: 2 },
      { name: "ME SE A", overall_attendance: 75, morning: 77, afternoon: 73, eventsAttended: 4 },
      { name: "ME SE B", overall_attendance: 79, morning: 82, afternoon: 76, eventsAttended: 3 },

      {
        name: "ME TE",
        overall_attendance: 88,
        morning: 90,
        afternoon: 86,
        eventsAttended: 5,

        today: {
          attendance: "0.0",
          morning: "0.0",
          totalEvents: 0,
        },

        month: {
          attendance: "86.3",
          morning: "85.4",
          totalEvents: 3,
        },

        recentEvent: {
          name: "Meeting",
          date: "2026-01-09T18:30:00.000Z",
        },
      },
    ],
  },
};

/* ===========================================================
   METRIC CARD
   =========================================================== */

const MetricCard = ({ title, value, colorClass = "text-gray-900" }) => (
  <div className="p-4 bg-white rounded-lg shadow border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

/* ===========================================================
   MAIN COMPONENT
   =========================================================== */

export default function ClassComparison({ department }) {
  const selectedDept = department || "Mechanical Engineering (ME)";
  const deptClasses = DEPARTMENT_DUMMY_DATA[selectedDept]?.classes || [];

  const [selectedClassA, setSelectedClassA] = useState("");
  const [selectedClassB, setSelectedClassB] = useState("");

  useEffect(() => {
    if (deptClasses.length > 1) {
      setSelectedClassA(deptClasses[0].name);
      setSelectedClassB(deptClasses[1].name);
    }
  }, [selectedDept]);

  const classAData = deptClasses.find((c) => c.name === selectedClassA);
  const classBData = deptClasses.find((c) => c.name === selectedClassB);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* CLASS A */}
      <div className="p-6 bg-blue-50 rounded-xl">
        <h2 className="text-xl font-bold text-blue-600 mb-4">{selectedClassA}</h2>

        <div className="space-y-3">
          <MetricCard title="Overall Attendance" value={`${classAData?.overall_attendance ?? 0}%`} colorClass="text-blue-600" />
          <MetricCard title="Morning" value={`${classAData?.morning ?? 0}%`} />
          <MetricCard title="Afternoon" value={`${classAData?.afternoon ?? 0}%`} />
          <MetricCard title="Events Attended" value={classAData?.eventsAttended ?? 0} />

          <MetricCard title="Today's Attendance" value={`${classAData?.today?.attendance ?? 0}%`} />
          <MetricCard title="Monthly Attendance" value={`${classAData?.month?.attendance ?? 0}%`} />
          <MetricCard title="Monthly Events" value={classAData?.month?.totalEvents ?? 0} />
          <MetricCard title="Recent Event" value={classAData?.recentEvent?.name ?? "—"} />
        </div>
      </div>

      {/* CLASS B */}
      <div className="p-6 bg-green-50 rounded-xl">
        <h2 className="text-xl font-bold text-green-600 mb-4">{selectedClassB}</h2>

        <div className="space-y-3">
          <MetricCard title="Overall Attendance" value={`${classBData?.overall_attendance ?? 0}%`} colorClass="text-green-600" />
          <MetricCard title="Morning" value={`${classBData?.morning ?? 0}%`} />
          <MetricCard title="Afternoon" value={`${classBData?.afternoon ?? 0}%`} />
          <MetricCard title="Events Attended" value={classBData?.eventsAttended ?? 0} />

          <MetricCard title="Today's Attendance" value={`${classBData?.today?.attendance ?? 0}%`} />
          <MetricCard title="Monthly Attendance" value={`${classBData?.month?.attendance ?? 0}%`} />
          <MetricCard title="Monthly Events" value={classBData?.month?.totalEvents ?? 0} />
          <MetricCard title="Recent Event" value={classBData?.recentEvent?.name ?? "—"} />
        </div>
      </div>

    </div>
  );
}
