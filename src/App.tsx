import React, { useState, useEffect } from 'react';
// Force re-analysis after fixing imports
import {
  Bell,
  Search,
  User,
  LogOut,
  Stethoscope,
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  ShieldCheck,
  ClipboardList,
  Activity,
  Menu,
  X,
  Bot,
  RefreshCw,
  Clock,
  UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';
import { Badge } from './components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

import { Role, Thread, Patient, Appointment, Lead } from './types';
import { useClinicalData } from './hooks/useClinicalData';
import { useAuth } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Navbar } from './components/sections/Navbar';
import { Footer } from './components/sections/Footer';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { SelectRole } from './pages/onboarding/SelectRole';

// --- Modularized Views ---
import { DashboardView } from './components/dashboard/DashboardView';
import { InboxView } from './components/dashboard/InboxView';
import { PatientsView, PatientDetailView } from './components/dashboard/PatientsView';
import { LeadsView } from './components/dashboard/LeadsView';
import { ConsultationsView } from './components/dashboard/ConsultationsView';
import { RiskMonitorView } from './components/dashboard/RiskMonitorView';
import { ClinicalAssistant, AuditLogsView } from './components/dashboard/ClinicalAssistant';
import { AppointmentsView } from './components/dashboard/AppointmentsView';
import { SettingsView } from './components/dashboard/SettingsView';
import { ProfileView } from './components/dashboard/ProfileView';



// --- Shared Components ---

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed
}: {
  icon: any,
  label: string,
  active: boolean,
  onClick: () => void,
  collapsed: boolean
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-3.5 py-2.5 my-0.5 rounded-xl transition-all duration-300 group relative",
      active
        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-all duration-300", active ? "scale-105" : "group-hover:scale-105")} />
    {!collapsed && (
      <span className={cn(
        "ml-3 font-bold text-[13px] tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300",
        active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
      )}>
        {label}
      </span>
    )}
    {!collapsed && active && (
      <motion.div
        layoutId="active-indicator"
        className="ml-auto w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
      />
    )}
  </button>
);

// --- Main Application ---

