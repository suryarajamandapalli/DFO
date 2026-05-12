import React from 'react';
import { 
    Mail, 
    Building2,
    ShieldCheck,
    LogOut,
    User,
    Globe,
    Lock
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface ProfileViewProps {
    profile: any;
    user: any;
    role: string;
    onSignOut: () => Promise<void>;
}

export const ProfileView = ({ profile, user, role, onSignOut }: ProfileViewProps) => {
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <Lock className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <h2 className="text-xl font-black uppercase tracking-widest text-foreground">Session Inactive</h2>
                <p className="text-sm text-muted-foreground mt-2">Please re-authenticate to view clinical credentials.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Professional Profile</h2>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-sky-500" /> Verified Clinical Practitioner
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-10 px-6 rounded-xl border-border bg-card font-black uppercase text-[10px] tracking-widest">
                        ID: {user.id?.slice(0, 8).toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Identity Card */}
                <Card className="lg:col-span-1 border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden ring-1 ring-border">
                    <CardContent className="p-10 flex flex-col items-center text-center">
                        <div className="relative mb-8">
                            <div className="h-32 w-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl ring-8 ring-background">
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-sky-500 border-4 border-background flex items-center justify-center text-white shadow-lg">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-foreground tracking-tight">
                            {profile?.full_name || 'Clinical Professional'}
                        </h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2 bg-primary/10 px-4 py-1 rounded-full">
                            {role || 'Clinical Staff'}
                        </p>

                        <div className="mt-10 pt-10 border-t border-border w-full space-y-5 text-left">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold text-foreground">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Clinical Domain</p>
                                    <p className="text-sm font-bold text-foreground uppercase">{profile?.domain || 'DFO CLINIC MAIN'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Security & Actions */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <ShieldCheck className="h-64 w-64" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <Lock className="h-6 w-6 text-sky-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-widest italic">Security Vault</h4>
                                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mt-1">Encrypted Session Data</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Last Authentication</p>
                                    <p className="text-sm font-bold">{new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Auth Provider</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-sm font-bold">Supabase Secure Cloud</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <Button 
                                    className="flex-1 h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-xs tracking-[0.2em] shadow-xl"
                                    onClick={() => alert('Profile editing is currently restricted to administrators.')}
                                >
                                    <User className="h-4 w-4 mr-3" /> Edit Credentials
                                </Button>
                                <Button 
                                    onClick={onSignOut}
                                    variant="outline" 
                                    className="flex-1 h-14 rounded-2xl border-white/20 text-white hover:bg-red-500 hover:border-red-500 font-black uppercase text-xs tracking-[0.2em] transition-all"
                                >
                                    <LogOut className="h-4 w-4 mr-3" /> Terminate Session
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Access Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border flex items-center gap-5 group hover:border-primary/20 transition-all">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Deployment Zone</p>
                                <p className="text-sm font-bold">Asia-South-1 (Mumbai)</p>
                            </div>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border flex items-center gap-5 group hover:border-primary/20 transition-all">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Access Level</p>
                                <p className="text-sm font-bold uppercase">{role || 'Standard'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
