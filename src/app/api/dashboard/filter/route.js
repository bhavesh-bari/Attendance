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

        /* ----- FILTERS ----- */
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
                startDate = endDate = null;
                break;

            case "date":
                const d = searchParams.get("date");
                if (!d) throw new Error("Date missing");
                startDate = new Date(d);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                break;

            case "range":
                const from = searchParams.get("from");
                const to = searchParams.get("to");
                if (!from || !to) throw new Error("Range missing");

                startDate = new Date(from);
                endDate = new Date(to);
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
                ? { date: { $gte: startDate, $lte: endDate }, academicYear }
                : { academicYear };

        /* ----- FETCH ALL ATTENDANCE + CLASSES ----- */
        const [attendanceData, classes] = await Promise.all([
            Attendance.find(dateQuery),
            Class.find({ academicYear })
        ]);

        const classMap = {};
        classes.forEach(c => classMap[c._id.toString()] = c);

        /* ===========================
           1. DEPARTMENT ATTENDANCE
        ============================ */
        const attendanceAgg = {};

        attendanceData.forEach(d => {
            const cls = classMap[d.classId?.toString()];
            if (!cls) return;

            const key = d.classId.toString();
            const strength = d.totalStudentsSnapshot || cls.totalStudents;

            if (!attendanceAgg[key]) {
                attendanceAgg[key] = {
                    className: cls.name,
                    department: cls.department,
                    morningPercents: [],
                    afternoonPercents: []
                };
            }

            attendanceAgg[key].morningPercents.push((d.MornCount / strength) * 100);
            attendanceAgg[key].afternoonPercents.push((d.AftCount / strength) * 100);
        });

        const departmentAttendance = Object.values(attendanceAgg).map(d => ({
            className: d.className,
            department: d.department,
            morningPercent: (d.morningPercents.reduce((a, b) => a + b, 0) / d.morningPercents.length).toFixed(1),
            afternoonPercent: (d.afternoonPercents.reduce((a, b) => a + b, 0) / d.afternoonPercents.length).toFixed(1)
        }));

        /* ===========================
           2. EVENT COUNTS
        ============================ */
        let eventResults = [];
        const isSingleDay = filter === "today" || filter === "date";

        if (isSingleDay) {
            attendanceData.forEach(d => {
                if (d.isEvent) {
                    const m = d.MEventName || "";
                    const a = d.AEventName || "";
                    const name = m === a ? m : !m ? a : !a ? m : `${m} + ${a}`;

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
                    eventMap[d.className].count++;
                }
            });

            eventResults = Object.entries(eventMap).map(([className, d]) => ({
                className,
                department: d.department,
                count: d.count
            }));
        }

        /* ===========================
           3. LEADERBOARD
        ============================ */
        const leaderboardMap = {};

        attendanceData.forEach(d => {
            const cls = classMap[d.classId?.toString()];
            if (!cls) return;

            const strength = d.totalStudentsSnapshot || cls.totalStudents;
            const avgPresent = (d.MornCount + d.AftCount) / 2;
            const percent = (avgPresent / strength) * 100;

            if (!leaderboardMap[d.className]) {
                leaderboardMap[d.className] = {
                    className: d.className,
                    department: cls.department,
                    percents: [],
                    presentCounts: []
                };
            }

            leaderboardMap[d.className].percents.push(percent);
            leaderboardMap[d.className].presentCounts.push(avgPresent);
        });

        const leaderboard = Object.values(leaderboardMap)
            .map(d => ({
                className: d.className,
                department: d.department,
                percentage: (
                    d.percents.reduce((a, b) => a + b, 0) / d.percents.length
                ).toFixed(1),
                studentCounts: Math.round(
                    d.presentCounts.reduce((a, b) => a + b, 0) /
                    d.presentCounts.length
                )
            }))
            .sort((a, b) => b.percentage - a.percentage);

        /* ===========================
           FINAL RESPONSE
        ============================ */
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
