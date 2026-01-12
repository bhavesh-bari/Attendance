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
    const mode = searchParams.get("mode"); // compare
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
    } else if (period === "date") {
      startDate = new Date(searchParams.get("date"));
      startDate.setHours(0, 0, 0, 0);
      endDate = startDate;
    } else if (period === "range") {
      startDate = new Date(searchParams.get("from"));
      endDate = new Date(searchParams.get("to"));
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    }

    const dateQuery =
      startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};

    /* =======================
       FETCH
    ======================= */
    const [attendance, classes] = await Promise.all([
      Attendance.find(dateQuery),
      Class.find({})
    ]);

    const classMap = {};
    classes.forEach(c => (classMap[c._id.toString()] = c));

    const departments = [...new Set(classes.map(c => c.department))];
    console.log('Departments:', departments, departments.length);
    const len = departments.length;
    /* =======================
       HELPERS
    ======================= */
    const calcAttendance = (records, type = "overall") => {
      let total = 0, count = 0;
      records.forEach(a => {
        const cls = classMap[a.classId?.toString()];
        if (!cls) return;

        let val =
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

    /* =====================================================
       COMPARE (NO RETURN HERE)
    ===================================================== */
    let compare = null;

    if (mode === "compare") {

      /* =======================
         DEPARTMENT VS DEPARTMENT
         ======================= */
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
              .map(d => ({
                d,
                avg: calcAttendance(
                  attendance.filter(a =>
                    classes
                      .filter(c => c.department === d)
                      .map(c => c._id.toString())
                      .includes(a.classId?.toString())
                  )
                )
              }))
              .sort((a, b) => b.avg - a.avg)
              .findIndex(x => x.d === dept) + 1;

          const recentEvent = records
            .filter(r => r.isEvent)
            .sort((a, b) => b.date - a.date)[0];

          return {
            department: dept,

            overall: {
              attendance: calcAttendance(records),
              morning: calcAttendance(records, "morning"),
              afternoon: calcAttendance(records, "afternoon"),
              totalEvents: records.filter(r => r.isEvent).length
            },

            today: {
              attendance: calcAttendance(todayRec),
              morning: calcAttendance(todayRec, "morning"),
              totalEvents: todayRec.filter(r => r.isEvent).length
            },

            month: {
              attendance: calcAttendance(monthRec),
              morning: calcAttendance(monthRec, "morning"),
              totalEvents: monthRec.filter(r => r.isEvent).length
            },

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

      /* =================
         CLASS VS CLASS
         ================= */
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

          const deptClasses = classes.filter(c => c.department === cls.department);

          const rank =
            deptClasses
              .map(c => ({
                name: c.name,
                avg: calcAttendance(
                  attendance.filter(
                    a => a.classId?.toString() === c._id.toString()
                  )
                )
              }))
              .sort((a, b) => b.avg - a.avg)
              .findIndex(x => x.name === cls.name) + 1;

          const recentEvent = records
            .filter(r => r.isEvent)
            .sort((a, b) => b.date - a.date)[0];

          return {
            className: cls.name,
            department: cls.department,

            overall: {
              attendance: calcAttendance(records),
              morning: calcAttendance(records, "morning"),
              afternoon: calcAttendance(records, "afternoon"),
              totalEvents: records.filter(r => r.isEvent).length
            },

            today: {
              attendance: calcAttendance(todayRec),
              morning: calcAttendance(todayRec, "morning"),
              totalEvents: todayRec.filter(r => r.isEvent).length
            },

            month: {
              attendance: calcAttendance(monthRec),
              morning: calcAttendance(monthRec, "morning"),
              totalEvents: monthRec.filter(r => r.isEvent).length
            },

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
       NORMAL ANALYTICS
    ===================================================== */
    const filteredClasses =
      scope === "department" && department
        ? classes.filter(c => c.department === department)
        : classes;

    const classStats = {};
    attendance.forEach(a => {
      const cls = classMap[a.classId?.toString()];
      if (!cls) return;
      if (scope === "department" && department && cls.department !== department) return;

      classStats[cls.name] ??= { className: cls.name, department: cls.department, total: 0, count: 0 };
      classStats[cls.name].total += Number(calcAttendance([a]));
      classStats[cls.name].count++;
    });

    const classAnalytics = Object.values(classStats).map(c => ({
      ...c,
      percentage: (c.total / c.count).toFixed(1)
    }));

    const avgAttendance =
      classAnalytics.reduce((s, c) => s + Number(c.percentage), 0) /
      (classAnalytics.length || 1);

    /* =======================
       FINAL RESPONSE
    ======================= */
    return NextResponse.json({
      success: true,

      filters: {
        scope,
        department,
        period,
        availableDepartments: departments,
        availableClasses:
          department
            ? classes.filter(c => c.department === department)
            : classes
      },

      summary:
        scope === "institution"
          ? {
            overallAvgAttendance: avgAttendance.toFixed(1),
            totalDivisions: classes.length,
            activeDepartments: len
          }
          : {
            department,
            departmentAvgAttendance: avgAttendance.toFixed(1),
            totalDivisions: filteredClasses.length
          },

      analytics: {
        classes: classAnalytics
      },

      compare // ✅ INCLUDED TOGETHER
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
