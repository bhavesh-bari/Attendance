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

        /* ===============================
           1️⃣ Department Attendance by Class & Shift
        =============================== */
        const departmentAttendance = attendanceData.map(d => {
            const cls = classMap[d.classId?.toString()];
            const total = cls?.totalStudents || 1;

            return {
                department: cls?.department,
                className: cls?.name,
                morningPercent: ((d.MornCount / total) * 100).toFixed(1),
                afternoonPercent: ((d.AftCount / total) * 100).toFixed(1)
            };
        });

        /* ===============================
           2️⃣ Event Counts by Class
        =============================== */
        const eventMap = {};
        attendanceData.forEach(d => {
            if (d.isEvent) {
                eventMap[d.className] = (eventMap[d.className] || 0) + 1;
            }
        });

        const eventCounts = Object.entries(eventMap).map(([className, count]) => ({
            className,
            count
        }));

        /* ===============================
           3️⃣ Leaderboard (Avg Attendance)
        =============================== */
        const leaderboardMap = {};

        attendanceData.forEach(d => {
            const cls = classMap[d.classId?.toString()];
            if (!cls) return;

            const avg =
                (d.MornCount + d.AftCount) / 2 / cls.totalStudents * 100;

            if (!leaderboardMap[d.className]) {
                leaderboardMap[d.className] = {
                    className: d.className,
                    department: cls.department,
                    total: 0,
                    count: 0
                };
            }

            leaderboardMap[d.className].total += avg;
            leaderboardMap[d.className].count += 1;
        });

        const leaderboard = Object.values(leaderboardMap)
            .map(d => ({
                className: d.className,
                department: d.department,
                percentage: (d.total / d.count).toFixed(1)
            }))
            .sort((a, b) => b.percentage - a.percentage);

        /* ===============================
           Final Response
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
