import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date") || new Date();

        const today = new Date(dateParam);
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const classes = await Class.find();
        const classMap = {};
        classes.forEach(c => {
            classMap[c._id.toString()] = c;
        });

        /* ===============================
           Helper: Attendance %
        =============================== */
        const calcPercent = (doc, total) => {
            const avg = (doc.MornCount + doc.AftCount) / 2;
            return total ? (avg / total) * 100 : 0;
        };

        /* ===============================
           Today Attendance
        =============================== */
        const todayData = await Attendance.find({ date: today });
        const yesterdayData = await Attendance.find({ date: yesterday });

        const todayPercents = todayData.map(d =>
            calcPercent(d, classMap[d.classId]?.totalStudents)
        );

        const yesterdayPercents = yesterdayData.map(d =>
            calcPercent(d, classMap[d.classId]?.totalStudents)
        );

        const todayAvg =
            todayPercents.reduce((a, b) => a + b, 0) / (todayPercents.length || 1);

        const yesterdayAvg =
            yesterdayPercents.reduce((a, b) => a + b, 0) /
            (yesterdayPercents.length || 1);

        /* ===============================
           Best & Lowest Class
        =============================== */
        let bestClass = null;
        let worstClass = null;

        todayData.forEach(d => {
            const percent = calcPercent(d, classMap[d.classId]?.totalStudents);
            if (!bestClass || percent > bestClass.percent)
                bestClass = { ...d.toObject(), percent };

            if (!worstClass || percent < worstClass.percent)
                worstClass = { ...d.toObject(), percent };
        });

        /* ===============================
           Monthly Average
        =============================== */
        const monthData = await Attendance.find({
            date: { $gte: monthStart, $lte: today }
        });

        const monthPercents = monthData.map(d =>
            calcPercent(d, classMap[d.classId]?.totalStudents)
        );

        const monthlyAvg =
            monthPercents.reduce((a, b) => a + b, 0) /
            (monthPercents.length || 1);

        /* ===============================
           Upcoming Event
        =============================== */
        const upcomingEvent = await Attendance.findOne({
            date: { $gt: today },
            isEvent: true
        }).sort({ date: 1 });

        /* ===============================
           Most Events (Dept)
        =============================== */
        const eventCounts = {};
        monthData.forEach(d => {
            if (d.isEvent) {
                const dept = classMap[d.classId]?.department;
                if (dept) eventCounts[dept] = (eventCounts[dept] || 0) + 1;
            }
        });

        const mostEventsDept = Object.entries(eventCounts).sort(
            (a, b) => b[1] - a[1]
        )[0];

        /* ===============================
           Final Response
        =============================== */
        return NextResponse.json({
            success: true,
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
