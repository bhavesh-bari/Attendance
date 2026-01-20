"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Sun,
    Moon,
    Save,
    Building2,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    History,
    LayoutDashboard,
    Loader2,
    ChevronRight,
    AlertCircle
} from "lucide-react";

/* ---------------- HELPER COMPONENTS ---------------- */

const InputGroup = ({ label, icon: Icon, children, error, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
        <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                {Icon && <Icon size={14} />}
                {label}
            </label>
            {error && (
                <span className="text-xs text-red-500 font-medium flex items-center gap-1 animate-pulse">
                    <AlertCircle size={12} /> {error}
                </span>
            )}
        </div>
        {children}
    </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

const AttendanceComponent = () => {

    const { data: session } = useSession();
    const [selectedClassDept, setSelectedClassDept] = useState("");

    // State
    const [department, setDepartment] = useState(null);
    const [classes, setClasses] = useState([]);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Validation States
    const [selectedClassLimit, setSelectedClassLimit] = useState(0);
    const [errors, setErrors] = useState({});

    // Form State
    const [form, setForm] = useState({
        classId: "",
        className: "",
        MornCount: "",
        MEventName: "",
        AftCount: "",
        AEventName: "",
    });

    // Current Date Formatter
    const todayDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    /* ---------------- LOGIC: AUTO-SET DEPARTMENT ---------------- */
    useEffect(() => {
        if (!session?.user) return;

        if (session.user.role === "AMC") {
            setDepartment("all");
        } else if (session.user.role === "Department Dean") {
            setDepartment(session.user.department);
        }
    }, [session]);

    /* ---------------- FETCH DATA ---------------- */

    const fetchClasses = async () => {
        try {
            const res = await fetch("/api/attendance/getclasses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ department }),
            });
            const data = await res.json();
            if (data.success) setClasses(data.classes);
        } catch (error) {
            console.error("Failed to fetch classes");
        }
    };

    const fetchToday = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/attendance/getattendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ department }),
            });
            const data = await res.json();
            if (data.success) setRecords(data.attendances);
        } catch (error) {
            console.error("Failed to fetch attendance");
        } finally {
            setIsLoading(false);
        }
    };

    // Only fetch when department is set
    useEffect(() => {
        if (!department) return;

        fetchClasses();
        fetchToday();
    }, [department]);

    /* ---------------- HANDLERS ---------------- */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "MornCount" || name === "AftCount") {
            const numValue = Number(value);
            if (selectedClassLimit > 0 && numValue > selectedClassLimit) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Exceeds total students (${selectedClassLimit})`
                }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    const handleClassChange = (e) => {
        const cls = classes.find((c) => c._id === e.target.value);

        if (cls) {
            setForm((prev) => ({
                ...prev,
                classId: cls._id,
                className: cls.name,
                MornCount: "",
                AftCount: "",
            }));

            setSelectedClassLimit(cls.totalStudents || 0);
            setSelectedClassDept(cls.department); // ✅ ADD THIS
            setErrors({});
        } else {
            setForm(prev => ({ ...prev, classId: "", className: "" }));
            setSelectedClassLimit(0);
            setSelectedClassDept(""); // ✅ RESET
            setErrors({});
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) return;

        setIsSaving(true);
        try {
            await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    department: selectedClassDept,
                    date: new Date(),
                    MornCount: Number(form.MornCount || 0),
                    AftCount: Number(form.AftCount || 0),
                }),
            });

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            setForm({
                classId: "",
                className: "",
                MornCount: "",
                MEventName: "",
                AftCount: "",
                AEventName: "",
            });
            setSelectedClassLimit(0);
            setErrors({});
            fetchToday();
        } catch (error) {
            console.error("Error saving");
        } finally {
            setIsSaving(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 text-gray-800 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                            <LayoutDashboard className="text-indigo-600" />
                            Daily Attendance
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <Calendar size={16} /> {todayDate}
                        </p>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-4 text-sm font-medium">
                        <span className="text-gray-500">Records Today:</span>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{records.length}</span>
                    </div>
                </div>



                <div className="grid lg:grid-cols-12 gap-8">

                    {/* --- LEFT: ENTRY FORM --- */}
                    <div className="lg:col-span-7 space-y-6">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hide-scrollbar"
                        >
                            {/* Card Header */}
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <Clock size={18} className="text-gray-400" />
                                    New Entry
                                </h2>
                                {showSuccess && (
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Saved Successfully
                                    </span>
                                )}
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Class Selection */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-bold text-gray-700">Select Class</label>
                                        {selectedClassLimit > 0 && (
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                Max Capacity: {selectedClassLimit}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={form.classId}
                                            onChange={handleClassChange}
                                            className="w-full p-4 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-700 cursor-pointer"
                                            required
                                        >
                                            <option value="">-- Choose a Class --</option>
                                            {classes.map((cls) => (
                                                <option key={cls._id} value={cls._id}>
                                                    {cls.name} ({cls.department})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={18} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* MORNING SECTION */}
                                    <div className="space-y-4 bg-amber-50/50 p-5 rounded-2xl border border-amber-100 hover:border-amber-200 transition-colors">
                                        <div className="flex items-center gap-2 text-amber-600 font-bold border-b border-amber-200 pb-2 mb-2">
                                            <Sun className="fill-amber-400" size={20} />
                                            <h3>Morning Shift</h3>
                                        </div>

                                        <InputGroup
                                            label="Headcount"
                                            icon={Users}
                                            error={errors.MornCount}
                                        >
                                            <input
                                                type="number"
                                                name="MornCount"
                                                min="0"
                                                max={selectedClassLimit || undefined}
                                                placeholder="0"
                                                value={form.MornCount}
                                                onChange={handleChange}
                                                disabled={!form.classId}
                                                className={`w-full p-3 bg-white border rounded-lg focus:ring-2 outline-none text-2xl font-bold text-gray-700 text-center placeholder:text-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                                ${errors.MornCount
                                                        ? "border-red-300 focus:ring-red-400 text-red-600"
                                                        : "border-amber-200 focus:ring-amber-400"}`}
                                            />
                                        </InputGroup>

                                        <InputGroup label="Event Name (Optional)" icon={Calendar}>
                                            <input
                                                type="text"
                                                name="MEventName"
                                                placeholder="e.g. Workshop"
                                                value={form.MEventName}
                                                onChange={handleChange}
                                                disabled={!form.classId}
                                                className="w-full p-2.5 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none text-sm disabled:bg-gray-100"
                                            />
                                        </InputGroup>
                                    </div>

                                    {/* AFTERNOON SECTION */}
                                    <div className="space-y-4 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 hover:border-indigo-200 transition-colors">
                                        <div className="flex items-center gap-2 text-indigo-600 font-bold border-b border-indigo-200 pb-2 mb-2">
                                            <Moon className="fill-indigo-400" size={20} />
                                            <h3>Afternoon Shift</h3>
                                        </div>

                                        <InputGroup
                                            label="Headcount"
                                            icon={Users}
                                            error={errors.AftCount}
                                        >
                                            <input
                                                type="number"
                                                name="AftCount"
                                                min="0"
                                                max={selectedClassLimit || undefined}
                                                placeholder="0"
                                                value={form.AftCount}
                                                onChange={handleChange}
                                                disabled={!form.classId}
                                                className={`w-full p-3 bg-white border rounded-lg focus:ring-2 outline-none text-2xl font-bold text-gray-700 text-center placeholder:text-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                                ${errors.AftCount
                                                        ? "border-red-300 focus:ring-red-400 text-red-600"
                                                        : "border-indigo-200 focus:ring-indigo-400"}`}
                                            />
                                        </InputGroup>

                                        <InputGroup label="Event Name (Optional)" icon={Calendar}>
                                            <input
                                                type="text"
                                                name="AEventName"
                                                placeholder="e.g. Lab Exam"
                                                value={form.AEventName}
                                                onChange={handleChange}
                                                disabled={!form.classId}
                                                className="w-full p-2.5 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm disabled:bg-gray-100"
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>

                            {/* Form Footer */}
                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={isSaving || !form.classId || Object.keys(errors).length > 0}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99]
                                    ${isSaving || !form.classId || Object.keys(errors).length > 0
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
                                        }`}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                                    {isSaving ? "Saving Entry..." : "Submit Attendance"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- RIGHT: RECORDS LIST (Unchanged) --- */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <History className="text-gray-400" />
                                Recent Entries
                            </h2>
                            <span className="text-xs text-gray-400 font-medium">Auto-updates</span>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3">
                                <Loader2 className="animate-spin" size={32} />
                                <p>Loading records...</p>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center space-y-3">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                    <LayoutDashboard size={32} />
                                </div>
                                <h3 className="text-gray-600 font-medium">No records yet</h3>
                                <p className="text-gray-400 text-sm">Select a class on the left to start marking attendance for today.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar hide-scrollbar">
                                {records.map((rec) => (
                                    <div
                                        key={rec._id}
                                        className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                    Class
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-800 leading-none">
                                                    {rec.className}
                                                </h3>
                                            </div>
                                            <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-mono">
                                                {new Date(rec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex flex-col items-center">
                                                <span className="text-xs text-amber-600 font-semibold mb-1 flex items-center gap-1">
                                                    <Sun size={10} /> Morning
                                                </span>
                                                <span className="text-xl font-bold text-gray-800">{rec.MornCount}</span>
                                                {rec.MEventName && (
                                                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-1 truncate max-w-full">
                                                        {rec.MEventName}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 flex flex-col items-center">
                                                <span className="text-xs text-indigo-600 font-semibold mb-1 flex items-center gap-1">
                                                    <Moon size={10} /> Afternoon
                                                </span>
                                                <span className="text-xl font-bold text-gray-800">{rec.AftCount}</span>
                                                {rec.AEventName && (
                                                    <span className="text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded mt-1 truncate max-w-full">
                                                        {rec.AEventName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AttendanceComponent;