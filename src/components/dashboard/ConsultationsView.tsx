import React from "react";
import {
    Stethoscope,
    Search,
    MoreVertical,
    FileSignature,
    Activity,
    MessageSquare,
    Calendar,
    RefreshCw,
    Plus,
    FileText
} from "lucide-react";
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table';
import { Patient } from "../../types";
import { cn } from "../../lib/utils";

export const ConsultationsView = ({
    patient,
    consultations,
    refreshConsultations
}: {
    patient: any,
    consultations: any[],
    refreshConsultations: () => void
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Clinical Consultations</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Manage active patient cases and prescriptions</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => refreshConsultations()} className="rounded-xl border-border font-bold uppercase text-[10px] tracking-widest gap-2 h-10 px-4">
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </Button>


                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-card overflow-hidden col-span-1 md:col-span-4 ring-1 ring-border">
                    <Table>
                        <TableHeader className="bg-muted/50">

                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-[300px] font-black uppercase text-[10px] tracking-widest py-6 px-8">Patient Identity</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-6">Date</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-6">Diagnosis</TableHead>
                                <TableHead className="text-right py-6 px-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {consultations.map((c) => (
                                <TableRow key={c.id} className="hover:bg-muted/50 cursor-pointer border-border group">
                                    <TableCell className="py-6 px-8 font-medium">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-black text-muted-foreground">
                                                {c.patientName?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground leading-none">{c.patientName}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">ID: {c.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="tabular-nums font-bold text-xs">
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-lg bg-sky-500/10 text-sky-500 border-none font-black uppercase text-[9px] tracking-tighter">
                                            {c.summary || 'Initial Evaluation'}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right px-8">
                                        <Button variant="ghost" size="icon" className="rounded-lg">
                                            <FileText className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

            </div>
        </div>
    );
};
