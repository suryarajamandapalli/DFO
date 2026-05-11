import React from 'react';
import {
    Users,
    MessageSquare,
    Calendar,
    AlertTriangle,
    LayoutDashboard,
    ChevronRight,
    TrendingUp,
    Activity,
    UserPlus,
    Loader2,
    CheckCircle2,
    Building2
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Role, Patient, Thread, Lead, Appointment } from '@/types';
import { cn } from '@/lib/utils';

// --- Sub-components for Dashboard ---

const StatCard = ({ stat }: { stat: any }) => (
    <Card key={stat.label} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all duration-300 ring-1 ring-slate-100">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
                <div className={cn("p-3 rounded-xl shadow-sm", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-slate-50 border-slate-100 text-slate-400">Telemetry</Badge>
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-950 tabular-nums tracking-tighter leading-none">{stat.value}</h3>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                {stat.foot}
            </div>
        </CardContent>
    </Card>
);

const DashboardHeader = ({ title, sub, profile }: { title: string, sub: string, profile: any }) => (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-sm">
                    <Building2 className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-black uppercase tracking-widest text-sky-500 leading-none">
                      Operational Environment
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-tight">
                      {profile?.domain || 'DFO CLINIC MAIN'}
                  </p>
                </div>
            </div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{title}</h1>
            <p className="text-slate-500 font-medium text-sm max-w-xl">{sub}</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/10">
            <div className="h-11 w-11 rounded-xl bg-slate-950 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-slate-950/10">
                {new Date().toLocaleDateString('en-US', { day: '2-digit' })}
            </div>
            <div className="pr-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Chronology</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter mt-0.5">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
            </div>
        </div>
    </div>
);

const CRODashboard = ({ patients, leads, appointments, consultations = [], profile }: { patients: Patient[], leads: Lead[], appointments: Appointment[], consultations?: any[], profile: any }) => {
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [isOptimized, setIsOptimized] = React.useState(false);

    const handleOptimize = () => {
        setIsOptimizing(true);
        // Simulate pipeline optimization algorithm (e.g., pruning dead leads, syncing CRMs)
        setTimeout(() => {
            setIsOptimizing(false);
            setIsOptimized(true);
            setTimeout(() => setIsOptimized(false), 3000);
        }, 2500);
    };

    // Generate real inflow data (last 5 days)
    const today = new Date();
    const data = Array.from({ length: 5 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (4 - i));
        const dayStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        // Count real patients registered on this day, fallback to 0
        const count = patients.filter(p => p.lastVisit && p.lastVisit.startsWith(dayStr)).length;
        // If data is entirely empty because it's mock db, we can let it be 0 to show "real" empty state
        return { name: dayName, patients: count };
    });

    const activeLeadsCount = leads.filter(l => l.status !== 'CONVERTED').length;
    const convertedLeadsCount = leads.filter(l => l.status === 'CONVERTED').length;
    const leadsPieData = [
        { name: 'Active', v: activeLeadsCount || 1 }, // Default to 1 for visual if empty
        { name: 'Converted', v: convertedLeadsCount || 0 }
    ];

    const stats = [
        { label: 'Total Leads', value: leads.length, icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50', foot: 'In leads table' },
        { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', foot: 'In patients table' },
        { label: 'Total Consultations', value: consultations.length, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50', foot: 'In consultations table' },
        { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', foot: 'In appointments table' },
    ];

    return (
        <div className="space-y-8 p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <DashboardHeader 
                title="Clinical Oversight" 
                sub="High-precision command and conversion intelligence for clinical acquisition." 
                profile={profile} 
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => <StatCard key={stat.label} stat={stat} />)}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="md:col-span-4 border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100">

                    <CardHeader className="p-7 pb-0">
                        <CardTitle className="text-lg font-black text-slate-950 tracking-tight">Patient Inflow Analytics</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-sky-500 mt-1">New registrations over last 5 days.</CardDescription>

                    </CardHeader>
                    <CardContent className="p-7 pt-5 h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                                <Bar dataKey="patients" fill="#0f172a" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="md:col-span-3 border-none shadow-lg rounded-2xl bg-slate-950 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 blur-[80px] rounded-full -mr-24 -mt-24" />
                    <CardHeader className="p-7">
                        <CardTitle className="text-lg font-black tracking-tight">Lead Distribution</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Conversion pipeline health.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-7 pb-7 flex flex-col items-center justify-center relative z-10">
                        <div className="h-[180px] w-full flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <p className="text-4xl font-black tracking-tighter">{activeLeadsCount}</p>
                                <p className="text-[8px] uppercase font-black tracking-widest text-white/30">Active Leads</p>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={leadsPieData} innerRadius={60} outerRadius={75} dataKey="v" stroke="none">
                                        <Cell fill="#38bdf8" />
                                        <Cell fill="#10b981" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <Button
                            onClick={handleOptimize}
                            disabled={isOptimizing || isOptimized}
                            className={cn(
                                "w-full mt-4 rounded-xl h-11 font-black uppercase text-[10px] tracking-widest transition-all duration-500 shadow-xl",
                                 isOptimized
                                    ? "bg-emerald-500 text-white hover:bg-emerald-500"
                                    : "bg-white text-slate-950 hover:bg-slate-50"
                            )}>

                            {isOptimizing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Algorithm Running...</>
                            ) : isOptimized ? (
                                <><CheckCircle2 className="mr-2 h-4 w-4" /> Pipeline Optimized</>
                            ) : (
                                "Optimize Pipeline"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const DoctorDashboard = ({ threads, appointments, patients, consultations = [], profile }: { threads: Thread[], appointments: Appointment[], patients: Patient[], consultations?: any[], profile: any }) => (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <DashboardHeader 
            title="Attending Physician" 
            sub="Specialist care and emergency triage command." 
            profile={profile} 
        />

        <div className="grid gap-6 md:grid-cols-4">
            {[
                { label: 'Consultations', value: consultations.length, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50', foot: 'Total completed' },
                { label: 'Critical Cases', value: threads.filter(t => t.riskLevel === 'RED').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', foot: 'Immediate attention' },
                { label: 'Appointments', value: appointments.length, icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50', foot: 'Total scheduled' },
                { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', foot: 'Under your care' },
            ].map((stat, i) => (
                <StatCard key={i} stat={stat} />
            ))}
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden ring-1 ring-border">
                <CardHeader className="p-8 border-b border-border">

                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black">High Risk Monitoring</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-tighter text-primary/60">Patients requiring immediate review</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl"><ChevronRight /></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {threads.filter(t => t.riskLevel === 'RED').slice(0, 4).map(thread => (
                            <div key={thread.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer group">

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 ring-4 ring-card shadow-sm">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{thread.patientName}</h4>
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-tighter mt-0.5">SLA: {thread.slaDeadline}</p>
                                    </div>

                                </div>
                                <Badge className="bg-red-100 text-red-700 border-none font-black text-[10px] uppercase">Action Required</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white overflow-hidden">
                <CardHeader className="p-8">
                    <CardTitle className="text-xl font-black">Today's Schedule</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Upcoming consultations</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <div className="space-y-4">
                        {appointments.slice(0, 3).map(app => (
                            <div key={app.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm">{app.patientName}</h4>
                                    <p className="text-[10px] font-black uppercase opacity-50 mt-1">{app.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black">{new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="text-[10px] font-black uppercase text-sky-400">Confirmed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button className="w-full mt-6 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl h-12 font-black uppercase text-xs tracking-widest shadow-xl shadow-sky-500/20">Access Full Calendar</Button>
                </CardContent>
            </Card>
        </div>
    </div>
);

const NurseDashboard = ({ patients, appointments, profile }: { patients: Patient[], appointments: Appointment[], profile: any }) => (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <DashboardHeader 
            title="Triage Station" 
            sub="Patient monitoring and vitals collection hub." 
            profile={profile} 
        />

        <div className="grid gap-6 md:grid-cols-4">
            {[
                { label: 'Patient Triage', value: patients.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', foot: 'Awaiting vitals' },
                { label: 'Vitals Logged', value: 12, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', foot: 'Today' },
                { label: 'Lab Samples', value: 4, icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50', foot: 'Pending collection' },
                { label: 'Task List', value: 8, icon: LayoutDashboard, color: 'text-amber-600', bg: 'bg-amber-50', foot: 'Incomplete tasks' },
            ].map((stat, i) => (stat && !stat.label.includes('undefined') && <StatCard key={i} stat={stat} />))}
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <Card className="md:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black">Upcoming Vitals Collection</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-tighter text-primary/60">Scheduled patient arrivals today</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-xl font-black uppercase text-[10px]">Refresh</Button>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <div className="space-y-4">
                        {appointments.slice(0, 5).map(app => (
                            <div key={app.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400">
                                        {app.patientName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{app.patientName}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{app.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900">{new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-[9px] font-black uppercase text-emerald-500">Arriving Soon</p>
                                    </div>
                                    <Button size="sm" className="rounded-lg bg-slate-900 hover:bg-primary font-black uppercase text-[9px] tracking-widest px-4">Start Triage</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-2xl rounded-[3rem] bg-emerald-600 text-white">
                <CardHeader className="p-8">
                    <CardTitle className="text-xl font-black">Nurse Station</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Operational Quick Actions</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-3">
                    <Button className="w-full h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl justify-between px-6 group transition-all">
                        <span className="font-bold flex items-center gap-3"><Activity className="h-4 w-4" /> Log Vitals</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button className="w-full h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl justify-between px-6 group transition-all">
                        <span className="font-bold flex items-center gap-3"><TrendingUp className="h-4 w-4" /> Lab Sample</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="p-6 rounded-[2rem] bg-white/10 border border-white/20 mt-6">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Shift Status</p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-black">Active</span>
                            <Badge className="bg-white text-emerald-600 font-black">08:00 - 20:00</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

interface DashboardViewProps {
    patients: Patient[];
    threads: Thread[];
    leads: Lead[];
    appointments: Appointment[];
    consultations?: any[];
    role: Role;
    profile: any;
}

export const DashboardView = ({ patients, threads, leads, appointments, consultations, role, profile }: DashboardViewProps) => {
    switch (role) {
        case 'CRO': return <CRODashboard patients={patients} leads={leads} appointments={appointments} consultations={consultations} profile={profile} />;
        case 'DOCTOR': return <DoctorDashboard threads={threads} appointments={appointments} patients={patients} consultations={consultations} profile={profile} />;
        case 'NURSE': return <NurseDashboard patients={patients} appointments={appointments} profile={profile} />;
        default: return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-64px)]">
                <LayoutDashboard className="h-12 w-12 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Dashboard for {role} role is under development.</h3>
            </div>
        );
    }
};

// Custom Icon for stats
const Globe = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);
