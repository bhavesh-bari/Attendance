import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

const YEAR_MAP = { 1: "FE", 2: "SE", 3: "TE", 4: "BE" };
const REVERSE_YEAR_MAP = { FE: 1, SE: 2, TE: 3, BE: 4 };

function getAcademicYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return month >= 5
        ? `${year}-${String(year + 1).slice(2)}`
        : `${year - 1}-${String(year).slice(2)}`;
}

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const departmentFilter = searchParams.get("department") || "ALL";
    const yearFilter = searchParams.get("year") || "ALL";
    const period = searchParams.get("period") || "overall";

    const dateParam = searchParams.get("date");
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const academicYear = getAcademicYear();
    const alldepartments = await Class.distinct("department");

    /* =============== DATE FILTER ================= */
    let startDate = null;
    let endDate = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (period) {
        case "today":
            startDate = today;
            endDate = today;
            break;

        case "month":
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;

        case "date":
            if (dateParam) {
                startDate = new Date(dateParam);
                endDate = new Date(dateParam);
            }
            break;

        case "range":
            if (fromParam && toParam) {
                startDate = new Date(fromParam);
                endDate = new Date(toParam);
            }
            break;
    }

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const dateQuery =
        startDate && endDate
            ? { date: { $gte: startDate, $lte: endDate }, academicYear }
            : { academicYear };

    /* =============== LOAD DATA ================= */
    const classQuery = { academicYear };

    if (departmentFilter !== "ALL") classQuery.department = departmentFilter;
    if (yearFilter !== "ALL") classQuery.year = REVERSE_YEAR_MAP[yearFilter];

    const classes = await Class.find(classQuery).lean();
    const attendance = await Attendance.find(dateQuery).lean();

    /* =============== COLUMNS ================= */
    const columns = [...new Set(
        classes.map(c => `${YEAR_MAP[c.year]}-${c.division}`)
    )].sort((a, b) => {
        const order = ["FE", "SE", "TE", "BE"];
        const [ya, da] = a.split("-");
        const [yb, db] = b.split("-");
        return order.indexOf(ya) - order.indexOf(yb) || da.localeCompare(db);
    });

    /* =============== HELPER FUNCTIONS ================= */

    // Average daily logic
    const calcCell = (records, session, includeEvents) => {
        if (!records.length) {
            return includeEvents ? { P: "-", "%": "-", eventName: "" } : { P: "-", "%": "-" };
        }

        // Group records by day
        const dayMap = {};

        for (const r of records) {
            const day = new Date(r.date).toDateString();

            if (!dayMap[day]) dayMap[day] = { present: 0, snapshot: 0, event: "" };

            const snap = r.totalStudentsSnapshot || 0;

            if (session === "morning") {
                dayMap[day].present += r.MornCount || 0;
            } else {
                dayMap[day].present += r.AftCount || 0;
            }

            dayMap[day].snapshot += snap;

            if (includeEvents) {
                if (session === "morning" && r.MEventName) dayMap[day].event = r.MEventName;
                if (session === "afternoon" && r.AEventName) dayMap[day].event = r.AEventName;
            }
        }

        const dailyPercents = [];
        const dailyPresents = [];
        let eventName = "";

        for (const d of Object.values(dayMap)) {
            if (d.snapshot > 0) {
                dailyPercents.push((d.present / d.snapshot) * 100);
                dailyPresents.push(d.present);
            }
            if (d.event) eventName = d.event;
        }

        const avgPercent = dailyPercents.length
            ? Number((dailyPercents.reduce((a, b) => a + b) / dailyPercents.length).toFixed(2))
            : 0;

        const avgPresent = dailyPresents.length
            ? Number((dailyPresents.reduce((a, b) => a + b) / dailyPresents.length).toFixed(2))
            : 0;

        const cell = { P: avgPresent, "%": avgPercent };

        if (includeEvents) cell.eventName = eventName;

        return cell;
    };

    const isMultiDay = ["month", "overall", "range"].includes(period);
    const includeEvents = ["today", "date"].includes(period);

    /* =============== ROWS ================= */
    const departments = [...new Set(classes.map(c => c.department))];
    const sessions = ["morning", "afternoon"];

    const rows = [];

    for (const dept of departments) {
        for (const session of sessions) {
            const row = {
                rowKey: `${dept}_${session}`,
                label: `${dept} ${session === "morning" ? "Morning" : "Afternoon"}`,
                data: {}
            };

            let totalPercentList = [];
            let totalPList = [];

            for (const col of columns) {
                const [yearLabel, division] = col.split("-");
                const year = Number(
                    Object.keys(YEAR_MAP).find(k => YEAR_MAP[k] === yearLabel)
                );

                const match = classes.filter(
                    c => c.department === dept && c.year === year && c.division === division
                );

                if (!match.length) {
                    row.data[col] = includeEvents
                        ? { P: "-", "%": "-", eventName: "" }
                        : { P: "-", "%": "-" };
                    continue;
                }

                const allRecords = attendance.filter(
                    a => String(a.classId) === String(match[0]._id)
                );

                const cell = calcCell(allRecords, session, includeEvents);

                row.data[col] = cell;

                if (cell.P !== "-") {
                    totalPercentList.push(cell["%"]);
                    totalPList.push(cell["P"]);
                }
            }

            row.data["TOTAL"] = {
                P: totalPList.length
                    ? Number((totalPList.reduce((a, b) => a + b) / totalPList.length).toFixed(2))
                    : 0,
                "%": totalPercentList.length
                    ? Number((totalPercentList.reduce((a, b) => a + b) / totalPercentList.length).toFixed(2))
                    : 0
            };

            rows.push(row);
        }
    }

    return NextResponse.json({
        success: true,
        academicYear,
        filters: {
            department: departmentFilter,
            year: yearFilter,
            period,
            startDate,
            endDate
        },
        departments: alldepartments,
        columns: [...columns, "TOTAL"],
        subColumns: includeEvents ? ["P", "%", "Event"] : ["P", "%"],
        rows
    });
}
