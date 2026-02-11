
import Link from "next/link";
import Image from "next/image";
import {
    CheckCircle,
    BarChart3,
    Users,
    ShieldCheck,
    ArrowRight,
    GraduationCap
} from "lucide-react";

export default async function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* --- Navigation --- */}
            <nav className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Image
                        src="/jspm1.webp"
                        alt="JSPM Logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
                        JSPM NTC
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/auth" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/auth"
                        className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <section className="px-6 pt-16 pb-20 text-center max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-100">
                        <GraduationCap size={14} />
                        <span>Official Academic Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">

                        <span className="text-blue-600">JSPM NARHE TECHNICAL CAMPUS PUNE.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        A dedicated academic portal built for the AMC Department of JSPM NTC.
                        Easily record attendance, monitor student performance, view leaderboards,
                        compare classes or departments, and generate ready-to-use reports in just one click.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all group"
                        >
                            Access Dashboard
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#features"
                            className="w-full sm:w-auto text-slate-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                        >
                            View Features
                        </Link>
                    </div>
                </section>

                {/* --- Features Grid --- */}

                <section id="features" className="bg-slate-50 py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Capabilities</h2>
                            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                                A comprehensive suite designed for AMC Departments, Deans, and Faculty to manage academic operations efficiently.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Dashboard & Overview */}
                            <FeatureCard
                                icon={<BarChart3 className="text-blue-600" />}
                                title="Dashboard & Analytics"

                                desc="Access real-time leaderboards, comprehensive overview metrics, and upcoming academic events."
                            />

                            {/* Daily Attendance */}
                            <FeatureCard
                                icon={<CheckCircle className="text-emerald-600" />}
                                title="Attendance Tracking"

                                desc="Streamlined interface to fill in daily student attendance and log specific event participation."
                            />

                            {/* Class Management */}
                            <FeatureCard
                                icon={<Users className="text-purple-600" />}
                                title="Class Management"

                                desc="Manage student strength, divisions, and year-wise academic structures with ease."
                            />

                            {/* Data Visualization */}
                            <FeatureCard
                                icon={<ShieldCheck className="text-orange-600" />}
                                title="Data Tables & Export"

                                desc="Visualize events and attendance in structured tables with one-click Excel export functionality."
                            />

                            {/* Comparison Analytics */}
                            <FeatureCard
                                icon={<ArrowRight className="text-indigo-600" />}
                                title="Comparative Analytics"

                                desc="Detailed department-wise and class-wise comparisons for attendance and event metrics."
                            />

                            {/* Academic Calendar */}
                            <FeatureCard
                                icon={<GraduationCap className="text-rose-600" />}
                                title="Academic Calendar"

                                desc="Stay updated with the official JSPM NTC schedule, holidays, and examination timelines."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer className="border-t py-12 px-6 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Image src="/jspm1.webp" alt="Logo" width={30} height={30} opacity={0.8} />
                        <p className="text-sm text-slate-500 font-medium">
                            © 2026 JSPM NTC Attendance System
                        </p>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-400">
                        <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc, path }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}