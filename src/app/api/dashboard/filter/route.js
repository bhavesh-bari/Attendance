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

export async function GET(req) {
    try {
        await connectDB();

        const academicYear = getAcademicYear();

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

            case "date": {
                const paramDate = searchParams.get("date");
                if (!paramDate) throw new Error("Date parameter missing");
                startDate = new Date(paramDate);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                break;
            }

            case "range": {
                const fromParam = searchParams.get("from");
                const toParam = searchParams.get("to");

                if (!fromParam || !toParam)
                    throw new Error("Start and End dates required for range");

                startDate = new Date(fromParam);
                endDate = new Date(toParam);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
                    throw new Error("Invalid date format provided");

                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                break;
            }

            default:
                return NextResponse.json(
                    { success: false, message: "Invalid filter" },
                    { status: 400 }
                );
        }

        const dateQuery =
            startDate && endDate
                ? { date: { $gte: startDate, $lte: endDate }, academicYear }
                : { academicYear };

        /* ===============================
           2. Fetch Data (UNCHANGED LOGIC)
        =============================== */
        const [attendanceData, classes] = await Promise.all([
            Attendance.find(dateQuery),
            Class.find({ academicYear })
        ]);

        const classMap = {};
        classes.forEach(c => {
            classMap[c._id.toString()] = c;
        });

        /* ===============================
           3. Department Attendance
        =============================== */
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

        /* ===============================
           4. Events (UNCHANGED)
        =============================== */
        let eventResults = [];
        const isSingleDay = filter === "today" || filter === "date";

        if (isSingleDay) {
            attendanceData.forEach(d => {
                if (d.isEvent) {
                    const m = d.MEventName || "";
                    const a = d.AEventName || "";
                    const name = m === a ? m : !m ? a : !a ? m : `${m} and ${a}`;

                    eventResults.push({
                        className: d.className,
                        department: d.department,
                        eventName: name
                    });
                }
            });
        } else {
            const eventMap = {};

            attendanceData.forEach(d => {
                if (d.isEvent) {
                    if (!eventMap[d.className]) {
                        eventMap[d.className] = {
                            department:
                                d.department ||
                                classMap[d.classId?.toString()]?.department ||
                                "General",
                            count: 0
                        };
                    }
                    eventMap[d.className].count += 1;
                }
            });

            eventResults = Object.entries(eventMap).map(([className, d]) => ({
                className,
                department: d.department,
                count: d.count
            }));
        }

        /* ===============================
           5. Leaderboard (UNCHANGED)
        =============================== */
        const leaderboardMap = {};

        attendanceData.forEach(d => {
            const cls = classMap[d.classId?.toString()];
            if (!cls) return;

            const avg = (d.MornCount + d.AftCount) / 2;
            const percent = (avg / (cls.totalStudents || 1)) * 100;

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
            leaderboardMap[d.className].totalPresent += avg;
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
            academicYear,
            filter,
            data: {
                departmentAttendance,
                eventCounts: eventResults,
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
