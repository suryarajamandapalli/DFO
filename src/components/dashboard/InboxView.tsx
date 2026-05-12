import React, { useState } from 'react';
import {
    Inbox as InboxIcon,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    ShieldCheck,
    BotOff,
    Bot,
    Send,
    Plus,
    RefreshCw,
    MoreHorizontal,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Thread, Message } from '@/types';
import { cn } from '@/lib/utils';

export const InboxView = ({
    threads,
    messages,
    fetchMessages,
    sendMessage
}: {
    threads: Thread[],
    messages: Record<string, Message[]>,
    fetchMessages: (id: string) => void,
    sendMessage: (tid: string, sid: string, content: string) => void
}) => {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const selectedThread = threads.find(t => t.id === selectedThreadId);

    const handleSend = async () => {
        if (selectedThreadId && replyText.trim()) {
            setIsSending(true);
            try {
                await sendMessage(selectedThreadId, 'doctor-1', replyText);
                setReplyText('');
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" uploaded successfully (Simulation)`);
        }
    };

    const currentMessages = selectedThreadId ? messages[selectedThreadId] || [] : [];

    return (
        <div className="flex h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-background">
            {/* Sidebar: Message List */}
            <div className={cn(
                "w-full lg:w-96 border-r border-border bg-card flex flex-col transition-all duration-300",
                selectedThreadId ? "hidden lg:flex" : "flex"
            )}>

                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-foreground tracking-tight">Active Threads</h2>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border">

                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input placeholder="Filter conversations..." className="pl-9 h-10 rounded-xl bg-muted border-none text-xs font-bold" />
                    </div>

                </div>
                <ScrollArea className="flex-1">
                    <div className="divide-y divide-border">

                        {threads.map((thread) => (
                            <div
                                key={thread.id}
                                onClick={() => { setSelectedThreadId(thread.id); fetchMessages(thread.id); }}
                                className={cn(
                                    "p-5 cursor-pointer transition-all border-l-4",
                                    selectedThreadId === thread.id ? "bg-primary/10 border-primary" : "border-transparent hover:bg-muted"
                                )}

                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-foreground leading-tight">{thread.patientName}</h4>
                                    <span className="text-[10px] font-black text-muted-foreground tabular-nums">{thread.lastMessageTime}</span>
                                </div>

                                <p className="text-xs text-slate-500 line-clamp-1 font-medium mb-2">{thread.lastMessage}</p>
                                <div className="flex items-center gap-2">
                                    <Badge className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5",
                                        thread.riskLevel === 'RED' ? "bg-red-50 text-red-600 border-red-100" :
                                            thread.riskLevel === 'YELLOW' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    )}>
                                        {thread.riskLevel} Case
                                    </Badge>
                                    {thread.isAiSuppressed && <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black uppercase px-2 tracking-widest">Human Care</Badge>}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className={cn(
                "flex-1 flex flex-col bg-background transition-all duration-300",
                !selectedThreadId ? "hidden lg:flex" : "flex"
            )}>
                {selectedThread ? (
                    <>
                        <div className="h-20 px-8 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="lg:hidden h-10 w-10 rounded-xl mr-2"
                                    onClick={() => setSelectedThreadId(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground shadow-lg">
                                    {selectedThread.patientName.charAt(0)}
                                </div>

                                <div>
                                    <h3 className="font-black text-foreground">{selectedThread.patientName}</h3>
                                    <div className="flex items-center gap-2">

                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Consultation • Case ID: {selectedThread.id.slice(0, 8)}</p>
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => alert(`Thread ${selectedThread.id.slice(0,8)} resolved (Simulation)`)}
                                    className="rounded-xl font-black uppercase text-[10px] tracking-widest border-border text-primary hover:bg-primary/10"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Resolve Thread
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                            <MoreVertical className="h-5 w-5 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl font-bold text-xs">
                                        <DropdownMenuLabel>Thread Controls</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="rounded-lg">Assign to Specialist</DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">Escalate to Doctor</DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg text-red-600">Lock Conversation</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-8 bg-muted/20">

                            <div className="space-y-6 max-w-4xl mx-auto">
                                <div className="flex justify-center mb-8">
                                    <Badge variant="outline" className="bg-card backdrop-blur-sm px-4 py-1 rounded-full border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-2" /> Conversation started Oct 24, 2026
                                    </Badge>
                                </div>


                                {currentMessages.map((msg, i) => (
                                    <div key={msg.id} className={cn("flex flex-col", msg.senderType === 'USER' ? "items-start" : "items-end")}>
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            {msg.senderType === 'AI' && <Badge className="bg-sky-100 text-sky-600 border-none text-[8px] font-black uppercase tracking-tighter">AI Assistant</Badge>}
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                                            <span className="text-[9px] font-black text-slate-300 tabular-nums">{msg.timestamp}</span>
                                        </div>
                                        <div className={cn(
                                            "max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm ring-1 ring-border",
                                            msg.senderType === 'USER'
                                                ? "bg-card text-foreground rounded-tl-none tabular-nums"
                                                : "bg-primary text-primary-foreground rounded-tr-none"
                                        )}>

                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-6 bg-card border-t border-border">
                            <div className="max-w-4xl mx-auto flex items-center gap-4 bg-muted p-2 rounded-[2rem] border border-border ring-4 ring-muted/50">
                                <div className="flex items-center px-4 border-r border-border">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        onChange={handleFileUpload}
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-muted-foreground hover:text-primary rounded-xl"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>
                                <Input
                                    placeholder="Type a clinical response..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm font-bold placeholder:text-muted-foreground/30"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isSending || !replyText.trim()}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 rounded-2xl shrink-0 shadow-lg transition-all active:scale-95 flex items-center justify-center"
                                >
                                    {isSending ? (
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>


                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-muted/20">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-card shadow-xl flex items-center justify-center mb-6">
                            <InboxIcon className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Select a conversation</h3>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-xs">Pick a thread from the left to start clinical triage or patient support</p>
                    </div>
                )}

            </div>
        </div>
    );
};
