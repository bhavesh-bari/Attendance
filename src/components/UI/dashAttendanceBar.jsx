"use client";
import React, { useRef, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer, LabelList,
} from "recharts";
import { Download, Loader2, FileBarChart } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 🎨 FIXED COLOR PALETTE
const departmentColorPalette = [
    "#1E90FF", "#28A745", "#FF8C00", "#8A2BE2", "#DC143C",
    "#20B2AA", "#FF1493", "#6A5ACD", "#708090", "#A0522D",
];

const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) + amt;
    const g = ((num >> 8) & 0x00ff) + amt;
    const b = (num & 0x0000ff) + amt;
    return "#" + (0x1000000 + (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 + (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 + (b < 255 ? (b < 1 ? 0 : b) : 255)).toString(16).slice(1);
};

const getDepartmentColors = (departments) => {
    const deptColorMap = {};
    departments.forEach((dept, index) => {
        const base = departmentColorPalette[index % departmentColorPalette.length];
        deptColorMap[dept] = {
            afternoon: base,
            morning: lightenColor(base, 38),
        };
    });
    return deptColorMap;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const department = payload[0].payload.department;
        return (
            <div className="bg-white border rounded-lg shadow-md p-3 text-sm z-50">
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-gray-600 mb-1">Department: {department}</p>
                {payload.map((entry) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: <span className="font-semibold">{entry.value}%</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DepartmentBarChart({ data = [] ,
        filterType = "overall",
    customDate = null,
    dateRange = { start: null, end: null }
}) {
    const scrollContainerRef = useRef(null);
    const chartContentRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    function buildPDFFileName(filterType, customDate, dateRange) {
        let name = "Attendance_Chart";

        if (filterType === "today") {
            const today = new Date().toISOString().split("T")[0];
            name = `Attendance_${today}`;
        }

        if (filterType === "thisMonth") {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            name = `Attendance_${month}-${year}`;
        }

        if (filterType === "overall") {
            const year = new Date().getFullYear();
            name = `Attendance_Overall_${year}`;
        }

        if (filterType === "date") {
            name = `Attendance_${customDate}`;
        }

        if (filterType === "range") {
            name = `Attendance_${dateRange.start}_to_${dateRange.end}`;
        }

        return name + ".pdf";
    }
    const formattedData = data.map(item => ({
        name: item.className,
        department: item.department || "Unknown",
        morning: parseFloat(item.morningPercent),
        afternoon: parseFloat(item.afternoonPercent)
    }));

    const deptNames = [...new Set(formattedData.map(d => d.department))];
    const deptColorMap = getDepartmentColors(deptNames);

    // Dynamic Width Calculation
    const dynamicWidth = Math.max(1000, formattedData.length * 80);

    // --- PDF EXPORT FUNCTION ---
    const handleDownloadPDF = async () => {
        if (!scrollContainerRef.current || !chartContentRef.current) return;
        setIsDownloading(true);

        try {
            const scrollContainer = scrollContainerRef.current;
            const originalOverflow = scrollContainer.style.overflow;

            // 1. Temporarily expand scroll container
            scrollContainer.style.overflow = "visible";
            scrollContainer.style.width = "fit-content";

            // Wait for DOM to repaint
            await new Promise(resolve => setTimeout(resolve, 100));

            // 2. Generate Canvas
            const canvas = await html2canvas(chartContentRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                width: dynamicWidth,
                windowWidth: dynamicWidth,

                onclone: (documentClone) => {
                    // Fix Scroll in clone
                    const clonedScroll = documentClone.getElementById('chart-scroll-container');
                    const clonedInner = documentClone.getElementById('chart-inner-container');
                    if (clonedScroll && clonedInner) {
                        clonedScroll.style.overflow = 'visible';
                        clonedScroll.style.width = 'auto';
                        clonedInner.style.width = `${dynamicWidth}px`;
                    }

                    // Remove Tooltips
                    const tooltips = documentClone.querySelectorAll('.recharts-tooltip-wrapper');
                    tooltips.forEach(el => el.remove());

                    // Force HEX colors to fix "lab" error
                    if (clonedInner) {
                        clonedInner.style.color = '#374151';
                        clonedInner.style.borderColor = '#e5e7eb';
                    }
                }
            });

            // 3. Restore UI
            scrollContainer.style.overflow = originalOverflow;
            scrollContainer.style.width = "100%";

            // 4. Generate PDF
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const margin = 10;
            const maxImgWidth = pageWidth - (margin * 2);
            const maxImgHeight = pageHeight - (margin * 2);

            const imgRatio = canvas.width / canvas.height;
            let finalWidth = maxImgWidth;
            let finalHeight = finalWidth / imgRatio;

            if (finalHeight > maxImgHeight) {
                finalHeight = maxImgHeight;
                finalWidth = finalHeight * imgRatio;
            }

            pdf.setFontSize(14);
            pdf.text("Department Attendance Report", margin, margin + 5);

            // Center the image
            const xPos = (pageWidth - finalWidth) / 2;
            pdf.addImage(imgData, 'PNG', xPos, margin + 15, finalWidth, finalHeight);
            const fileName = buildPDFFileName(
                filterType,
                customDate,
                dateRange
            );

            pdf.save(fileName);

        } catch (error) {
            console.error("PDF Export failed", error);
            alert("Export failed. Please check console.");
        } finally {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.overflow = "auto";
                scrollContainerRef.current.style.width = "100%";
            }
            setIsDownloading(false);
        }
    };

    if (formattedData.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                <FileBarChart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No attendance data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Attendance Overview</h2>
                    <p className="text-sm text-gray-500">Compare morning vs afternoon performance</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {isDownloading ? "Generating PDF..." : "Export Chart"}
                </button>
            </div>

            <div
                ref={scrollContainerRef}
                id="chart-scroll-container"
                className="w-full overflow-x-auto custom-scrollbar hide-scrollbar pb-6 "
            >
                <div
                    ref={chartContentRef}
                    id="chart-inner-container"
                    style={{
                        minWidth: dynamicWidth,
                        height: "550px",
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        fontFamily: 'sans-serif'
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            barGap={12}
                            // INCREASED TOP MARGIN (from 30 to 50) so Labels don't get cut off
                            margin={{ top: 50, right: 30, left: 20, bottom: 60 }}
                            barCategoryGap="25%"
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                interval={0}
                                angle={0}
                                dy={10}
                                tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 600 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />

                            {/* ❗ CRITICAL: isAnimationActive={false} 
                                This ensures bars (and labels) render instantly for the screenshot. 
                            */}

                            {/* Morning Bar */}
                            <Bar
                                dataKey="morning"
                                name="Morning"
                                radius={[6, 6, 0, 0]}
                                barSize={45}
                                isAnimationActive={false}
                            >
                                {formattedData.map((entry, i) => (
                                    <Cell key={`morning-cell-${i}`} fill={deptColorMap[entry.department]?.morning || "#ccc"} />
                                ))}
                                <LabelList
                                    dataKey="morning"
                                    position="insideTop"
                                    offset={10}
                                    formatter={(v) => `${v}%`}
                                    style={{ fill: "#FFFFFF", fontWeight: "800", fontSize: 11 }}
                                />
                            </Bar>

                            {/* Afternoon Bar */}
                            <Bar
                                dataKey="afternoon"
                                name="Afternoon"
                                radius={[6, 6, 0, 0]}
                                barSize={45}
                                isAnimationActive={false}
                            >
                                {formattedData.map((entry, i) => (
                                    <Cell key={`afternoon-cell-${i}`} fill={deptColorMap[entry.department]?.afternoon || "#888"} />
                                ))}
                                <LabelList
                                    dataKey="afternoon"
                                    position="top"
                                    offset={5}
                                    formatter={(v) => `${v}%`}
                                    style={{ fill: "#1f2937", fontWeight: "800", fontSize: 11 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            <div className="space-y-4">
                <div className="flex justify-center items-center gap-6 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-md bg-gray-300 opacity-60"></div>
                        <span className="text-gray-600">Morning Shift (Light)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-md bg-gray-600"></div>
                        <span className="text-gray-600">Afternoon Shift (Dark)</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center pt-2">
                    {deptNames.map((dept) => (
                        <div key={dept} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 transition-colors hover:border-gray-300">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: deptColorMap[dept]?.afternoon }}></div>
                            <span className="text-xs font-bold text-gray-700">{dept}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}