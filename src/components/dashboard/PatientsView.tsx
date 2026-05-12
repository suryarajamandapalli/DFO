import React from 'react';
import {
    Users,
    Search,
    Filter,
    Download,
    Plus,
    MoreVertical,
    ChevronRight,
    ArrowLeft,
    Calendar,
    Phone,
    Activity,
    Heart,
    Weight,
    Thermometer,
    FileSignature,
    Edit2,
    MessageSquare
} from 'lucide-react';
import { triggerCall, triggerWhatsApp, triggerSmartCall } from '@/lib/communication';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Patient, RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

export const PatientsView = ({
    patients,
    searchTerm,
    setSearchTerm,
    onSelectPatient
}: {
    patients: Patient[],
    searchTerm: string,
    setSearchTerm: (s: string) => void,
    onSelectPatient: (p: Patient) => void
}) => {
    const filteredPatients = patients.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = p.phone?.includes(searchTerm);
        return nameMatch || phoneMatch;
    });



    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Patient Registry</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Total {patients.length} patients under management</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 rounded-xl border-slate-200"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold uppercase text-[10px] tracking-widest gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>

                </div>
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-card ring-1 ring-border">
                <div className="overflow-x-auto scrollbar-hide">
                    <Table>
                    <TableHeader className="bg-muted/50">

                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[300px] font-black uppercase text-[10px] tracking-widest py-6 px-8">Patient Identity</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest py-6">Journey Stage</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 text-center">Risk Level</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest py-6">Last Engagement</TableHead>
                            <TableHead className="text-right py-6 px-8"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow
                                key={patient.id}
                                className="hover:bg-muted/50 cursor-pointer border-border group"
                                onClick={() => onSelectPatient(patient)}
                            >

                                <TableCell className="py-6 px-8 font-medium">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {patient.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground leading-none">{patient.name || 'Anonymous Patient'}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{patient.phone || 'No Phone'} • {patient.age || '??'}y</p>
                                        </div>


                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-lg bg-teal-50 text-teal-600 border-teal-100 font-black uppercase text-[9px] tracking-tighter">
                                        {patient.journeyStage?.replace(/_/g, ' ') || 'Registered'}
                                    </Badge>

                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <div className={cn(
                                            "flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase border",
                                            patient.riskLevel === 'RED' ? "bg-red-50 text-red-600 border-red-100" :
                                                patient.riskLevel === 'YELLOW' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                                patient.riskLevel === 'RED' ? "bg-red-500" :
                                                    patient.riskLevel === 'YELLOW' ? "bg-amber-500" : "bg-emerald-500"
                                            )} />
                                            {patient.riskLevel}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground font-bold text-xs uppercase tabular-nums">
                                    {new Date(patient.lastVisit || '').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </TableCell>

                                <TableCell className="text-right px-8">
                                    <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white border-transparent hover:border-slate-100 border transition-all">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </Card>
        </div>
    );
};

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

