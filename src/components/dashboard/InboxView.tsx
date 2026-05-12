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

            {/* Split Pane Area */}
            <div className="flex-1 flex min-w-0 bg-white">
                
                {/* Thread List Pane */}
                <div className={cn(
                    "flex flex-col border-r border-border bg-white transition-all",
                    selectedThreadId ? "hidden lg:flex lg:w-96 shrink-0" : "flex-1"
                )}>
                    {/* List Header */}
                    <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input 
                                placeholder="Search messages..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9 rounded-lg bg-slate-100 border-none text-xs font-bold w-full" 
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 text-slate-400">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Thread List Rows */}
                    <ScrollArea className="flex-1">
                        <div className="divide-y divide-slate-100">
                            {filteredThreads.map((thread) => (
                                <div
                                    key={thread.id}
                                    onClick={() => { setSelectedThreadId(thread.id); fetchMessages(thread.id); }}
                                    className={cn(
                                        "flex flex-col gap-2 px-5 py-4 cursor-pointer group transition-all border-l-4",
                                        selectedThreadId === thread.id ? "bg-primary/5 border-primary" : "border-transparent hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className={cn(
                                            "text-sm tracking-tight truncate",
                                            thread.status === 'OPEN' ? "font-black text-slate-900" : "font-bold text-slate-600"
                                        )}>
                                            {thread.patientName}
                                        </p>
                                        <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase tracking-widest shrink-0">
                                            {thread.lastMessageTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {thread.riskLevel === 'RED' && <Badge className="bg-red-50 text-red-600 border-none text-[8px] font-black uppercase tracking-widest px-1.5 py-0">Urgent</Badge>}
                                        <p className="text-xs text-slate-500 truncate font-medium flex-1">
                                            {thread.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {filteredThreads.length === 0 && (
                                <div className="p-10 text-center">
                                    <InboxIcon className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No threads found</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Message Detail Pane */}
                <div className={cn(
                    "flex-1 flex-col min-w-0 bg-white",
                    !selectedThreadId ? "hidden lg:flex items-center justify-center bg-slate-50/30" : "flex"
                )}>
                    {!selectedThreadId ? (
                        <div className="text-center opacity-50">
                            <InboxIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-slate-900">Select an item to read</h3>
                            <p className="text-sm font-bold text-slate-500 mt-1">Nothing is selected</p>
                        </div>
                    ) : (
                        <>
                            {/* Detail Header */}
                            <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 rounded-xl lg:hidden mr-2"
                                        onClick={() => setSelectedThreadId(null)}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex flex-col">
                                        <h3 className="font-black text-slate-900 leading-none">{selectedThread?.patientName || 'Patient Case'}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">{selectedThread?.riskLevel || 'NORMAL'} Priority</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-amber-500"><Star className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-primary"><Archive className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                    <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hidden sm:flex"><MoreVertical className="h-4 w-4" /></Button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 bg-slate-50/50">
                                <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                                    {currentMessages.map((msg, i) => (
                                        <div key={msg.id} className="group border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-200/40 transition-all bg-white relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-white text-sm font-black shadow-md">
                                                        {msg.senderName?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{msg.senderName}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{msg.senderType}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.timestamp}</p>
                                            </div>
                                            <div className="pl-14">
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} className="h-4" />
                                </div>
                            </ScrollArea>

                            {/* Reply Area */}
                            <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
                                <div className="max-w-4xl mx-auto rounded-3xl bg-slate-50 border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <div className="px-5 py-3">
                                        <textarea
                                            placeholder="Type your reply to the patient..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400 min-h-[80px] resize-none outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-1.5">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200" onClick={() => fileInputRef.current?.click()}>
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                            <input type="file" className="hidden" ref={fileInputRef} />
                                        </div>
                                        <Button
                                            onClick={handleSend}
                                            disabled={isSending || !replyText.trim()}
                                            className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2"
                                        >
                                            {isSending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
