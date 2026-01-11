"use client";
import React, { useState } from "react";
import {
    Sun,
    Moon,
    Users,
    Edit2,
    Save,
    CalendarDays,
} from "lucide-react";

/* ---------------- MOCK DATA (Replace with API later) ---------------- */

const classesList = [
    { id: 1, dept: "CSE", year: "3rd Year", div: "A", totalStudents: 60 },
    { id: 2, dept: "ECE", year: "2nd Year", div: "B", totalStudents: 55 },
];

/* ---------------- MAIN COMPONENT ---------------- */

const AttendanceComponent = () => {
    const [records, setRecords] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        date: "",
        classId: "",
        morningCount: "",
        morningEvent: "",
        afternoonCount: "",
        afternoonEvent: "",
    });

    /* ---------------- HANDLERS ---------------- */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.classId || !form.date) return;

        const cls = classesList.find(
            (c) => c.id === Number(form.classId)
        );

        setRecords((prev) => [
            ...prev,
            {
                id: Date.now(),
                date: form.date,
                className: `${cls.dept} ${cls.year} ${cls.div}`,
                totalStudents: cls.totalStudents,
                morning: {
                    count: Number(form.morningCount || 0),
                    event: form.morningEvent,
                },
                afternoon: {
                    count: Number(form.afternoonCount || 0),
                    event: form.afternoonEvent,
                },
            },
        ]);

        setForm({
            date: "",
            classId: "",
            morningCount: "",
            morningEvent: "",
            afternoonCount: "",
            afternoonEvent: "",
        });
    };

    const handleSave = (id, updated) => {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
        );
        setEditingId(null);
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen bg-slate-100 p-6 ">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER */}
                <h1 className="text-4xl font-bold text-center text-slate-800">
                    Daily Attendance Management
                </h1>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className=" p-6 rounded-2xl shadow-lg space-y-6 "
                >
                    <h2 className="text-2xl font-semibold text-slate-700">
                        Mark Attendance
                    </h2>

                    {/* DATE + CLASS */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <CalendarDays className="text-indigo-600" />
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        <select
                            name="classId"
                            value={form.classId}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg"
                            required
                        >
                            <option value="">Select Class</option>
                            {classesList.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.dept} {cls.year} {cls.div} (Total {cls.totalStudents})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* MORNING & AFTERNOON */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* MORNING */}
                        <div className="bg-yellow-50 p-4 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 font-semibold text-yellow-700">
                                <Sun size={18} /> Morning Session
                            </div>

                            <input
                                type="number"
                                name="morningCount"
                                min="0"
                                placeholder="Present Students"
                                value={form.morningCount}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />

                            <input
                                type="text"
                                name="morningEvent"
                                placeholder="Event (optional)"
                                value={form.morningEvent}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* AFTERNOON */}
                        <div className="bg-indigo-50 p-4 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 font-semibold text-indigo-700">
                                <Moon size={18} /> Afternoon Session
                            </div>

                            <input
                                type="number"
                                name="afternoonCount"
                                min="0"
                                placeholder="Present Students"
                                value={form.afternoonCount}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />

                            <input
                                type="text"
                                name="afternoonEvent"
                                placeholder="Event (optional)"
                                value={form.afternoonEvent}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                    </div>

                    <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                        Save Attendance
                    </button>
                </form>

                {/* RECORDS */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-700">
                        Attendance Records
                    </h2>

                    {records.map((rec) => (
                        <AttendanceCard
                            key={rec.id}
                            record={rec}
                            isEditing={editingId === rec.id}
                            onEdit={() => setEditingId(rec.id)}
                            onSave={handleSave}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

/* ---------------- RECORD CARD ---------------- */

const AttendanceCard = ({ record, isEditing, onEdit, onSave }) => {
    const [editData, setEditData] = useState(record);

    return (
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold">
                        {record.className}
                    </h3>

                    <p className="text-sm text-slate-500">
                        📅 {record.date}
                    </p>

                    <p className="mt-2 text-slate-700">
                        🌅 Morning: {record.morning.count}
                        {record.morning.event && (
                            <span className="text-sm text-slate-500">
                                {" "} | 📌 {record.morning.event}
                            </span>
                        )}
                    </p>

                    <p className="text-slate-700">
                        🌇 Afternoon: {record.afternoon.count}
                        {record.afternoon.event && (
                            <span className="text-sm text-slate-500">
                                {" "} | 📌 {record.afternoon.event}
                            </span>
                        )}
                    </p>
                </div>

                {!isEditing ? (
                    <button onClick={onEdit}>
                        <Edit2 className="text-indigo-600" />
                    </button>
                ) : (
                    <button
                        onClick={() =>
                            onSave(record.id, {
                                ...editData,
                                morning: {
                                    ...editData.morning,
                                    count: Number(editData.morning.count),
                                },
                                afternoon: {
                                    ...editData.afternoon,
                                    count: Number(editData.afternoon.count),
                                },
                            })
                        }
                    >
                        <Save className="text-green-600" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AttendanceComponent;