export const PatientDetailView = ({
    patient,
    onBack,
    onSchedule
}: {
    patient: Patient,
    onBack: () => void,
    onSchedule: () => void
}) => {
    const [showProfile, setShowProfile] = React.useState(false);
    const [showDocument, setShowDocument] = React.useState(false);
    const [selectedDoc, setSelectedDoc] = React.useState<any>(null);

    const handleViewDoc = (doc: any) => {
        setSelectedDoc(doc);
        setShowDocument(true);
    };
    return (
        <>
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="rounded-xl group font-black uppercase text-[10px] tracking-[0.2em] gap-2">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Registry
                </Button>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-border"
                        onClick={() => setShowProfile(true)}
                    >
                        <Edit2 className="h-4 w-4 mr-2" /> Medical Profile
                    </Button>
                    <Button
                        className="rounded-xl bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest gap-2 h-10 px-6"
                        onClick={onSchedule}
                    >
                        <Plus className="h-4 w-4" /> New Consultation
                    </Button>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Patient Profile */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden p-8 text-center ring-1 ring-border">

                        <div className="flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-muted flex items-center justify-center border border-border overflow-hidden shadow-inner">
                                    <span className="text-4xl font-black text-muted-foreground group-hover:scale-110 transition-transform">{patient.name?.charAt(0) || '?'}</span>
                                </div>

                                <div className={cn(
                                    "absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl border-4 border-white flex items-center justify-center",
                                    patient.riskLevel === 'RED' ? "bg-red-500" :
                                        patient.riskLevel === 'YELLOW' ? "bg-amber-500" : "bg-emerald-500"
                                )}>
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight leading-none">{patient.name || 'Anonymous'}</h2>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-2">{patient.phone || 'No Phone'} • {patient.age || '??'} Years Old</p>



                            <div className="mt-6 pt-6 border-t border-border w-full grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Risk Factor</p>
                                    <p className={cn(
                                        "text-xs font-black mt-1",
                                        patient.riskLevel === 'RED' ? "text-red-500" :
                                            patient.riskLevel === 'YELLOW' ? "text-amber-500" : "text-emerald-500"
                                    )}>{patient.riskLevel}</p>
                                </div>
                                <div className="text-center border-l border-border">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Reg. Date</p>
                                    <p className="text-xs font-black text-foreground mt-1">Mar 12, 2026</p>
                                </div>
                            </div>


                            <div className="mt-6 w-full flex gap-3">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 rounded-2xl bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 gap-2 h-12 font-black uppercase text-[10px] tracking-widest"
                                    onClick={() => triggerSmartCall(patient.phone)}
                                >
                                    <Phone className="h-4 w-4" /> Call
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="flex-1 rounded-2xl bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:border-green-200 gap-2 h-12 font-black uppercase text-[10px] tracking-widest"
                                    onClick={() => triggerWhatsApp(patient.phone)}
                                >
                                    <MessageSquare className="h-4 w-4" /> Message
                                </Button>

                            </div>

                        </div>

                    </Card>

                    <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-8">
                        <h4 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">Current Vitals</h4>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Blood Pressure', value: patient.vitals?.bp || 'N/A', icon: Activity, color: 'text-rose-400' },
                                { label: 'Weight', value: (patient.vitals?.weight || '??') + ' kg', icon: Weight, color: 'text-sky-400' },
                                { label: 'Heart Rate', value: (patient.vitals?.heartRate || '??') + ' bpm', icon: Heart, color: 'text-emerald-400' },
                                { label: 'Temperature', value: (patient.vitals?.temp || '??') + ' °F', icon: Thermometer, color: 'text-amber-400' },
                            ].map((vital, i) => (

                                <div key={i} className="group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <vital.icon className={cn("h-4 w-4 opacity-100", vital.color)} />
                                        <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">{vital.label}</span>
                                    </div>
                                    <p className="text-lg font-black tabular-nums">{vital.value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Timeline & Documents */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden h-full ring-1 ring-border">
                        <CardHeader className="p-8 border-b border-border">
                            <CardTitle className="text-xl font-black text-foreground">Clinical History & Documents</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-tighter text-primary/60">Comprehensive timeline of care engagement</CardDescription>
                        </CardHeader>

                        <CardContent className="p-8">
                            <div className="space-y-8 relative">
                                <div className="absolute left-6 top-1 bottom-1 w-px bg-slate-100" />

                                {[
                                    { title: 'Obstetric Consultation', time: 'Yesterday, 10:45 AM', type: 'Clinical Notes', icon: FileSignature, color: 'bg-primary/10 text-primary' },
                                    { title: 'Blood Work Report', time: 'Oct 24, 2026', type: 'Laboratory', icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
                                    { title: 'Triage Check-in', time: 'Oct 22, 2026', type: 'Nurse Triage', icon: Weight, color: 'bg-indigo-50 text-indigo-600' },
                                ].map((event, i) => (
                                    <div key={i} className="flex gap-10 relative">
                                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm", event.color)}>
                                            <event.icon className="h-6 w-6" />
                                        </div>
                                        <div className="group flex-1 cursor-pointer">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter tabular-nums">{event.time}</span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{event.type}</p>

                                            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">Standard clinical evaluation conducted. Vital signs within normal parameters for the patient's gestational stage.</p>
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    className="p-0 h-auto mt-2 text-[10px] font-bold uppercase text-primary"
                                                    onClick={() => handleViewDoc(event)}
                                                >
                                                    View Full Document
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        {/* Medical Profile Dialog */}
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
            <DialogContent className="max-w-2xl rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-card">
                <DialogHeader className="p-8 bg-slate-950 text-white">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <FileSignature className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black tracking-tight">Comprehensive Medical Profile</DialogTitle>
                            <DialogDescription className="text-xs font-bold text-white/50 uppercase tracking-widest">Confidential Patient Health Record</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Details</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Name:</span> <span className="font-bold text-foreground">{patient.name}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Age:</span> <span className="font-bold text-foreground">{patient.age} Years</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Phone:</span> <span className="font-bold text-foreground">{patient.phone}</span></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Data</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Risk Score:</span> <Badge className="bg-emerald-500 font-black">{patient.riskLevel}</Badge></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Journey:</span> <span className="font-bold text-foreground uppercase text-xs">{patient.journeyStage}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-border">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Chronic Conditions & History</h5>
                        <p className="text-sm text-foreground leading-relaxed font-medium">
                            No significant chronic conditions reported. Patient is currently in the {patient.journeyStage?.replace('_', ' ')} stage. Previous fertility markers indicate normal parameters. Last medical review conducted on Oct 24, 2026.
                        </p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={() => setShowProfile(false)} className="rounded-xl bg-foreground text-background font-bold px-8">Close Profile</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Document Preview Dialog (PDF Viewer Style) */}
        <Dialog open={showDocument} onOpenChange={setShowDocument}>
            <DialogContent className="max-w-[90vw] w-[1200px] h-[90vh] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-muted flex flex-col">
                {/* Viewer Toolbar */}
                <DialogHeader className="p-4 bg-background border-b border-border flex-row items-center justify-between space-y-0 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", selectedDoc?.color)}>
                                {selectedDoc && <selectedDoc.icon className="h-5 w-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-foreground text-sm font-bold tracking-tight">{selectedDoc?.title}.pdf</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Clinical Document • {selectedDoc?.time}
                                </DialogDescription>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-border" />
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background rounded-md">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <span className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest border-x border-border">Page 1 / 1</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background rounded-md">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="bg-card border-border hover:bg-muted text-foreground rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2">
                            <Download className="h-4 w-4" /> Export PDF
                        </Button>
                        <Button variant="ghost" onClick={() => setShowDocument(false)} className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-xl p-0">
                            <Plus className="h-6 w-6 rotate-45" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Viewer Canvas */}
                <div className="flex-1 overflow-auto p-12 flex justify-center bg-muted/50 scrollbar-hide">
                    <div className="bg-card w-full max-w-[850px] shadow-2xl min-h-[1100px] p-20 flex flex-col animate-in zoom-in-95 duration-500 origin-top text-foreground">
                        {/* PDF Header */}
                        <div className="flex justify-between border-b-4 border-slate-900 pb-12 mb-12">
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">CLINICAL <span className="text-sky-500 uppercase">Report</span></h1>
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] leading-none">DFO • Janmasethu Healthcare</p>
                            </div>
                            <div className="text-right">
                                <div className="bg-slate-900 text-white px-4 py-2 inline-block rounded-lg mb-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest">Document ID</p>
                                    <p className="text-xs font-mono">JS-DOC-2026-X99</p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date: {selectedDoc?.time}</p>
                            </div>
                        </div>

                        {/* PDF Body */}
                        <div className="flex-1 space-y-12">
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-sky-600 border-b border-sky-100 pb-2">Patient Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-slate-400">Full Name</p>
                                            <p className="text-sm font-bold text-slate-900">{patient.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-slate-400">Identity UID</p>
                                            <p className="text-sm font-bold text-slate-900">{patient.id?.slice(0, 12).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-sky-600 border-b border-sky-100 pb-2">Clinical Context</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-slate-400">Primary Diagnosis</p>
                                            <p className="text-sm font-bold text-slate-900">Standard Gestational Monitoring</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-slate-400">Risk Assessment</p>
                                            <p className="text-sm font-bold text-slate-900 uppercase">{patient.riskLevel} STRATIFIED</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                                "Clinical findings indicate a stable progression. All vital markers are within the expected percentile for this stage. No immediate intervention required. Recommended follow-up in 14 days."
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Detailed Observations</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        "Normal physiological markers confirmed via ultrasound.",
                                        "Baseline blood panels show optimal hormonal balance.",
                                        "Patient reports high compliance with prescribed supplements."
                                    ].map((note, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white text-[10px] font-black">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium">{note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* PDF Footer / Signatures */}
                        <div className="mt-20 pt-12 border-t-2 border-slate-100 flex justify-between items-end">
                            <div>
                                <div className="h-16 w-48 bg-slate-50 rounded-xl mb-4 border border-dashed border-slate-200 flex items-center justify-center">
                                    <span className="text-slate-300 font-serif italic text-2xl">A. Smith</span>
                                </div>
                                <p className="text-sm font-black text-slate-950">Dr. Alexander Smith</p>
                                <p className="text-[8px] font-black uppercase text-sky-500 tracking-[0.2em] mt-1">Senior Clinical Lead, DFO</p>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mb-4">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Record</span>
                                </div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Signed on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};
