export function getAcademicYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();

    if (month >= 5) {
        // June or later
        return `${year}-${String((year + 1) % 100).padStart(2, "0")}`;
    } else {
        // Jan to May
        return `${year - 1}-${String(year % 100).padStart(2, "0")}`;
    }
}

const academicYear = getAcademicYear();