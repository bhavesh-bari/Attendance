import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

const YEAR_MAP = {
    1: "FE",
    2: "SE",
    3: "TE",
    4: "BE"
};

// Reverse map for filtering query
const REVERSE_YEAR_MAP = {
    "FE": 1,
    "SE": 2,
    "TE": 3,
    "BE": 4
};

export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const departmentFilter = searchParams.get("department") || "ALL";
    const yearFilter = searchParams.get("year") || "ALL"; // <--- NEW: Year Param
    const period = searchParams.get("period") || "overall";

    const dateParam = searchParams.get("date");
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const alldepartments = await Class.distinct("department");

    /* ================= DATE FILTER ================= */
    let startDate = null;
    let endDate = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (period) {
        case "today":
            startDate = new Date(today);
            endDate = new Date(today);
            break;
        case "month":
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today);
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
        case "overall":
        default:
            break;
    }

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const dateQuery = startDate && endDate
        ? { date: { $gte: startDate, $lte: endDate } }
        : {};

    /* ================= FETCH DATA (With Year Filter) ================= */

    // Build Class Query
    const classQuery = {};
    if (departmentFilter !== "ALL") {
        classQuery.department = departmentFilter;
    }
    // NEW: Add Year logic
    if (yearFilter !== "ALL" && REVERSE_YEAR_MAP[yearFilter]) {
        classQuery.year = REVERSE_YEAR_MAP[yearFilter];
    }

    // Fetch filtered classes
    const classes = await Class.find(classQuery).lean();

    // Fetch Attendance
    const attendance = await Attendance.find(dateQuery).lean();

    /* ================= BUILD COLUMNS ================= */
    const columnSet = new Set();

    classes.forEach(c => {
        const yearLabel = YEAR_MAP[c.year];
        if (yearLabel) {
            columnSet.add(`${yearLabel}-${c.division}`);
        }
    });

    const columns = Array.from(columnSet).sort((a, b) => {
        const order = ["FE", "SE", "TE", "BE"];
        const [ya, da] = a.split("-");
        const [yb, db] = b.split("-");
        return order.indexOf(ya) - order.indexOf(yb) || da.localeCompare(db);
    });

    /* ================= HELPERS ================= */
    const calcCell = (records, session, totalStudents) => {
        if (!records.length) return { P: 0, "%": 0 };

        let present = 0;
        records.forEach(r => {
            present += session === "morning"
                ? (r.MornCount || 0)
                : (r.AftCount || 0);
        });

        const capacity = records.length * totalStudents;

        return {
            P: present,
            "%": capacity
                ? Number(((present / capacity) * 100).toFixed(2))
                : 0
        };
    };

    /* ================= BUILD ROWS ================= */
    const departments = [...new Set(classes.map(c => c.department))];
    const sessions = ["morning", "afternoon"];
    const rows = [];

    departments.forEach(dept => {
        sessions.forEach(session => {
            const row = {
                rowKey: `${dept}_${session}`,
                label: `${dept} ${session.charAt(0).toUpperCase() + session.slice(1)}`,
                data: {}
            };

            let totalP = 0;
            let totalCapacity = 0;

            columns.forEach(col => {
                const [yearLabel, division] = col.split("-");
                const year = Number(
                    Object.keys(YEAR_MAP).find(k => YEAR_MAP[k] === yearLabel)
                );

                const matchedClasses = classes.filter(
                    c =>
                        c.department === dept &&
                        c.year === year &&
                        c.division === division
                );

                if (!matchedClasses.length) {
                    row.data[col] = { P: "-", "%": "-" };
                    return;
                }

                let records = [];
                matchedClasses.forEach(cls => {
                    records.push(
                        ...attendance.filter(
                            a => String(a.classId) === String(cls._id)
                        )
                    );
                });

                const cell = calcCell(
                    records,
                    session,
                    matchedClasses[0].totalStudents
                );

                row.data[col] = cell;

                if (cell.P !== "-") {
                    totalP += cell.P;
                    totalCapacity += records.length * matchedClasses[0].totalStudents;
                }
            });

            row.data["TOTAL"] = {
                P: totalP,
                "%": totalCapacity
                    ? Number(((totalP / totalCapacity) * 100).toFixed(2))
                    : 0
            };

            // Only push row if it has relevant columns (handled by the loop) or if you want to filter empty rows
            if (columns.length > 0) {
                rows.push(row);
            }
        });
    });

    return NextResponse.json({
        success: true,
        filters: {
            department: departmentFilter,
            year: yearFilter, // Return the applied filter
            period,
            startDate,
            endDate
        },
        departments: alldepartments,
        columns: [...columns, "TOTAL"],
        subColumns: ["P", "%"],
        rows
    });
}