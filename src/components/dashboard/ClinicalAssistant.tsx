import React, { useState, useRef, useEffect } from "react";
import {
    Bot,
    Send,
    Sparkles,
    X,
    User,
    Loader2,
    ChevronDown,
    RefreshCw,
    Users,
    Clock,
    ShieldCheck
} from "lucide-react";
import { Button } from '../ui/button';
import { Card, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from "../../lib/utils";

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    time: string;
}

export const ClinicalAssistant = ({
    isOpen,
    onClose,
    patients = [],
    appointments = [],
    consultations = []
}: {
    isOpen: boolean,
    onClose: () => void,
    patients?: any[],
    appointments?: any[],
    consultations?: any[]
}) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'ai', text: "Hello! I am your Clinical Assistant. I can help you retrieve patient data, explain medications, or check clinical protocols. How can I assist you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSend = (forcedText?: string) => {
        const messageText = forcedText || input;
        if (!messageText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // AI logic
        setTimeout(() => {
            let aiText = "I'm processing your clinical request. Could you please specify which patient or protocol you're interested in?";

            const lowerInput = messageText.toLowerCase();
            if (lowerInput.includes('patient') || lowerInput.includes('who')) {
                if (patients.length > 0) {
                    aiText = `**Active Patient Registry:**\n\n${patients.map(p => `• **${p.name}**\n  *Risk:* ${p.riskLevel} | *BP:* ${p.vitals?.bp || 'N/A'}`).join('\n\n')}`;
                } else {
                    aiText = "I couldn't find any patients in the active registry. Please ensure the clinical database is connected.";
                }
            } else if (lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
                if (appointments.length > 0) {
                    aiText = `**Upcoming Appointments:**\n\n${appointments.map(a => `• **${a.patientName}**\n  *Time:* ${new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n  *Type:* ${a.type}`).join('\n\n')}`;
                } else {
                    aiText = "Your schedule is currently clear. No upcoming appointments found.";
                }
            } else if (lowerInput.includes('consultation')) {
                if (consultations.length > 0) {
                    aiText = `**Recent Consultations:**\n\n${consultations.slice(0, 5).map(c => `• **${c.patientName}**\n  *Date:* ${new Date(c.created_at || c.date || Date.now()).toLocaleDateString()}\n  *Status:* ${c.status || 'Completed'}`).join('\n\n')}`;
                } else {
                    aiText = "No consultation records found in the current session.";
                }
            } else if (lowerInput.includes('protocol') || lowerInput.includes('sla') || lowerInput.includes('triage')) {
                aiText = "### Clinical Triage Protocol (V2.0)\n\n**Response Time Targets:**\n- 🔴 **CRITICAL (RED):** < 5 Minutes\n- 🟡 **URGENT (YELLOW):** < 20 Minutes\n- 🟢 **STABLE (GREEN):** < 60 Minutes\n\n*Immediate action required for all RED alerts.*";
            } else if (lowerInput.includes('report')) {
                aiText = "I can generate a summary report for you. Which patient's data should I synthesize into the report?";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const clearChat = () => {
        setMessages([{ id: '1', sender: 'ai', text: "Chat history cleared. How else can I help?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-[450px] z-[60] animate-in slide-in-from-right-10 duration-500">
            <Card className="border-none shadow-2xl rounded-[2rem] bg-card/95 backdrop-blur-xl overflow-hidden flex flex-col h-[650px] ring-1 ring-border">

                <div className="bg-primary p-6 text-primary-foreground shrink-0 relative">

                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Bot className="h-24 w-24 -rotate-12" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shadow-lg">
                                <Bot className="h-6 w-6 text-primary-foreground" />
                            </div>

                            <div>
                                <CardTitle className="text-lg font-black leading-none tracking-tight text-primary-foreground">Clinical Intelligence</CardTitle>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-foreground/60">System Online</span>
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat" className="rounded-lg hover:bg-white/10 text-primary-foreground/40 hover:text-white h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg hover:bg-white/10 text-primary-foreground/60 h-8 w-8">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                    </div>
                    <p className="text-[10px] font-bold text-primary-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                        <Sparkles className="h-3 w-3 text-sky-400" /> Powered by Clinical OS Knowledge
                    </p>

                </div>

                <ScrollArea className="flex-1 bg-background px-6 py-8">

                    <div className="space-y-8 pr-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex gap-4 items-start", msg.sender === 'user' ? "flex-row-reverse" : "")}>
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border mt-1",
                                    msg.sender === 'ai' 
                                        ? "bg-card text-sky-500 border-border" 
                                        : "bg-primary text-primary-foreground border-primary"
                                )}>

                                    {msg.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </div>
                                <div className="flex flex-col gap-1.5 max-w-[85%]">
                                    <div className={cn(
                                        "p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm",
                                        msg.sender === 'ai' 
                                            ? "bg-card text-foreground border border-border rounded-tl-none" 
                                            : "bg-sky-600 text-white rounded-tr-none shadow-sky-600/10"
                                    )}>

                                        <div className="prose prose-sm max-w-none">
                                            {msg.text.split('\n').map((line, i) => (
                                                <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-1",
                                        msg.sender === 'user' ? "text-right text-muted-foreground" : "text-muted-foreground"
                                    )}>
                                        {msg.time}
                                    </span>

                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4 items-start">
                                <div className="h-8 w-8 rounded-lg bg-card text-sky-500 border border-border flex items-center justify-center shrink-0 shadow-sm mt-1">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div className="bg-muted/50 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none border border-border flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                                    </div>
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Processing Registry...</span>
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-6 bg-card border-t border-border shrink-0">

                    <div className="flex flex-wrap gap-2 mb-4">
                        {[
                            { label: 'Check Triage SLA', icon: Clock },
                            { label: 'Patient Registry', icon: Users },
                            { label: 'Clinical Protocols', icon: ShieldCheck }
                        ].map((btn) => (
                            <button 
                                key={btn.label}
                                onClick={() => handleSend(btn.label)}
                                className="text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-sky-500 hover:text-white hover:shadow-lg transition-all border border-border flex items-center gap-1.5"
                            >
                                <btn.icon className="h-3 w-3" />
                                {btn.label}
                            </button>

                        ))}
                    </div>
                    <div className="flex items-center gap-3 bg-muted p-2 rounded-2xl border border-border shadow-inner group focus-within:ring-2 ring-primary/20 transition-all">

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a clinical query..."
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent text-[13px] font-bold placeholder:text-muted-foreground/30 h-10 px-3"
                        />

                        <Button 
                            onClick={() => handleSend()} 
                            disabled={!input.trim()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 h-10 w-10 rounded-xl shrink-0 shadow-lg active:scale-95 transition-all outline-none border-none"
                        >
                            <Send className="h-4 w-4" />
                        </Button>

                    </div>
                    <p className="text-[9px] font-black text-center text-muted-foreground uppercase tracking-widest mt-4 opacity-50">
                        HIPAA Compliant Session &bull; Clinical OS V2.0
                    </p>

                </div>
            </Card>
        </div>
    );
};

export const AuditLogsView = ({ logs }: { logs: any[] }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">System Audit Logs</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Full compliance & traceability logs for clinical operations</p>
            </div>
        </div>


        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-card overflow-hidden ring-1 ring-border">
            <div className="divide-y divide-border">

                {logs.map((log) => (
                    <div key={log.id} className="p-6 hover:bg-muted/50 transition-colors flex items-center justify-between group border-border">
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                <ChevronDown className="h-6 w-6 -rotate-90" />
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-foreground">{log.action}</h4>
                                    <Badge variant="outline" className="rounded-lg text-[8px] font-black uppercase tracking-widest px-2 border-border text-muted-foreground"> {log.category}</Badge>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">Performed by <span className="font-black text-foreground">{log.user}</span></p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs font-black text-foreground tabular-nums">{log.timestamp || new Date(log.created_at).toLocaleString()}</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">ID: {log.id}</p>
                        </div>

                    </div>
                ))}
            </div>
        </Card>
    </div>
);
