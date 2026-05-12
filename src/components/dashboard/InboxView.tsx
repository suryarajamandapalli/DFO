import React, { useState, useEffect, useRef } from 'react';
import {
    Inbox as InboxIcon,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    Send,
    Plus,
    RefreshCw,
    ArrowLeft,
    Star,
    Archive,
    Trash2,
    Mail,
    ChevronLeft,
    ChevronRight,
    Paperclip,
    AlertCircle,
    User,
    Tag,
    Square,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Thread, Message } from '../../types';
import { cn } from '../../lib/utils';

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
    const [activeFolder, setActiveFolder] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedThreadId) {
            scrollToBottom();
        }
    }, [messages, selectedThreadId]);

    const selectedThread = threads.find(t => t.id === selectedThreadId);
    const currentMessages = selectedThreadId ? messages[selectedThreadId] || [] : [];

    if (selectedThreadId && !selectedThread) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-20 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold">Thread Not Found</h3>
                <p className="text-muted-foreground mt-2">The selected conversation could not be retrieved.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSelectedThreadId(null)}>
                    Back to Inbox
                </Button>
            </div>
        );
    }

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

    const folders = [
        { id: 'inbox', label: 'Inbox', icon: InboxIcon, count: threads.length },
        { id: 'starred', label: 'Starred', icon: Star, count: 0 },
        { id: 'sent', label: 'Sent', icon: Send, count: 0 },
        { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
        { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
    ];

    const filteredThreads = threads.filter(t => 
        t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-white rounded-[2rem] border border-border shadow-2xl mx-4 my-2">
            {/* Folder Sidebar (Gmail Style) */}
            <div className="w-64 border-r border-border bg-slate-50/50 hidden lg:flex flex-col p-4">
                <Button className="w-full h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm font-black uppercase text-xs tracking-widest mb-6 gap-3">
                    <Plus className="h-4 w-4" /> Compose
                </Button>

                <div className="space-y-1">
                    {folders.map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => setActiveFolder(folder.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                activeFolder === folder.id 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                    : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <folder.icon className={cn("h-4 w-4", activeFolder === folder.id ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                                <span className="text-sm font-bold tracking-tight">{folder.label}</span>
                            </div>
                            {folder.count > 0 && (
                                <span className={cn(
                                    "text-[10px] font-black px-2 py-0.5 rounded-full",
                                    activeFolder === folder.id ? "bg-white/20" : "bg-slate-200 text-slate-600"
                                )}>
                                    {folder.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-10">
                    <h5 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Labels</h5>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            <Tag className="h-3 w-3 text-red-500" /> Critical Case
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            <Tag className="h-3 w-3 text-emerald-500" /> New Patient
                        </button>
                    </div>
                </div>
            </div>

            {/* List & Detail Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {!selectedThreadId ? (
                    <>
                        {/* List Header */}
                        <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <Square className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="flex-1 max-w-md px-10">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input 
                                        placeholder="Search messages..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9 rounded-lg bg-slate-100 border-none text-xs font-bold" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">1-50 of {threads.length}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Thread List (Gmail Style Rows) */}
                        <ScrollArea className="flex-1">
                            <div className="divide-y divide-slate-100">
                                {filteredThreads.map((thread) => (
                                    <div
                                        key={thread.id}
                                        onClick={() => { setSelectedThreadId(thread.id); fetchMessages(thread.id); }}
                                        className={cn(
                                            "flex items-center gap-4 px-6 py-3 cursor-pointer group transition-all",
                                            thread.status === 'LOCKED' ? "bg-slate-50" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Square className="h-4 w-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                            <Star className="h-4 w-4 text-slate-200 hover:text-amber-400 transition-colors" />
                                        </div>

                                        <div className="w-48 shrink-0">
                                            <p className={cn(
                                                "text-sm tracking-tight truncate",
                                                thread.status === 'OPEN' ? "font-black text-slate-900" : "font-bold text-slate-600"
                                            )}>
                                                {thread.patientName}
                                            </p>
                                        </div>

                                        <div className="flex-1 min-w-0 flex items-center gap-3">
                                            {thread.riskLevel === 'RED' && <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] font-black uppercase tracking-widest">Urgent</Badge>}
                                            <p className="text-sm text-slate-500 truncate font-medium">
                                                <span className="text-slate-900 font-bold mr-2">{thread.patientName} Case</span>
                                                {thread.lastMessage}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            {thread.isAiSuppressed && <Paperclip className="h-3.5 w-3.5 text-slate-300" />}
                                            <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase tracking-widest">
                                                {thread.lastMessageTime}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {filteredThreads.length === 0 && (
                                    <div className="p-20 text-center">
                                        <InboxIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching threads found</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <>
                        {/* Detail Header (Gmail Style Actions) */}
                        <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-xl"
                                    onClick={() => setSelectedThreadId(null)}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Separator orientation="vertical" className="h-6 mx-2" />
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900"><Archive className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900"><AlertCircle className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900"><Trash2 className="h-4 w-4" /></Button>
                                <Separator orientation="vertical" className="h-6 mx-2" />
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900"><Mail className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900"><RefreshCw className="h-4 w-4" /></Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">1 of 1</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Message View (Gmail Conversation Style) */}
                        <ScrollArea className="flex-1 bg-white">
                            <div className="p-8 max-w-5xl mx-auto space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-slate-950 tracking-tighter">Clinical Inquiry: {selectedThread?.patientName || 'Unknown Patient'}</h2>
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">Inbox</Badge>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase tracking-widest px-3 py-1",
                                            selectedThread?.riskLevel === 'RED' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                        )}>
                                            {selectedThread?.riskLevel || 'NORMAL'} Case
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {currentMessages.map((msg, i) => (
                                        <div key={msg.id} className="group border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all bg-white relative">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white text-lg font-black shadow-lg">
                                                        {msg.senderName?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{msg.senderName} <span className="text-slate-400 font-bold ml-2"> &lt;{msg.senderType.toLowerCase()}@janmasethu.com&gt;</span></p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">to Clinical Care System</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.timestamp}</p>
                                                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Star className="h-4 w-4 text-slate-300 cursor-pointer hover:text-amber-400" />
                                                        <RefreshCw className="h-4 w-4 text-slate-300 cursor-pointer hover:text-primary" />
                                                        <MoreVertical className="h-4 w-4 text-slate-300 cursor-pointer" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pl-16">
                                                <p className="text-base text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </ScrollArea>

                        {/* Reply Area (Gmail Style Quick Reply) */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                            <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-white border border-slate-200 p-2 shadow-2xl focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                                <div className="px-6 py-4">
                                    <textarea
                                        placeholder="Click here to reply to the patient..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 min-h-[100px] resize-none"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-2 border-t border-slate-50">
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400"><Plus className="h-5 w-5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400" onClick={() => fileInputRef.current?.click()}>
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                        <input type="file" className="hidden" ref={fileInputRef} />
                                    </div>
                                    <Button
                                        onClick={handleSend}
                                        disabled={isSending || !replyText.trim()}
                                        className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 gap-3"
                                    >
                                        {isSending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
