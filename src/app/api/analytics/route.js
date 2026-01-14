import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    /* =======================
       PARAMS
    ======================= */
    const scope = searchParams.get("scope") || "institution";
    const department = searchParams.get("department");
    const period = searchParams.get("period") || "overall";

    const mode = searchParams.get("mode");
    const compareType = searchParams.get("compareType");
    const left = searchParams.get("left");
    const right = searchParams.get("right");

    /* =======================
       DATE LOGIC
    ======================= */
    let startDate = null;
    let endDate = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === "today") {
      startDate = today;
      endDate = today;
    } else if (period === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
    } else if (period === "custom") {
      const start = searchParams.get("startDate");
      const end = searchParams.get("endDate");
      if (start && end) {
        startDate = new Date(start);
        endDate = new Date(end);
      }
    }

    const dateQuery =
      startDate && endDate
        ? { date: { $gte: startDate, $lte: endDate } }
        : {};

    /* =======================
       FETCH DATA
    ======================= */
    const [attendance, classes] = await Promise.all([
      Attendance.find(dateQuery),
      Class.find({})
    ]);

    const classMap = {};
    classes.forEach(c => (classMap[c._id.toString()] = c));

    const departments = [...new Set(classes.map(c => c.department))];

    /* =======================
       HELPERS
    ======================= */
    const calcAttendance = (records, type = "overall") => {
      let total = 0, count = 0;
      records.forEach(a => {
        const cls = classMap[a.classId?.toString()];
        if (!cls) return;

        const val =
          type === "morning"
            ? a.MornCount
            : type === "afternoon"
              ? a.AftCount
              : (a.MornCount + a.AftCount) / 2;

        total += (val / cls.totalStudents) * 100;
        count++;
      });
      return count ? (total / count).toFixed(1) : "0.0";
    };

    const byDate = (records, from, to) =>
      records.filter(r => r.date >= from && r.date <= to);

    const getTotalStudents = classList =>
      classList.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

    /* =====================================================
       COMPARE MODE
    ===================================================== */
    let compare = null;

    if (mode === "compare") {

      /* ========== DEPARTMENT COMPARE ========== */
      if (compareType === "department") {
        const buildDept = dept => {
          const deptClasses = classes.filter(c => c.department === dept);
          const ids = deptClasses.map(c => c._id.toString());
          const records = attendance.filter(a =>
            ids.includes(a.classId?.toString())
          );

          const todayRec = byDate(records, today, today);
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthRec = byDate(records, monthStart, today);

          const totalStudents = getTotalStudents(deptClasses);

          const bestClass = deptClasses
            .map(c => {
              const rec = attendance.filter(
                a => a.classId?.toString() === c._id.toString()
              );
              return { className: c.name, avg: calcAttendance(rec) };
            })
            .sort((a, b) => b.avg - a.avg)[0];

          const rank =
            departments
              .map(d => {
                const clsIds = classes
                  .filter(c => c.department === d)
                  .map(c => c._id.toString());
                const rec = attendance.filter(a =>
                  clsIds.includes(a.classId?.toString())
                );
                return { d, avg: Number(calcAttendance(rec)) };
              })
              .sort((a, b) => b.avg - a.avg)
              .findIndex(x => x.d === dept) + 1;

          const recentEvent = records
            .filter(r => r.isEvent)
            .sort((a, b) => b.date - a.date)[0];

          return {
            department: dept,
            totalStudents,
            overall: {
              attendance: calcAttendance(records),
              morning: calcAttendance(records, "morning"),
              afternoon: calcAttendance(records, "afternoon"),
              totalEvents: records.filter(r => r.isEvent).length
            },
            today: {
              attendance: calcAttendance(todayRec),
              morning: calcAttendance(todayRec, "morning"),
              afternoon: calcAttendance(todayRec, "afternoon"),
              totalStudents
            },
            month: { attendance: calcAttendance(monthRec) },
            totalClasses: deptClasses.length,
            bestClass,
            departmentRank: `#${rank}`,
            recentEvent: recentEvent
              ? {
                name: recentEvent.MEventName || recentEvent.AEventName,
                date: recentEvent.date
              }
              : null
          };
        };

        compare = {
          type: "department",
          left: buildDept(left),
          right: buildDept(right)
        };
      }

      /* ========== CLASS COMPARE ========== */
      if (compareType === "class") {
        const buildClass = className => {
          const cls = classes.find(c => c.name === className);
          if (!cls) return null;

          const records = attendance.filter(
            a => a.classId?.toString() === cls._id.toString()
          );

          const todayRec = byDate(records, today, today);
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthRec = byDate(records, monthStart, today);

          const deptClasses = classes.filter(
            c => c.department === cls.department
          );

          const todayRanks = deptClasses
            .map(c => {
              const rec = attendance.filter(
                a => a.classId?.toString() === c._id.toString()
              );
              const todayOnly = byDate(rec, today, today);
              return {
                className: c.name,
                avg: Number(calcAttendance(todayOnly))
              };
            })
            .sort((a, b) => b.avg - a.avg);

          const rank =
            todayRanks.findIndex(r => r.className === cls.name) + 1;

          const recentEvent = records
            .filter(r => r.isEvent)
            .sort((a, b) => b.date - a.date)[0];

          return {
            className: cls.name,
            department: cls.department,
            totalStudents: cls.totalStudents,
            overall: {
              attendance: calcAttendance(records),
              morning: calcAttendance(records, "morning"),
              afternoon: calcAttendance(records, "afternoon"),
              totalEvents: records.filter(r => r.isEvent).length
            },
            today: {
              attendance: calcAttendance(todayRec),
              morning: calcAttendance(todayRec, "morning"),
              afternoon: calcAttendance(todayRec, "afternoon"),
              totalStudents: cls.totalStudents
            },
            month: { attendance: calcAttendance(monthRec) },
            rankInDepartment: `#${rank}`,
            recentEvent: recentEvent
              ? {
                name: recentEvent.MEventName || recentEvent.AEventName,
                date: recentEvent.date
              }
              : null
          };
        };

        compare = {
          type: "class",
          left: buildClass(left),
          right: buildClass(right)
        };
      }
    }

    /* =====================================================
       NORMAL ANALYTICS (UNCHANGED)
    ===================================================== */
    const filteredClasses =
      scope === "department" && department
        ? classes.filter(c => c.department === department)
        : classes;

    const classStats = {};
    const eventsList = [];

    attendance.forEach(a => {
      const cls = classMap[a.classId?.toString()];
      if (!cls) return;
      if (scope === "department" && department && cls.department !== department)
        return;

      classStats[cls.name] ??= {
        className: cls.name,
        department: cls.department,
        total: 0,
        count: 0,
        mornTotal: 0,
        aftTotal: 0
      };

      classStats[cls.name].total += Number(calcAttendance([a]));
      classStats[cls.name].mornTotal += Number(
        calcAttendance([a], "morning")
      );
      classStats[cls.name].aftTotal += Number(
        calcAttendance([a], "afternoon")
      );
      classStats[cls.name].count++;

      if (a.isEvent) {
        eventsList.push({
          event: a.MEventName || a.AEventName || "Event",
          date: new Date(a.date).toLocaleDateString(),
          classes: [cls.name],
          department: cls.department
        });
      }
    });

    const classAnalytics = Object.values(classStats).map(c => ({
      name: c.className,
      department: c.department,
      overall: (c.total / c.count).toFixed(1),
      morning: (c.mornTotal / c.count).toFixed(1),
      afternoon: (c.aftTotal / c.count).toFixed(1)
    }));

    const avgAttendance =
      classAnalytics.reduce((s, c) => s + Number(c.overall), 0) /
      (classAnalytics.length || 1);

    return NextResponse.json({
      success: true,
      filters: {
        scope,
        department,
        period,
        availableDepartments: departments,
        availableClasses:
          scope === "department"
            ? classes.filter(c => c.department === department)
            : classes
      },
      summary:
        scope === "institution"
          ? {
            overallAvgAttendance: avgAttendance.toFixed(1),
            totalDivisions: classes.length,
            activeDepartments: departments.length
          }
          : {
            department,
            departmentAvgAttendance: avgAttendance.toFixed(1),
            totalDivisions: filteredClasses.length
          },
      analytics: {
        classes: classAnalytics,
        events: eventsList
      },
      compare
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
