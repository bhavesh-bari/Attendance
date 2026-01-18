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
           1. Robust Date Filters
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
                const paramDate = searchParams.get("date");
                if (!paramDate) throw new Error("Date parameter missing");
                startDate = new Date(paramDate);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                break;

            case "range":
                const fromParam = searchParams.get("from");
                const toParam = searchParams.get("to");

                if (!fromParam || !toParam) {
                    // Fallback to this month if range is invalid, or throw error
                    throw new Error("Start and End dates required for range");
                }

                startDate = new Date(fromParam);
                endDate = new Date(toParam);

                // Validate dates are real
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error("Invalid date format provided");
                }

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
           2. Fetch Data
        =============================== */
        const [attendanceData, classes] = await Promise.all([
            Attendance.find(dateQuery),
            Class.find()
        ]);

        // Create ID Map for fast lookup (Much safer than Name lookup)
        const classMap = {};
        classes.forEach(c => {
            classMap[c._id.toString()] = c;
        });

        /* =====================================================
           3. DEPARTMENT ATTENDANCE
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
            morningPercent: ((d.totalMorning / d.days / d.totalStudents) * 100).toFixed(1),
            afternoonPercent: ((d.totalAfternoon / d.days / d.totalStudents) * 100).toFixed(1)
        }));

        /* =====================================================
           4. EVENT SECTION (FIXED & SAFER)
        ===================================================== */
        let eventResults = [];
        const isSingleDay = filter === "today" || filter === "date";

        if (isSingleDay) {
            // Case A: Single Day -> Return Event Strings
            attendanceData.forEach(d => {
                if (d.isEvent) {
                    const mName = d.MEventName || "";
                    const aName = d.AEventName || "";
                    let displayEventName = "";

                    if (mName === aName) displayEventName = mName;
                    else if (!mName) displayEventName = aName;
                    else if (!aName) displayEventName = mName;
                    else displayEventName = `${mName} and ${aName}`;

                    eventResults.push({
                        className: d.className,
                        department: d.department, // Safely taken from Attendance Doc
                        eventName: displayEventName
                    });
                }
            });
        } else {
            // Case B: Range/Overall -> Return Counts (FIXED)
            const eventMap = {};

            attendanceData.forEach(d => {
                if (d.isEvent) {
                    const key = d.className;

                    if (!eventMap[key]) {
                        
                        const clsInfo = classMap[d.classId?.toString()];
                        eventMap[key] = {
                            department: d.department || clsInfo?.department || "General",
                            count: 0
                        };
                    }
                    eventMap[key].count += 1;
                }
            });

            // Convert map to array
            eventResults = Object.entries(eventMap).map(([className, data]) => ({
                className,
                department: data.department,
                count: data.count
            }));
        }

        /* =====================================================
           5. LEADERBOARD
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

        return NextResponse.json({
            success: true,
            filter,
            data: {
                departmentAttendance,
                eventCounts: eventResults,
                leaderboard
            }
        });

    } catch (error) {
        console.error("API Error:", error); // Log error for debugging
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}