import React from 'react';
import { 
    Mail, 
    Building2,
    ShieldCheck,
    LogOut,
    User
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ProfileViewProps {
    profile: any;
    user: any;
    role: string;
    onSignOut: () => Promise<void>;
}

export const ProfileView = ({ profile, user, role, onSignOut }: ProfileViewProps) => {
    // Debugging crash
    if (!user) return <div className="p-10 text-red-500 font-bold uppercase tracking-widest">No User Session Found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 p-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Clinical Identity</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter mt-1">Verified clinician profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-slate-900 mb-6 flex items-center justify-center text-white text-3xl font-black">
                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                        </div>
                        <h3 className="text-xl font-black text-foreground">
                            {profile?.full_name || 'Clinical Professional'}
                        </h3>
                        <p className="text-[10px] font-black text-primary uppercase mt-2">
                            {role || 'Staff'}
                        </p>
                        
                        <div className="mt-8 pt-8 border-t border-border w-full space-y-4 text-left">
                            <div className="flex items-center gap-4">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="font-bold text-sm">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-bold text-sm uppercase">{profile?.domain || 'DFO CLINIC MAIN'}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-8 bg-slate-900 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="h-5 w-5 text-sky-400" />
                            <h4 className="text-xs font-black uppercase tracking-widest">Security</h4>
                        </div>
                        <p className="text-xs opacity-60">Verified via Supabase Auth</p>
                        
                        <div className="mt-8 space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-[10px]"
                                onClick={() => alert('Edit profile coming soon')}
                            >
                                <User className="h-4 w-4 mr-2" /> Edit Profile
                            </Button>
                            <Button 
                                onClick={onSignOut}
                                variant="outline" 
                                className="w-full border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase text-[10px]"
                            >
                                <LogOut className="h-4 w-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
