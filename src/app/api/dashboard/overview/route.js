import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

function getAcademicYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return month >= 5
        ? `${year}-${String(year + 1).slice(2)}`
        : `${year - 1}-${String(year).slice(2)}`;
}

export async function GET() {
    try {
        await connectDB();

        const academicYear = getAcademicYear();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const classes = await Class.find({ academicYear });
        const classMap = {};
        classes.forEach(c => (classMap[c._id.toString()] = c));

        const calcPercent = (d, total) =>
            total ? ((d.MornCount + d.AftCount) / 2 / total) * 100 : 0;

        const todayData = await Attendance.find({ date: today, academicYear });
        const yesterdayData = await Attendance.find({ date: yesterday, academicYear });

        const todayAvg =
            todayData.reduce((s, d) => s + calcPercent(d, classMap[d.classId]?.totalStudents), 0) /
            (todayData.length || 1);

        const yesterdayAvg =
            yesterdayData.reduce((s, d) => s + calcPercent(d, classMap[d.classId]?.totalStudents), 0) /
            (yesterdayData.length || 1);

        let bestClass = null;
        let worstClass = null;

        todayData.forEach(d => {
            const percent = calcPercent(d, classMap[d.classId]?.totalStudents);

            if (!bestClass || percent > bestClass.percent)
                bestClass = { ...d.toObject(), percent };

            if (!worstClass || percent < worstClass.percent)
                worstClass = { ...d.toObject(), percent };
        });

        const monthData = await Attendance.find({
            academicYear,
            date: { $gte: monthStart, $lte: today }
        });

        const monthlyAvg =
            monthData.reduce((s, d) => s + calcPercent(d, classMap[d.classId]?.totalStudents), 0) /
            (monthData.length || 1);

        const upcomingEvent = await Attendance.findOne({
            academicYear,
            date: { $gt: today },
            isEvent: true
        }).sort({ date: 1 });

        const eventCounts = {};
        monthData.forEach(d => {
            if (d.isEvent) {
                const dept = classMap[d.classId]?.department;
                if (dept) eventCounts[dept] = (eventCounts[dept] || 0) + 1;
            }
        });

        const mostEventsDept = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0];

        return NextResponse.json({
            success: true,
            academicYear,
            dashboard: {
                todayOverall: {
                    percentage: todayAvg.toFixed(1),
                    change: (todayAvg - yesterdayAvg).toFixed(1)
                },
                bestPerforming: bestClass && {
                    className: bestClass.className,
                    percentage: bestClass.percent.toFixed(1)
                },
                lowestAttendance: worstClass && {
                    className: worstClass.className,
                    percentage: worstClass.percent.toFixed(1)
                },
                monthlyAverage: monthlyAvg.toFixed(1),
                upcomingEvent: upcomingEvent && {
                    name: upcomingEvent.MEventName || upcomingEvent.AEventName,
                    date: upcomingEvent.date
                },
                mostEvents: mostEventsDept && {
                    department: mostEventsDept[0],
                    count: mostEventsDept[1]
                }
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
