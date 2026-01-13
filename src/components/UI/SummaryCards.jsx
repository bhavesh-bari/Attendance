const Card = ({ title, value, icon, colorClass, delta, description }) => (
    <div
        className={`p-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${colorClass} text-white`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            {icon}
        </div>
        <div className="mt-3 text-sm flex items-center justify-between">
            <span className="font-semibold">{delta}</span>
            <span className="opacity-80">{description}</span>
        </div>
    </div>
);

const SummaryCards = ({ dashboard }) => {
    if (!dashboard) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card
                title="Today's Overall"
                value={`${dashboard.todayOverall.percentage}%`}
                icon={<span className="text-4xl">📊</span>}
                colorClass="bg-green-600 border-b-4 border-green-800"
                delta={`${dashboard.todayOverall.change}%`}
                description="vs yesterday"
            />

            <Card
                title="Best Performing"
                value={dashboard.bestPerforming?.className || "—"}
                icon={<span className="text-4xl">🏆</span>}
                colorClass="bg-indigo-600 border-b-4 border-indigo-800"
                delta={`${dashboard.bestPerforming?.percentage || 0}%`}
                description="Avg Attendance"
            />

            <Card
                title="Lowest Attendance"
                value={dashboard.lowestAttendance?.className || "—"}
                icon={<span className="text-4xl">⚠️</span>}
                colorClass="bg-red-600 border-b-4 border-red-800"
                delta={`${dashboard.lowestAttendance?.percentage || 0}%`}
                description="Needs Attention"
            />

            <Card
                title="Monthly Average"
                value={`${dashboard.monthlyAverage}%`}
                icon={<span className="text-4xl">📅</span>}
                colorClass="bg-blue-600 border-b-4 border-blue-800"
                delta="This Month"
                description="Overall Trend"
            />

            <Card
                title="Upcoming Event"
                value={dashboard.upcomingEvent?.name || "None"}
                icon={<span className="text-4xl">📚</span>}
                colorClass="bg-orange-600 border-b-4 border-orange-800"
                delta={
                    dashboard.upcomingEvent
                        ? new Date(dashboard.upcomingEvent.date).toDateString()
                        : "—"
                }
                description="Expected Impact"
            />

            <Card
                title="Most Events"
                value={dashboard.mostEvents?.count || 0}
                icon={<span className="text-4xl">📊</span>}
                colorClass="bg-yellow-400 border-b-4 border-yellow-600 text-gray-900"
                delta={dashboard.mostEvents?.department || "—"}
                description="Department"
            />
        </div>
    );
};

export default SummaryCards;
