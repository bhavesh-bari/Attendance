import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Class from "@/models/Class";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const scope = searchParams.get("scope") || "institution"; // institution | department
    const department = searchParams.get("department");
    const period = searchParams.get("period") || "overall";
    const shift = searchParams.get("shift") || "overall";

    let startDate = null;
    let endDate = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* =======================
       DATE FILTER LOGIC
    ======================= */
    if (period === "today") {
      startDate = today;
      endDate = today;
    }

    if (period === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
    }

    if (period === "date") {
      startDate = new Date(searchParams.get("date"));
      startDate.setHours(0, 0, 0, 0);
      endDate = startDate;
    }

    if (period === "range") {
      startDate = new Date(searchParams.get("from"));
      endDate = new Date(searchParams.get("to"));
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
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
      Class.find(scope === "department" ? { department } : {})
    ]);

    const classMap = {};
    classes.forEach(c => {
      classMap[c._id.toString()] = c;
    });

    /* =======================
       METRIC HELPERS
    ======================= */
    const getAttendanceValue = (a, cls) => {
      if (shift === "morning") return (a.MornCount / cls.totalStudents) * 100;
      if (shift === "afternoon") return (a.AftCount / cls.totalStudents) * 100;
      return ((a.MornCount + a.AftCount) / 2 / cls.totalStudents) * 100;
    };

    /* =======================
       CLASS LEVEL ANALYTICS
    ======================= */
    const classStats = {};

    attendance.forEach(a => {
      const cls = classMap[a.classId?.toString()];
      if (!cls) return;

      if (!classStats[cls.name]) {
        classStats[cls.name] = {
          className: cls.name,
          department: cls.department,
          total: 0,
          count: 0
        };
      }

      classStats[cls.name].total += getAttendanceValue(a, cls);
      classStats[cls.name].count += 1;
    });

    const classAnalytics = Object.values(classStats).map(c => ({
      ...c,
      percentage: (c.total / c.count).toFixed(1)
    }));

    /* =======================
       EVENT ANALYTICS
    ======================= */
    const eventCount = {};

    attendance.forEach(a => {
      if (a.isEvent) {
        const cls = classMap[a.classId?.toString()];
        if (!cls) return;
        eventCount[cls.department] = (eventCount[cls.department] || 0) + 1;
      }
    });

    /* =======================
       SUMMARY METRICS
    ======================= */
    const avgAttendance =
      classAnalytics.reduce((s, c) => s + Number(c.percentage), 0) /
      (classAnalytics.length || 1);

    const topClass = classAnalytics.sort(
      (a, b) => b.percentage - a.percentage
    )[0];

    /* =======================
       RESPONSE
    ======================= */
    return NextResponse.json({
      success: true,
      scope,
      period,
      shift,

      summary:
        scope === "institution"
          ? {
              overallAvgAttendance: avgAttendance.toFixed(1),
              totalDivisions: classes.length,
              activeDepartments: [
                ...new Set(classes.map(c => c.department))
              ].length
            }
          : {
              department,
              departmentAvgAttendance: avgAttendance.toFixed(1),
              totalDivisions: classes.length,
              topPerformingClass: topClass?.className
            },

      analytics: {
        classes: classAnalytics,
        eventCount
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
