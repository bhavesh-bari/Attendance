import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter");

        let startDate, endDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        /* ===============================
           Date Filters
        =============================== */
        switch (filter) {
            case "today":
                startDate = new Date(today);
                endDate = new Date(today);
                break;

            case "thisMonth":
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today);
                break;

            case "overall":
                startDate = null;
                endDate = null;
                break;

            case "date":
                startDate = new Date(searchParams.get("date"));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                break;

            case "range":
                startDate = new Date(searchParams.get("from"));
                endDate = new Date(searchParams.get("to"));
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                break;

            default:
                return NextResponse.json(
                    { success: false, message: "Invalid filter" },
                    { status: 400 }
                );
        }

        const dateQuery =
            startDate && endDate
                ? { date: { $gte: startDate, $lte: endDate } }
                : {};

        /* ===============================
           Fetch Data
        =============================== */
        const [attendanceData, classes] = await Promise.all([
            Attendance.find(dateQuery),
            Class.find()
        ]);

        const classMap = {};
        classes.forEach(c => {
            classMap[c._id.toString()] = c;
        });

        /* =====================================================
           1️⃣ DEPARTMENT ATTENDANCE (FIXED – AGGREGATED)
        ===================================================== */
        const attendanceAgg = {};

        attendanceData.forEach(d => {
            const cls = classMap[d.classId?.toString()];
            if (!cls) return;

            const key = d.classId.toString();

            if (!attendanceAgg[key]) {
                attendanceAgg[key] = {
                    department: cls.department,
                    className: cls.name,
                    totalMorning: 0,
                    totalAfternoon: 0,
                    days: 0,
                    totalStudents: cls.totalStudents || 1
                };
            }

            attendanceAgg[key].totalMorning += d.MornCount;
            attendanceAgg[key].totalAfternoon += d.AftCount;
            attendanceAgg[key].days += 1;
        });

        const departmentAttendance = Object.values(attendanceAgg).map(d => ({
            department: d.department,
            className: d.className,
            morningPercent: (
                (d.totalMorning / d.days / d.totalStudents) * 100
            ).toFixed(1),
            afternoonPercent: (
                (d.totalAfternoon / d.days / d.totalStudents) * 100
            ).toFixed(1)
        }));

        /* =====================================================
           2️⃣ EVENT COUNTS (FIXED)
        ===================================================== */
        const eventMap = {};

        attendanceData.forEach(d => {
            if (d.isEvent) {
                eventMap[d.className] = (eventMap[d.className] || 0) + 1;
            }
        });

        const eventCounts = Object.entries(eventMap).map(([className, count]) => {
            const cls = classes.find(c => c.name === className);
            return {
                className,
                department: cls?.department,
                count
            };
        });

        /* =====================================================
           3️⃣ LEADERBOARD (ALREADY CORRECT – CLEANED)
        ===================================================== */
        const leaderboardMap = {};

        attendanceData.forEach(d => {
            const cls = classMap[d.classId?.toString()];
            if (!cls) return;

            const totalStudents = cls.totalStudents || 1;
            const avgPresent = (d.MornCount + d.AftCount) / 2;
            const percent = (avgPresent / totalStudents) * 100;

            if (!leaderboardMap[d.className]) {
                leaderboardMap[d.className] = {
                    className: d.className,
                    department: cls.department,
                    totalPercent: 0,
                    totalPresent: 0,
                    count: 0
                };
            }

            leaderboardMap[d.className].totalPercent += percent;
            leaderboardMap[d.className].totalPresent += avgPresent;
            leaderboardMap[d.className].count += 1;
        });

        const leaderboard = Object.values(leaderboardMap)
            .map(d => ({
                className: d.className,
                department: d.department,
                percentage: (d.totalPercent / d.count).toFixed(1),
                studentCounts: Math.round(d.totalPresent / d.count)
            }))
            .sort((a, b) => b.percentage - a.percentage);

        /* ===============================
           FINAL RESPONSE
        =============================== */
        return NextResponse.json({
            success: true,
            filter,
            data: {
                departmentAttendance,
                eventCounts,
                leaderboard
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