export default function App() {
  const {
    patients, threads, messages, fetchMessages, sendMessage,
    appointments, leads, consultations, auditLogs,
    loading, refreshConsultations, convertLeadToPatient
  } = useClinicalData();

  const { user, profile, isLoading: authLoading, signOut } = useAuth();

  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<Role>('DOCTOR');
  const [patientSearch, setPatientSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // --- Derived Search Results ---
  const searchResults = React.useMemo(() => {
    if (!globalSearch.trim()) return [];
    const query = globalSearch.toLowerCase();
    
    const matchedPatients = patients
      .filter(p => p.name?.toLowerCase().includes(query) || p.phone?.includes(query))
      .map(p => ({ ...p, type: 'Patient', icon: Users, tab: 'Patients' }));
      
    const matchedLeads = leads
      .filter(l => l.name?.toLowerCase().includes(query) || l.phone?.includes(query))
      .map(l => ({ ...l, type: 'Lead', icon: UserPlus, tab: 'Leads CRM' }));
      
    const matchedAppointments = appointments
      .filter(a => a.patientName?.toLowerCase().includes(query))
      .map(a => ({ ...a, type: 'Appointment', icon: Calendar, tab: 'Appointments', name: a.patientName }));


    return [...matchedPatients, ...matchedLeads, ...matchedAppointments].slice(0, 8);
  }, [globalSearch, patients, leads, appointments]);

  const handleSearchResultClick = (result: any) => {
    setGlobalSearch('');
    setActiveTab(result.tab);
    if (result.type === 'Patient') {
      setSelectedPatient(result);
    }
  };


  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Critical SLA Breach', desc: 'Patient Anya (RED) awaiting response for 22 mins.', time: '2m ago', level: 'RED', isRead: false },
    { id: '2', title: 'New Appointment', desc: 'Siddharth booked for 4:00 PM today.', time: '15m ago', level: 'BLUE', isRead: false },
    { id: '3', title: 'Vital Sign Alert', desc: 'Abhilasha (YELLOW) logged high BP trend.', time: '1h ago', level: 'YELLOW', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Sync role from profile
  useEffect(() => {
    if (profile?.role) {
      console.log("App: Setting role to", profile.role.toLowerCase());
      setRole(profile.role.toUpperCase() as Role);
    }
  }, [profile]);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, roles: ['CRO', 'DOCTOR', 'NURSE'] },
    { name: 'Inbox', icon: MessageSquare, roles: ['CRO', 'DOCTOR', 'NURSE'] },
    { name: 'Patients', icon: Users, roles: ['CRO', 'DOCTOR', 'NURSE'] },
    { name: 'Leads CRM', icon: UserPlus, roles: ['CRO'] },
    { name: 'Risk Monitor', icon: ShieldCheck, roles: ['CRO', 'DOCTOR'] },
    { name: 'Appointments', icon: Calendar, roles: ['CRO', 'DOCTOR', 'NURSE'] },
    { name: 'Consultations', icon: Stethoscope, roles: ['CRO', 'DOCTOR'] },
    { name: 'Audit Logs', icon: ClipboardList, roles: ['CRO'] },
    { name: 'Settings', icon: Settings, roles: ['CRO', 'DOCTOR', 'NURSE'] },
  ].filter(item => item.roles.includes(role));



  // --- UI Preferences Engine ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('dfo-theme') || 'light';
    const savedDensity = localStorage.getItem('dfo-density') || 'cozy';
    const savedAccent = localStorage.getItem('dfo-accent') || 'blue';
    const savedSidebar = localStorage.getItem('dfo-sidebar') || 'full';
    
    // Theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Density & Sidebar
    document.documentElement.setAttribute('data-density', savedDensity);
    document.documentElement.setAttribute('data-sidebar', savedSidebar);
    if (savedSidebar === 'slim') setCollapsed(true);

    // Accent
    const accentMap: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      red: '#f43f5e',
      indigo: '#4f46e5'
    };
    if (savedAccent && accentMap[savedAccent]) {
      document.documentElement.style.setProperty('--primary', accentMap[savedAccent]);
    }
  }, []);


  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardView
            patients={patients}
            threads={threads}
            leads={leads}
            appointments={appointments}
            consultations={consultations}
            role={role}
            profile={profile}
          />
        );
      case 'Inbox':
        return (
          <InboxView
            threads={threads}
            messages={messages}
            fetchMessages={fetchMessages}
            sendMessage={sendMessage}
          />
        );
      case 'Patients':
        if (selectedPatient) {
          return (
            <PatientDetailView
              patient={selectedPatient}
              onBack={() => setSelectedPatient(null)}
              onSchedule={() => setActiveTab('Appointments')}
            />
          );
        }
        return (
          <PatientsView
            patients={patients}
            searchTerm={patientSearch}
            setSearchTerm={setPatientSearch}
            onSelectPatient={setSelectedPatient}
          />
        );
      case 'Leads CRM':
        return <LeadsView leads={leads} onConvert={convertLeadToPatient} />;
      case 'Appointments':
        return <AppointmentsView appointments={appointments} />;
      case 'Consultations':
        return <ConsultationsView consultations={consultations} refreshConsultations={refreshConsultations} patient={null} />;
      case 'Risk Monitor':
        return <RiskMonitorView patients={patients} leads={leads} appointments={appointments} threads={threads} role={role} />;
      case 'Audit Logs':
        return <AuditLogsView logs={auditLogs} />;
      case 'Settings':
        return <SettingsView />;
      case 'Profile':
        console.log("Rendering ProfileView with profile:", !!profile);
        if (!user) return <div className="p-20 text-center font-bold">Authentication error. Please re-login.</div>;
        return <ProfileView profile={profile} user={user} role={role} onSignOut={signOut} />;



      default:
        return (

          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <div className="p-8 rounded-full bg-accent mb-4">
              <Settings className="h-12 w-12 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{activeTab} View</h2>
            <p className="mt-2 text-sm text-muted-foreground">This module is currently being optimized for clinical workflows.</p>
            <Button variant="outline" className="mt-6" onClick={() => setActiveTab('Dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user && authView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans selection:bg-sky-200 overflow-x-hidden">
        <Navbar 
          onLogin={() => setAuthView('login')} 
          onSignup={() => setAuthView('signup')} 
        />
        <Landing 
          onLogin={() => setAuthView('login')} 
          onSignup={() => setAuthView('signup')} 
        />
        <Footer />
      </div>
    );
  }

  if (!user && authView === 'login') {
    return <Login onSwitchToSignup={() => setAuthView('signup')} onBackToLanding={() => setAuthView('landing')} />;
  }

  if (!user && authView === 'signup') {
    return <Signup onSwitchToLogin={() => setAuthView('login')} onBackToLanding={() => setAuthView('landing')} />;
  }

  if (user && !profile?.role) {
    return <SelectRole onRoleAssigned={() => refreshConsultations()} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans antialiased">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        className="relative z-20 flex flex-col border-r bg-white transition-all duration-500 ease-in-out"
      >
        <div className="flex h-20 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shadow-slate-950/10">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="font-black text-xl tracking-tighter text-slate-900 leading-none">
                  DFO | <span className="text-sky-500">Janmasethu</span>
                </span>
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 truncate max-w-[120px]">
                  {profile?.domain || 'Clinical OS v2.0'}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                icon={item.icon}
                label={item.name}
                active={activeTab === item.name}
                onClick={() => setActiveTab(item.name)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-10 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 text-slate-400 hover:text-slate-900 shadow-sm"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-18 bg-white flex items-center justify-between px-8 z-10 border-b border-slate-100">
          <div className="flex items-center gap-4 flex-1 max-w-xl relative">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <Input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search clinical records..."
                className="pl-10 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-sky-500/10 focus-visible:border-sky-500/20 h-11 rounded-xl font-medium text-slate-900 transition-all"
              />
            </div>
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {globalSearch.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                >
                  <div className="p-2 max-h-[400px] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((result: any, i) => (
                        <div
                          key={`${result.type}-${result.id}-${i}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary">
                              <result.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-none">{result.name}</p>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">{result.type}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest rounded-md px-1.5 opacity-50 group-hover:opacity-100">{result.tab}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm font-bold text-slate-400">No clinical matches found</p>
                      </div>
                    )}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{searchResults.length} Records found</span>
                       <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Global Scan Complete</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          <div className="flex items-center gap-4">
            
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-xl bg-white border border-slate-100 hover:border-slate-300 flex items-center justify-center outline-none transition-all group">
                <Bell className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-lg shadow-red-500/20">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden shadow-2xl border-primary/10">
                <div className="bg-primary p-4 text-primary-foreground flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-sm">Notifications</h4>
                    <p className="text-[10px] opacity-70 uppercase font-black tracking-widest mt-1">{unreadCount} New Alerts</p>
                  </div>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                    className="text-[10px] uppercase font-black hover:underline underline-offset-4"
                  >
                    Mark all read
                  </button>
                </div>
                <ScrollArea className="h-80">
                  <div className="divide-y divide-border/50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif))}
                        className={cn(
                          "p-4 hover:bg-accent transition-colors cursor-pointer group relative",
                          !n.isRead && "bg-primary/5 hover:bg-primary/10"
                        )}
                      >
                        {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                        <div className="flex gap-3">
                          <div className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0",
                            n.level === 'RED' ? 'bg-red-500 animate-pulse' :
                              n.level === 'YELLOW' ? 'bg-amber-500' :
                                n.level === 'GREEN' ? 'bg-emerald-500' : 'bg-blue-500'
                          )} />
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <p className={cn("text-xs font-bold leading-none transition-colors",
                                !n.isRead ? "text-foreground" : "text-muted-foreground"
                              )}>{n.title}</p>
                              {!n.isRead && <Badge className="text-[7px] h-3 px-1 uppercase bg-primary text-white border-none">New</Badge>}
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{n.desc}</p>
                            <p className="text-[9px] font-medium text-muted-foreground/60 uppercase">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 pl-1.5 pr-3 h-11 rounded-xl bg-white border border-slate-100 hover:border-slate-300 transition-all outline-none group">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 shadow-lg text-white font-black text-[10px] uppercase tracking-tighter group-hover:scale-105 transition-transform">
                  {profile?.full_name ? profile.full_name.charAt(0) : (user?.email?.charAt(0) || 'U')}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">{profile?.full_name || user?.email?.split('@')[0] || 'Clinical Member'}</p>
                  <p className="text-[8px] font-black text-sky-500 uppercase tracking-widest mt-1.5 leading-none">{role}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl border-slate-100">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5">My Account Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="rounded-lg py-2.5 cursor-pointer" 
                    onSelect={() => setActiveTab('Profile')}
                    onClick={(e) => { e.preventDefault(); setActiveTab('Profile'); }}
                  >
                    <User className="mr-3 h-4 w-4 text-slate-500" /> 
                    <span className="font-bold text-sm">Clinical Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-lg py-2.5 cursor-pointer" 
                    onSelect={() => setActiveTab('Settings')}
                    onClick={(e) => { e.preventDefault(); setActiveTab('Settings'); }}
                  >
                    <Settings className="mr-3 h-4 w-4 text-slate-500" /> 
                    <span className="font-bold text-sm">OS Settings</span>
                  </DropdownMenuItem>



                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => signOut()} 
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                  className="text-red-600 rounded-lg py-2.5 cursor-pointer hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" /> 
                  <span className="font-bold text-sm">Terminate Session</span>
                </DropdownMenuItem>


              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-muted-foreground animate-pulse">Syncing with Clinical Cloud...</p>
                  </div>
                </div>
              ) : renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
