import React, { useState } from 'react';
import { Appointment } from '@/types';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, Plus, Video, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AppointmentsView = ({ appointments }: { appointments: Appointment[] }) => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Sort appointments by date
    const sortedApps = [...appointments].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Filter by selected date
    const filteredApps = date
        ? sortedApps.filter(app => new Date(app.startTime).toDateString() === date.toDateString())
        : sortedApps;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Appointments</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Manage your schedule and consultations</p>
                </div>


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden p-6 ring-1 ring-border">

                        <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full flex justify-center !font-sans"
                            classNames={{
                                head_cell: "text-muted-foreground font-black uppercase text-[10px] tracking-widest w-9 font-normal",
                                cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                                day: "h-10 w-10 p-0 font-bold hover:bg-muted rounded-xl transition-all",
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-black shadow-lg shadow-primary/20",
                                caption_label: "font-black text-lg text-foreground",
                            }}

                        />
                    </Card>

                    <Card className="border-none shadow-2xl rounded-[3rem] bg-foreground text-background p-8">
                        <h4 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">Daily Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-background/10">
                                <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-1">Confirmed</p>
                                <p className="text-2xl font-black">{filteredApps.length}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-background/10">
                                <p className="text-[10px] uppercase font-black tracking-widest text-amber-400 mb-1">Pending</p>
                                <p className="text-2xl font-black">{filteredApps.length > 0 ? 1 : 0}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden h-full ring-1 ring-border">
                        <CardHeader className="p-8 border-b border-border">

                            <CardTitle className="text-xl font-black text-foreground">
                                {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'All Appointments'}
                            </CardTitle>

                            <CardDescription className="text-xs font-bold uppercase tracking-tighter text-primary/60">
                                {filteredApps.length} scheduled for this day
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">

                                {filteredApps.length === 0 ? (
                                    <div className="p-12 text-center text-muted-foreground">
                                        <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                        <p className="font-bold">No appointments scheduled for this date.</p>
                                    </div>

                                ) : (
                                    filteredApps.map((app) => (
                                        <div key={app.id} className="p-6 hover:bg-muted/50 transition-colors group flex flex-col sm:flex-row sm:items-center gap-6">
                                            <div className="flex-shrink-0 w-24 text-center sm:text-left">
                                                <p className="text-sm font-black text-foreground">{new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                                    {Math.round((new Date(app.endTime).getTime() - new Date(app.startTime).getTime()) / 60000)} Min
                                                </p>
                                            </div>


                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{app.patientName}</h3>
                                                    <Badge className={cn("text-[9px] font-black uppercase tracking-widest border-none",
                                                        app.status === 'CONFIRMED' || app.status === 'SCHEDULED' ? "bg-sky-500/10 text-sky-500" :
                                                            app.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" :
                                                                app.status === 'NO_SHOW' ? "bg-red-500/10 text-red-500" :
                                                                    "bg-amber-500/10 text-amber-500"
                                                    )}>

                                                        {app.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-1.5 border border-border rounded-md px-2 py-0.5">
                                                        <User className="h-3 w-3" /> Dr. {app.doctorName || 'Assigned'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Badge variant="outline" className="border-border text-muted-foreground uppercase tracking-tighter text-[9px] font-bold">
                                                            {app.type.replace(/_/g, ' ')}
                                                        </Badge>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground">
                                                    {app.type?.includes('VIDEO') ? <Video className="h-4 w-4" /> : app.type?.includes('CALL') ? <Phone className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                                                </Button>


                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
