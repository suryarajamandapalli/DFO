import React, { useState } from 'react';
import {
    UserPlus,
    Search,
    MoreVertical,
    Phone,
    Mail,
    Globe,
    Calendar,
    ArrowRight,
    Filter,
    CheckCircle2,
    Clock,
    ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Lead } from '../../types';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { triggerCall, triggerWhatsApp, triggerSmartCall } from '../../lib/communication';
import { MessageSquare } from 'lucide-react';



interface LeadsViewProps {
    leads: Lead[];
    onConvert: (lead: Lead) => Promise<{ success: boolean; error?: string }>;
}

export const LeadsView = ({ leads, onConvert }: LeadsViewProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const filteredLeads = leads.filter(l => {
        const nameMatch = l.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = l.phone?.includes(searchTerm);
        return nameMatch || phoneMatch;
    });



    const handleConvert = async (lead: Lead) => {
        setIsConverting(true);
        try {
            const result = await onConvert(lead);
            setIsConverting(false);
            if (result.success) {
                setSelectedLead(null);
            } else {
                alert("Conversion failed: " + result.error);
            }
        } catch (err: any) {
            setIsConverting(false);
            console.error('Conversion error:', err.message);
            let userMessage = err.message;
            if (err.message.includes('unique_constraint') || err.message.includes('duplicate key')) {
                userMessage = "This patient is already registered (phone number already exists).";
            }
            alert("Conversion failed: " + userMessage);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Leads & CRM</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Manage potential patients and conversions</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 rounded-xl border-border bg-card"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl border-border">
                        <Filter className="h-4 w-4" />
                    </Button>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {filteredLeads.map(lead => (
                        <Card
                            key={lead.id}
                            className={cn(
                                "border-none shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl group",
                                selectedLead?.id === lead.id ? "ring-2 ring-primary" : ""
                            )}
                            onClick={() => setSelectedLead(lead)}
                        >
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary/5 transition-colors">
                                        <UserPlus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{lead.name || 'Untitled Lead'}</h4>

                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter">
                                                {lead.source || 'Direct'}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-medium">Added {lead.createdAt ? format(new Date(lead.createdAt), 'MMM d, p') : 'Recent'}</span>
                                        </div>

                                    </div>

                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase",
                                                lead.status === 'NEW' ? "text-blue-500 border-blue-100 bg-blue-50" :
                                                    lead.status === 'CONTACTED' ? "text-amber-500 border-amber-100 bg-amber-50" :
                                                        "text-emerald-500 border-emerald-100 bg-emerald-50"
                                            )}>
                                                {lead.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-lg">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div>
                    {selectedLead ? (
                        <Card className="border-none shadow-xl rounded-[2.5rem] sticky top-6 bg-card overflow-hidden ring-1 ring-primary/20">
                            <div className="h-24 bg-slate-900 relative">
                                <div className="absolute -bottom-10 left-8">
                                    <div className="h-20 w-20 rounded-3xl bg-card p-1 shadow-xl">
                                        <div className="h-full w-full rounded-[1.25rem] bg-muted flex items-center justify-center border border-border">
                                            <UserPlus className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-14 pb-8 px-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-foreground">{selectedLead.name || 'Anonymous'}</h3>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Potential Patient</p>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 font-black uppercase text-[10px]">
                                        {selectedLead.status || 'NEW'}
                                    </Badge>
                                </div>



                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border group hover:border-primary/20 transition-all">
                                        <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Phone Number</p>
                                            <p className="font-bold text-foreground">{selectedLead.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                                        <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Created Date</p>
                                            <p className="font-bold text-foreground">{selectedLead.createdAt ? format(new Date(selectedLead.createdAt), 'MMMM d, yyyy') : 'Recently'}</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <Button 
                                        variant="outline" 
                                        className="flex-col h-20 rounded-2xl gap-2 border-border hover:bg-sky-500/5 hover:border-sky-500/20 group text-foreground"
                                    >

                                        <div className="p-2 rounded-lg bg-sky-50 text-sky-600 mt-1">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase">Verify</span>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex-col h-20 rounded-2xl gap-2 border-slate-100 hover:bg-emerald-50 hover:border-emerald-100"
                                        onClick={() => selectedLead.phone && triggerSmartCall(selectedLead.phone)}
                                    >
                                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-1">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase text-center">Call</span>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex-col h-20 rounded-2xl gap-2 border-slate-100 hover:bg-green-50 hover:border-green-100"
                                        onClick={() => selectedLead.phone && triggerWhatsApp(selectedLead.phone)}
                                    >
                                        <div className="p-2 rounded-lg bg-green-50 text-green-600 mt-1">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase text-center">Message</span>
                                    </Button>


                                </div>



                                <Button
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl"
                                    onClick={() => handleConvert(selectedLead)}
                                    disabled={isConverting}
                                >
                                    {isConverting ? (
                                        <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-5 w-5" />
                                            Convert to Patient
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4">This will create a new patient registry entry</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50">
                            <div className="relative mb-8">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center border border-slate-100">
                                    <UserPlus className="h-10 w-10 text-primary" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-sky-500 shadow-lg flex items-center justify-center text-white ring-4 ring-white">
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Select a Lead</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 leading-relaxed max-w-[200px]">
                                Choose a prospective patient from the list to initiate the clinical conversion workflow.
                            </p>
                            <div className="mt-8 flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};
