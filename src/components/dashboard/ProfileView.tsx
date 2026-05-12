import React from 'react';
import { 
    Mail, 
    Building2,
    ShieldCheck,
    LogOut,
    User
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileViewProps {
    profile: any;
    user: any;
    role: string;
    onSignOut: () => Promise<void>;
}

export const ProfileView = ({ profile, user, role, onSignOut }: ProfileViewProps) => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase font-sans tracking-tight">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-foreground tracking-tight">Clinical Identity</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Verified clinician profile and session management</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Identity Card */}
                <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden p-10 ring-1 ring-border">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-28 w-28 rounded-[2.5rem] bg-slate-900 shadow-2xl mb-6 flex items-center justify-center overflow-hidden border-4 border-muted">

                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-white italic">
                                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-foreground leading-none truncate w-full">
                            {profile?.full_name || user?.user_metadata?.full_name || 'Clinical Professional'}
                        </h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-3">

                            {role || 'Staff'}
                        </p>

                        
                        <div className="mt-8 pt-8 border-t border-border w-full space-y-4 text-left">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                                <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground">
                                    <Mail className="h-5 w-5" />

                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Login Email</p>
                                    <p className="font-bold text-foreground text-sm truncate">{user?.email}</p>
                                </div>

                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                                <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground">
                                    <Building2 className="h-5 w-5" />

                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                                        {profile?.role === 'cro' ? 'Assigned Organization' : 'Assigned Department'}
                                    </p>
                                    <p className="font-bold text-foreground text-sm uppercase tracking-tight">
                                        {profile?.domain || 'DFO CLINIC MAIN'}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </Card>

                {/* Account Actions */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl rounded-[2.5rem] p-8 bg-slate-900 text-white flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Account Security</h4>
                            </div>
                            <p className="text-sm font-medium opacity-60 leading-relaxed">
                                Your clinical identity is secured by Supabase Enterprise Auth.
                                Session stability is maintained across global nodes.
                            </p>
                        </div>

                        <div className="mt-10 space-y-3">
                            <Button className="w-full rounded-2xl h-14 font-black uppercase text-[11px] tracking-widest gap-2 bg-white text-slate-900 hover:bg-slate-100 shadow-xl border-none">
                                <User className="h-4 w-4" /> Edit Profile
                            </Button>
                            <Button 
                                onClick={async () => {
                                    try {
                                        await onSignOut();
                                    } catch (err) {
                                        console.error("Sign out failed", err);
                                    }
                                }}
                                variant="outline" 
                                className="w-full rounded-2xl h-14 font-black uppercase text-[11px] tracking-widest gap-2 border-red-500/30 bg-transparent text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                                <LogOut className="h-4 w-4" /> Sign Out
                            </Button>

                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
