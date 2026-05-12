import React from "react";
import {
    AlertTriangle,
    Settings,
    ShieldCheck,
    Zap,
    Phone,
    MessageSquare,
    ArrowRight,
    Clock,
    UserPlus,
    Activity
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thread, Patient, Lead, Appointment, Role } from "@/types";
import { cn } from "@/lib/utils";

interface RiskMonitorProps {
    patients: Patient[];
    leads?: Lead[];
    appointments?: Appointment[];
    threads?: Thread[];
    role?: Role;
}

export const RiskMonitorView = ({ patients, leads = [], appointments = [], threads = [], role = 'DOCTOR' }: RiskMonitorProps) => {

    // CRO Operational Dashboard
    if (role === 'CRO') {
        const activeLeads = leads.filter(l => l.status !== 'CONVERTED');
        const openThreads = threads.filter(t => t.status === 'OPEN');
        const breachedSLAs = openThreads.filter(t => {
            const diffMin = (Date.now() - new Date(t.slaDeadline || t.lastMessageTime).getTime()) / 60000;
            return diffMin > 15; // > 15 minutes old unresponded
        });
        const impendingAppointments = appointments.filter(a => {
            const timeDiff = new Date(a.startTime).getTime() - Date.now();
            return timeDiff > 0 && timeDiff < 3600000; // within next 1 hour
        });

        return (
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Operations Escalation Board</h2>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Real-time alerts for service level agreements</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge className="bg-amber-500/10 text-amber-500 border-none px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            {breachedSLAs.length} Missed SLAs
                        </Badge>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-lg">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h3 className="text-lg font-black text-foreground">Overdue Responses Queue</h3>
                        </div>

                        <div className="grid gap-4">
                            {breachedSLAs.map((t) => (
                                <Card key={t.id} className="border-none shadow-xl rounded-[2.5rem] bg-card overflow-hidden group hover:scale-[1.01] transition-all ring-1 ring-border">

                                    <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                                        <div className="w-2 bg-amber-500" />
                                        <div className="p-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-[1.5rem] bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl border border-amber-500/20 shadow-inner">
                                                    {t.patientName?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-xl font-black text-foreground leading-none">{t.patientName}</h4>
                                                        <Badge className="bg-primary text-primary-foreground border-none font-black text-[9px] uppercase tracking-widest px-2">Message</Badge>
                                                    </div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter tabular-nums mb-3">Pending since: {new Date(t.slaDeadline).toLocaleTimeString()}</p>
                                                    <Badge variant="outline" className="rounded-lg bg-amber-500/10 text-amber-500 border-none font-bold text-[9px] uppercase px-2 py-1 italic">SLA Breached</Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button className="h-12 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-amber-500/20">Reply Now</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                             {breachedSLAs.length === 0 && (
                                <div className="p-8 bg-muted/50 rounded-[2.5rem] text-center border border-border">
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No currently breached communication SLAs.</p>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="space-y-8">
                        <Card className="border-none shadow-2xl rounded-[3rem] bg-card p-8 ring-1 ring-border">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-black text-foreground uppercase text-xs tracking-widest flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-sky-500" /> Clinic Metrics
                                </h4>
                                <Badge className="bg-sky-500/10 text-sky-500 border-none font-black uppercase text-[9px]">Live</Badge>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-[2rem] bg-muted border border-border">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 font-mono">Active Queries</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-foreground">{openThreads.length}</span>
                                        <MessageSquare className="h-5 w-5 text-muted-foreground/30" />
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-muted border border-border">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 font-mono">At-Risk Leads</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-foreground">{activeLeads.length}</span>
                                        <UserPlus className="h-5 w-5 text-muted-foreground/30" />
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-muted border border-border">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 font-mono">Arrivals Next Hour</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-foreground">{impendingAppointments.length}</span>
                                        <Clock className="h-5 w-5 text-muted-foreground/30" />
                                    </div>
                                </div>
                            </div>

                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Doctor/Nurse Clinical Dashboard
    const highRisk = patients.filter(p => p.riskLevel === 'RED');
    // For REAL stats instead of mock percentages:
    // Determine confidence by whether vitals were logged today
    const vitalsToday = patients.filter(p => p.lastVisit && p.lastVisit.startsWith(new Date().toISOString().split('T')[0])).length;
    const sysIntegrity = patients.length > 0 ? Math.round((vitalsToday / patients.length) * 100) : 100;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Clinical Risk Monitor</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Real-time physiological risk analysis across patient population</p>
                </div>

                <div className="flex items-center gap-4">
                    <Badge className="bg-red-500/10 text-red-500 border-none px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        {highRisk.length} High Risk Cases
                    </Badge>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-lg">
                            <Zap className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-black text-foreground">Priority Triage Queue</h3>
                    </div>

                    <div className="grid gap-4">
                        {highRisk.map((p) => (
                            <Card key={p.id} className="border-none shadow-xl rounded-[2.5rem] bg-card overflow-hidden group hover:scale-[1.01] transition-all ring-1 ring-border">

                                <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                                    <div className="w-2 bg-red-500" />
                                    <div className="p-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-[1.5rem] bg-red-500/10 text-red-500 flex items-center justify-center font-black text-xl border border-red-500/20 shadow-inner">
                                                {p.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-xl font-black text-foreground leading-none">{p.name}</h4>
                                                    <Badge className="bg-primary text-primary-foreground border-none font-black text-[9px] uppercase tracking-widest px-2">E-Case</Badge>
                                                </div>

                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter tabular-nums mb-3">{p.phone} • Triage Required</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="rounded-lg bg-muted text-muted-foreground border-border font-bold text-[9px] uppercase px-2 py-1">BP: {p.vitals?.bp || 'Unknown'}</Badge>
                                                    <Badge variant="outline" className="rounded-lg bg-red-500/10 text-red-500 border-none font-bold text-[9px] uppercase px-2 py-1 italic">High Risk Flag</Badge>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border hover:bg-muted transition-colors">
                                                <Phone className="h-5 w-5 text-muted-foreground" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border hover:bg-muted transition-colors">
                                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                            </Button>

                                            <Button className="h-12 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/20">Critical Response</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {highRisk.length === 0 && (
                            <div className="p-8 bg-muted/50 rounded-[2.5rem] text-center border border-border">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No RED risk patients currently tracked in the database.</p>
                            </div>
                        )}

                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-card p-8 ring-1 ring-border">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-foreground uppercase text-xs tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Triage Metrics
                            </h4>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black uppercase text-[9px]">Live</Badge>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-[2rem] bg-muted border border-border">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 font-mono">Monitored Pool</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-foreground">{patients.length}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className={cn("w-1.5 h-6 rounded-full", i < 5 ? "bg-emerald-500" : "bg-muted")} />)}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-muted border border-border">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 font-mono">Critical Backlog</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-foreground">{highRisk.length}</span>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Alerts</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl">Download Duty Roster</Button>

                    </Card>

                    <div className="p-8 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-600/30 transition-transform active:scale-[0.98]">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                            <AlertTriangle className="h-24 w-24" />
                        </div>
                        <h4 className="text-xl font-black relative z-10">Escalation Protocol</h4>
                        <p className="text-xs font-bold opacity-70 mt-3 relative z-10 max-w-[180px] leading-relaxed uppercase tracking-widest mb-6">Automated emergency alerts for attending doctors are active.</p>
                        <div className="relative z-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] group-hover:gap-4 transition-all">
                            Manage Settings <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
