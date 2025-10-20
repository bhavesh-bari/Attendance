"use client";
import React, { useState } from 'react';


const YEAR_OPTIONS = ['2nd Year', '3rd Year', '4th Year'];


const initialData = [
    { id: 1, dept: 'CSE', year: '3rd Year', div: 'A', numberOfStudents: 60 },
    { id: 2, dept: 'ECE', year: '2nd Year', div: 'B', numberOfStudents: 55 },
];

const DepartmentCRUDComponent = () => {
    const [records, setRecords] = useState(initialData);
    const [newRecord, setNewRecord] = useState({
        dept: '',
        year: YEAR_OPTIONS[0],
        div: '',
        numberOfStudents: 0,
    });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    // --- Handlers (CRUD logic remains the same) ---

    const handleNewRecordChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prevData => ({
            ...prevData,
            [name]: name === 'numberOfStudents' ? Number(value) : value
        }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevData => ({
            ...prevData,
            [name]: name === 'numberOfStudents' ? Number(value) : value
        }));
    };

    // CREATE Operation (with simple "new" animation effect)
    const handleAddRecord = (e) => {
        e.preventDefault();
        if (newRecord.dept && newRecord.year) {
            const recordToAdd = { ...newRecord, id: Date.now() };
            setRecords(prev => [...prev, recordToAdd]);
            // Reset the form
            setNewRecord({ dept: '', year: YEAR_OPTIONS[0], div: '', numberOfStudents: 0 });
        }
    };

    // READ & EDIT Mode Toggle
    const handleEditStart = (record) => {
        setEditingId(record.id);
        setEditData(record);
    };

    // UPDATE Operation
    const handleUpdateRecord = () => {
        setRecords(prevRecords =>
            prevRecords.map(record =>
                record.id === editingId ? editData : record
            )
        );
        setEditingId(null);
    };

    // DELETE Operation
    const handleDeleteRecord = (id) => {
        setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    };

    // --- Tailwind Components/Render Methods ---

    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";
    const baseButtonClasses = "px-4 py-2 font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300";

    // Input Form (CREATE)
    const renderInputForm = () => (
        <form
            onSubmit={handleAddRecord}
            // Realistic and Colored Card styling
            className="p-6 space-y-4 bg-white rounded-xl shadow-xl border-t-4 border-indigo-500"
        >
            <h3 className="text-2xl font-bold text-gray-800">Add New Class Data 📝</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text" name="dept" placeholder="Department (e.g., CSE)"
                    value={newRecord.dept} onChange={handleNewRecordChange} required
                    className={inputClasses}
                />
                <select
                    name="year" value={newRecord.year} onChange={handleNewRecordChange}
                    className={inputClasses}
                >
                    {YEAR_OPTIONS.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <input
                    type="text" name="div" placeholder="Division (e.g., A)"
                    value={newRecord.div} onChange={handleNewRecordChange}
                    className={inputClasses}
                />
                <input
                    type="number" name="numberOfStudents" placeholder="No. of Students"
                    value={newRecord.numberOfStudents} onChange={handleNewRecordChange} min="0"
                    className={inputClasses}
                />
            </div>

            <button
                type="submit"
                className={`${baseButtonClasses} w-full bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01]`}
            >
                Create Record
            </button>
        </form>
    );

    // Single Record Item (READ/UPDATE/DELETE)
    const renderRecordItem = (record) => {
        const isEditing = record.id === editingId;

        // Realistic and Animated Card styling
        const itemClasses = `p-4 border-l-4 rounded-lg transition-all duration-300 
                             ${isEditing
                ? 'bg-yellow-50 border-yellow-500 shadow-lg' // Edit Mode
                : 'bg-white border-green-500 shadow hover:shadow-xl hover:scale-[1.01] cursor-pointer' // Read Mode
            }`;

        return (
            <div key={record.id} className={itemClasses}>
                {isEditing ? (
                    // --- EDIT MODE (Update) ---
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input name="dept" value={editData.dept} onChange={handleEditChange} className={inputClasses} />
                            <select name="year" value={editData.year} onChange={handleEditChange} className={inputClasses}>
                                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <input name="div" value={editData.div} onChange={handleEditChange} className={inputClasses} />
                            <input type="number" name="numberOfStudents" value={editData.numberOfStudents} onChange={handleEditChange} className={inputClasses} />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleUpdateRecord} className={`${baseButtonClasses} bg-green-500 hover:bg-green-600`}>Save</button>
                            <button onClick={() => setEditingId(null)} className={`${baseButtonClasses} bg-gray-500 hover:bg-gray-600`}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    // --- VIEW MODE (Read) ---
                    <div className="flex justify-between items-center">
                        <div className="text-gray-700">
                            <p className="font-bold text-lg">{record.dept} - {record.year}</p>
                            <p className="text-sm">Division: {record.div} | Students: {record.numberOfStudents}</p>
                        </div>

                        <div className="flex space-x-2">
                            <button onClick={() => handleEditStart(record)} className="text-blue-600 hover:text-blue-800 transition-colors">Edit ✏️</button>
                            <button onClick={() => handleDeleteRecord(record.id)} className="text-red-600 hover:text-red-800 transition-colors">Delete 🗑️</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans overflow-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-900">Class Data CRUD System ✨</h1>

                {renderInputForm()}

                <div className="border-b border-gray-300 pb-4">
                    <h2 className="text-3xl font-semibold text-gray-800">Existing Records ({records.length})</h2>
                </div>

                <div className="space-y-4">
                    {records.map(renderRecordItem)}
                </div>
            </div>
        </div>
    );
};

export default DepartmentCRUDComponent;