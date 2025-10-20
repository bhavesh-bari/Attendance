// /data/attendanceData.js
// EXPANDED MOCK DATA for a more realistic and comprehensive dashboard

// --- Helper function to simulate realistic attendance data ---
const generateTimeSeries = (startDate, days, basePresent, eventDays) => {
    const data = [];
    let currentDate = new Date(startDate);
    const totalStudents = 600;

    for (let i = 0; i < days; i++) {
        const dateString = currentDate.toISOString().split('T')[0];

        // Random fluctuation (1% to 3% noise)
        let noise = (Math.random() - 0.5) * 0.03 * totalStudents;
        let presentCount = Math.min(totalStudents, Math.round(basePresent + noise));
        let event = null;

        // Apply event impacts
        for (const ev of eventDays) {
            if (dateString === ev.date) {
                event = ev.name;
                // Major event (e.g., Tech Fest, Exam) causes a drop
                if (ev.type === 'Major' || ev.type === 'Exam') {
                    presentCount = Math.round(presentCount * 0.90); // 10% drop
                }
            }
        }

        data.push({
            date: dateString,
            present: presentCount,
            absent: totalStudents - presentCount,
            event: event,
        });

        // Advance base attendance slightly over time (small upward/downward trend)
        basePresent += (Math.random() - 0.5) * 5;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};
// -----------------------------------------------------------------

export const EVENTS = [
    { date: '2025-09-25', name: 'Alumni Meet', type: 'Minor' },
    { date: '2025-10-11', name: 'Tech Fest Day 1', type: 'Major' },
    { date: '2025-10-12', name: 'Tech Fest Day 2', type: 'Major' },
    { date: '2025-10-25', name: 'Mid-Term Exams Start', type: 'Exam' },
    { date: '2025-11-05', name: 'Festival Holiday', type: 'Holiday' },
];

export const initialAttendanceData = {
    // Master data for filters (College Structure remains the same, it's comprehensive enough)
    collegeStructure: [
        {
            dept: 'CSE',
            years: [
                { year: '2nd Year', divisions: ['A', 'B', 'C'], totalStudents: 180 },
                { year: '3rd Year', divisions: ['A', 'B', 'C'], totalStudents: 180 }, // Added C for density
                { year: '4th Year', divisions: ['A', 'B'], totalStudents: 120 },
            ],
        },
        {
            dept: 'ECE',
            years: [
                { year: '2nd Year', divisions: ['A', 'B'], totalStudents: 100 },
                { year: '3rd Year', divisions: ['A', 'B'], totalStudents: 100 },
                { year: '4th Year', divisions: ['A', 'B'], totalStudents: 100 },
            ],
        },
        {
            dept: 'MECH',
            years: [
                { year: '2nd Year', divisions: ['A', 'B'], totalStudents: 110 },
                { year: '3rd Year', divisions: ['A'], totalStudents: 60 },
                { year: '4th Year', divisions: ['C'], totalStudents: 45 },
            ],
        },
        {
            dept: 'CIVIL',
            years: [
                { year: '2nd Year', divisions: ['A'], totalStudents: 50 },
                { year: '4th Year', divisions: ['A'], totalStudents: 40 },
            ],
        },
    ],

    // Time series data for charts (3 months of data for better trend visualization)
    dailyData: generateTimeSeries('2025-09-01', 75, 540, EVENTS), // 75 days of data (Sept 1 to Nov 15)

    // Division-level data for bar charts/leaderboard (More divisions, wider range of performance)
    divisionSummary: [
        // CSE (High variance)
        { dept: 'CSE', div: 'A', year: '2nd Year', avgAttendance: 96.2, totalStudents: 60 }, // Top
        { dept: 'CSE', div: 'B', year: '2nd Year', avgAttendance: 88.0, totalStudents: 60 },
        { dept: 'CSE', div: 'C', year: '2nd Year', avgAttendance: 93.1, totalStudents: 60 },
        { dept: 'CSE', div: 'A', year: '3rd Year', avgAttendance: 92.5, totalStudents: 60 },
        { dept: 'CSE', div: 'B', year: '3rd Year', avgAttendance: 85.0, totalStudents: 60 },
        { dept: 'CSE', div: 'C', year: '3rd Year', avgAttendance: 89.4, totalStudents: 60 },
        { dept: 'CSE', div: 'A', year: '4th Year', avgAttendance: 87.8, totalStudents: 60 },

        // ECE (Generally High)
        { dept: 'ECE', div: 'A', year: '2nd Year', avgAttendance: 95.1, totalStudents: 50 },
        { dept: 'ECE', div: 'B', year: '2nd Year', avgAttendance: 90.5, totalStudents: 50 },
        { dept: 'ECE', div: 'A', year: '3rd Year', avgAttendance: 94.0, totalStudents: 50 },
        { dept: 'ECE', div: 'A', year: '4th Year', avgAttendance: 91.2, totalStudents: 50 },

        // MECH (Medium to Low)
        { dept: 'MECH', div: 'A', year: '2nd Year', avgAttendance: 82.0, totalStudents: 55 },
        { dept: 'MECH', div: 'B', year: '2nd Year', avgAttendance: 80.5, totalStudents: 55 },
        { dept: 'MECH', div: 'A', year: '3rd Year', avgAttendance: 84.1, totalStudents: 60 },
        { dept: 'MECH', div: 'C', year: '4th Year', avgAttendance: 78.9, totalStudents: 45 }, // Lowest

        // CIVIL (Low student count, Medium variance)
        { dept: 'CIVIL', div: 'A', year: '2nd Year', avgAttendance: 91.0, totalStudents: 50 },
        { dept: 'CIVIL', div: 'A', year: '4th Year', avgAttendance: 86.5, totalStudents: 40 },

        // Adding a few more points for histogram ranges
        { dept: 'AERO', div: 'X', year: '4th Year', avgAttendance: 97.5, totalStudents: 30 }, // Highest
        { dept: 'PROD', div: 'Y', year: '2nd Year', avgAttendance: 75.2, totalStudents: 50 }, // Very Low
    ],

    // Data for the Present vs Absent Pie Chart (Current Day)
    // Takes the last entry from the generated dailyData
    currentAttendanceSplit: {
        present: generateTimeSeries('2025-09-01', 75, 540, EVENTS).slice(-1)[0].present,
        absent: generateTimeSeries('2025-09-01', 75, 540, EVENTS).slice(-1)[0].absent,
        total: 600,
    }
};