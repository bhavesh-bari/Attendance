// /components/ExportButtons.js
import React from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const ExportButtons = () => {
    // Basic function placeholders for demonstration
    const handleExportCSV = () => {
        alert('Exporting data to CSV...');
        // In a real application, this would trigger an API endpoint or client-side data conversion.
    };

    const handleExportPDF = () => {
        alert('Generating PDF report...');
        // In a real application, this would likely use a library like html2canvas + jsPDF or a server-side rendering service.
    };

    const baseButtonClasses = "flex items-center justify-center space-x-2 px-5 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] w-full";

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Export Dashboard Data</h3>

            <button
                onClick={handleExportCSV}
                className={`${baseButtonClasses} text-white bg-green-600 hover:bg-green-700`}
            >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download CSV</span>
            </button>

            <button
                onClick={handleExportPDF}
                className={`${baseButtonClasses} text-white bg-indigo-600 hover:bg-indigo-700`}
            >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Generate PDF Report</span>
            </button>

            <p className="text-xs text-gray-500 pt-2 text-center">Exports include current filters and visible charts.</p>
        </div>
    );
};

export default ExportButtons;