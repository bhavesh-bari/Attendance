"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Plus,
    Search,
    Trash2,
    Edit2,
    Save,
    X,
    GraduationCap,
    Building2,
    CheckCircle,
    AlertCircle,
    Loader2,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// Helper to map DB year (number) to Dropdown string
const getYearLabel = (num) => {
    if (num === 1) return '1st Year';
    if (num === 2) return '2nd Year';
    if (num === 3) return '3rd Year';
    if (num === 4) return '4th Year';
    return `${num}th Year`;
};

/* ---------------- SKELETON COMPONENTS ---------------- */

const Skeleton = ({ className }) => (
    <div className={`bg-slate-200 animate-pulse rounded-md ${className}`} />
);

const ManagementSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Controls Toolbar Skeleton */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-center">
            <Skeleton className="h-10 w-full xl:w-96 rounded-xl" />
            <div className="flex gap-3 w-full xl:w-auto justify-end">
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-20 rounded" />
                        <Skeleton className="h-6 w-12 rounded" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-3/4 rounded" />
                        <Skeleton className="h-5 w-1/2 rounded" />
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

const DepartmentCRUDComponent = () => {
    // --- State Management ---
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const [stats, setStats] = useState({
        classes: 0,
        students: 0,
        departments: 0
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        year: '',
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    const [newRecord, setNewRecord] = useState({
        dept: '',
        year: YEAR_OPTIONS[0],
        div: '',
        numberOfStudents: '',
    });

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    // --- Helpers ---
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- API Calls ---
    const fetchClasses = async () => {
        try {
            const res = await fetch('/api/classes');
            const data = await res.json();
            if (data.success) {
                setRecords(data.classes);
                setStats({
                    classes: data.totalClasses,
                    students: data.totalStudents[0]?.total || 0,
                    departments: data.totaldepartments
                });
            }
        } catch (error) {
            console.error("Failed to fetch classes", error);
            showNotification("Failed to load data", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // --- Logic: Filtering & Sorting ---
    const uniqueDepartments = useMemo(() => {
        const depts = new Set(records.map(r => r.department));
        return Array.from(depts).sort();
    }, [records]);

    const processedRecords = useMemo(() => {
        let result = [...records];
        if (filters.department) result = result.filter(r => r.department === filters.department);
        if (filters.year) result = result.filter(r => getYearLabel(r.year) === filters.year);
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.department.toLowerCase().includes(lowerQuery) ||
                r.division.toLowerCase().includes(lowerQuery) ||
                r.name.toLowerCase().includes(lowerQuery)
            );
        }
        result.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];
            if (sortConfig.key === 'totalStudents' || sortConfig.key === 'year') {
                valA = Number(valA);
                valB = Number(valB);
            }
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [records, filters, searchQuery, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleNewRecordChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        if (newRecord.dept && newRecord.div) {
            try {
                const res = await fetch('/api/classes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecord)
                });
                const data = await res.json();
                if (data.success) {
                    setRecords(prev => [data.class, ...prev]);
                    setNewRecord({ dept: '', year: YEAR_OPTIONS[0], div: '', numberOfStudents: '' });
                    setIsFormOpen(false);
                    fetchClasses();
                    showNotification('Class added successfully');
                } else {
                    showNotification(data.error, "error");
                }
            } catch (error) { showNotification("Server error", "error"); }
        }
    };

    const handleEditStart = (record) => {
        setEditingId(record._id);
        setEditData({
            id: record._id,
            dept: record.department,
            year: getYearLabel(record.year),
            div: record.division,
            numberOfStudents: record.totalStudents
        });
    };

    const handleUpdateRecord = async () => {
        try {
            const res = await fetch('/api/classes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            const data = await res.json();
            if (data.success) {
                setRecords(prev => prev.map(r => r._id === editingId ? data.class : r));
                setEditingId(null);
                fetchClasses();
                showNotification('Class updated successfully');
            } else {
                showNotification(data.error, "error");
            }
        } catch (error) { showNotification("Server error", "error"); }
    };

    const handleDeleteRecord = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                const res = await fetch(`/api/classes?id=${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    setRecords(prev => prev.filter(r => r._id !== id));
                    fetchClasses();
                    showNotification('Class removed', 'error');
                } else {
                    showNotification(data.error, "error");
                }
            } catch (error) { showNotification("Server error", "error"); }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
            {/* 1. Header & Stats */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <GraduationCap className="text-indigo-600" />
                                Class Management
                            </h1>
                            <p className="text-sm text-slate-500">Manage academic structure and capacity</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-3 text-sm min-w-fit">
                            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex flex-col items-center justify-center min-w-[100px]">
                                {isLoading && records.length === 0 ? <Skeleton className="h-6 w-8 mb-1" /> : <Building2 className="text-blue-500 mb-1" size={18} />}
                                <span className="block text-blue-700 font-bold text-lg">{stats.departments}</span>
                                <span className="text-blue-800/60 text-xs uppercase font-semibold">Depts</span>
                            </div>
                            <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex flex-col items-center justify-center min-w-[100px]">
                                {isLoading && records.length === 0 ? <Skeleton className="h-6 w-8 mb-1" /> : <GraduationCap className="text-indigo-500 mb-1" size={18} />}
                                <span className="block text-indigo-700 font-bold text-lg">{stats.classes}</span>
                                <span className="text-indigo-800/60 text-xs uppercase font-semibold">Classes</span>
                            </div>
                            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex flex-col items-center justify-center min-w-[100px]">
                                {isLoading && records.length === 0 ? <Skeleton className="h-6 w-8 mb-1" /> : <Users className="text-emerald-500 mb-1" size={18} />}
                                <span className="block text-emerald-700 font-bold text-lg">{stats.students}</span>
                                <span className="text-emerald-800/60 text-xs uppercase font-semibold">Students</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {isLoading && records.length === 0 ? (
                <ManagementSkeleton />
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-500">
                    {/* 2. Controls Toolbar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full xl:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search class, dept..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                            <div className="relative">
                                <select
                                    value={filters.department}
                                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <option value="">All Depts</option>
                                    {uniqueDepartments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                            </div>

                            <div className="relative">
                                <select
                                    value={filters.year}
                                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <option value="">All Years</option>
                                    {YEAR_OPTIONS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                            </div>

                            <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>

                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => handleSort('totalStudents')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${sortConfig.key === 'totalStudents' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Users size={14} /> Count
                                    {sortConfig.key === 'totalStudents' && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                                </button>
                                <button
                                    onClick={() => handleSort('year')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${sortConfig.key === 'year' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <GraduationCap size={14} /> Year
                                    {sortConfig.key === 'year' && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                                </button>
                            </div>

                            <button
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm text-sm ml-2 ${isFormOpen
                                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                    }`}
                            >
                                {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                                {isFormOpen ? 'Close' : 'Add Class'}
                            </button>
                        </div>
                    </div>

                    {/* 3. Add Class Form */}
                    {isFormOpen && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-fade-in-down">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Class</h3>
                            <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Department</label>
                                    <input required name="dept" value={newRecord.dept} onChange={handleNewRecordChange} placeholder="e.g. CSE" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Year</label>
                                    <select name="year" value={newRecord.year} onChange={handleNewRecordChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Division</label>
                                    <input required name="div" value={newRecord.div} onChange={handleNewRecordChange} placeholder="e.g. A" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Capacity</label>
                                    <input required type="number" min="0" name="numberOfStudents" value={newRecord.numberOfStudents} onChange={handleNewRecordChange} placeholder="0" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors h-[46px]">
                                    Save Class
                                </button>
                            </form>
                        </div>
                    )}

                    {/* 4. Data Grid */}
                    {processedRecords.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <h3 className="text-lg font-medium text-slate-600">No classes found</h3>
                            <p className="text-slate-400">Try adjusting your filters or search query.</p>
                            <button onClick={() => { setSearchQuery(''); setFilters({ department: '', year: '' }) }} className="mt-4 text-indigo-600 font-medium hover:underline">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {processedRecords.map(record => {
                                const isEditing = editingId === record._id;
                                const yearLabel = getYearLabel(record.year);
                                return (
                                    <div key={record._id} className={`relative group bg-white rounded-2xl transition-all duration-300 ${isEditing ? 'ring-2 ring-indigo-500 shadow-xl z-10' : 'border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}>
                                        {isEditing ? (
                                            <div className="p-5 space-y-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-1"><Edit2 size={12} /> Editing</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input name="dept" value={editData.dept} onChange={handleEditChange} className="w-full p-2 border rounded text-sm" placeholder="Dept" />
                                                    <input name="div" value={editData.div} onChange={handleEditChange} className="w-full p-2 border rounded text-sm" placeholder="Div" />
                                                </div>
                                                <select name="year" value={editData.year} onChange={handleEditChange} className="w-full p-2 border rounded text-sm bg-white">
                                                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                                <input type="number" name="numberOfStudents" value={editData.numberOfStudents} onChange={handleEditChange} className="w-full p-2 border rounded text-sm" placeholder="Capacity" />
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={handleUpdateRecord} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-5 h-full flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${record.year === 4 ? 'bg-purple-50 text-purple-700' :
                                                            record.year === 1 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {yearLabel}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-slate-400">
                                                            <Users size={14} />
                                                            <span className="text-sm font-semibold">{record.totalStudents}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-1">
                                                        <h3 className="text-xl font-bold text-slate-800">{record.department}</h3>
                                                        <p className="text-slate-500 font-medium">Division {record.division}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditStart(record)}
                                                        className="text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteRecord(record._id)}
                                                        className="text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up z-50 ${notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-800 text-white'}`}>
                    {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default DepartmentCRUDComponent;