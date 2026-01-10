// /components/SummaryCards.js

const Card = ({ title, value, icon, colorClass, delta, description }) => (
    <div className={`p-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${colorClass} text-white`}>
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

const SummaryCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card
            title="Today's Overall"
            value="89.5%"
            icon={<span className="text-4xl">📊</span>}
            colorClass="bg-green-600 border-b-4 border-green-800"
            delta="+1.2%"
            description="vs. yesterday"
        />
        <Card
            title="Best Performing"
            value="ECE / 2nd-A"
            icon={<span className="text-4xl">🏆</span>}
            colorClass="bg-indigo-600 border-b-4 border-indigo-800"
            delta="98.1%"
            description="Avg. Attendance"
        />
        <Card
            title="Lowest Attendance"
            value="MECH / 4th-C"
            icon={<span className="text-4xl">⚠️</span>}
            colorClass="bg-red-600 border-b-4 border-red-800"
            delta="78.9%"
            description="Needs Attention"
        />
        <Card
            title="Monthly Average"
            value="88.2%"
            icon={<span className="text-4xl">📅</span>}
            colorClass="bg-blue-600 border-b-4 border-blue-800"
            delta="Oct 1-17"
            description="Overall Trend"
        />
        <Card
            title="Upcoming Event"
            value="Mid-Terms"
            icon={<span className="text-4xl">📚</span>}
            colorClass="bg-orange-600 border-b-4 border-orange-800"
            delta="Oct 25"
            description="Expected Drop"
        />
        <Card
            title="Most Events"
            value="10"
            icon={<span className="text-4xl">📊</span>}
            colorClass="bg-yellow-400 border-b-4 border-yellow-600 text-gray-900"
            delta="+4 This Month"
            description="By Mech Dept"
        />
    </div>
);

export default SummaryCards;