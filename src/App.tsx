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
  ChevronDown,
  ChevronRight,
  AlertTriangle,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Critical Risk Alert', desc: 'Patient Alpha risk score exceeded 85%. Triage required.', type: 'EMERGENCY', level: 'Immediate', time: '2m ago', isRead: false },
    { id: '2', title: 'New Lab Results', desc: 'Bio-markers for Patient Beta are available for review.', type: 'SYSTEM', level: 'Moderate', time: '15m ago', isRead: true },
    { id: '3', title: 'SLA Warning', desc: 'Case #8902 is approaching response deadline.', type: 'EMERGENCY', level: 'High', time: '1h ago', isRead: false },
  ]);

  const [activePopover, setActivePopover] = useState<string | null>(null);

  // --- Theme & Persistence ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('dfo-theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const savedSidebar = localStorage.getItem('dfo-sidebar') || 'full';
    document.documentElement.setAttribute('data-sidebar', savedSidebar);
    setCollapsed(savedSidebar === 'slim');
  }, []);
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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-background" />
          </div>
          <span className="font-black text-sm tracking-tighter text-foreground">DFO | <span className="text-sky-500">Janmasethu</span></span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-xl">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 260,
          x: mobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 flex flex-col border-r bg-card transition-all duration-300",
          !mobileMenuOpen && "-translate-x-full lg:translate-x-0"
        )}
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
                <span className="font-black text-xl tracking-tighter text-foreground leading-none">
                  DFO | <span className="text-sky-500">Janmasethu</span>
                </span>
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 truncate max-w-[120px]">
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

        <div className="p-4 border-t bg-slate-50/50 space-y-2">
          <button
            onClick={() => signOut()}
            className={cn(
              "flex items-center gap-3 w-full h-10 rounded-xl px-4 font-bold text-red-600 hover:bg-red-50 transition-all group",
              collapsed && "justify-center px-0"
            )}
            title="Terminate Session"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>

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
        <header className="h-20 flex items-center justify-between px-10 border-b bg-card hidden lg:flex">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search clinical records, patients, threads..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-11 h-12 rounded-2xl bg-muted border-none text-sm font-bold ring-offset-background placeholder:text-muted-foreground/30 focus-visible:ring-primary/20"
            />
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {globalSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden z-50 p-2"
                >
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((result: any) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-muted transition-all text-left group"
                        >
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <result.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-foreground text-sm tracking-tight">{result.name || result.patientName || result.full_name}</p>
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">{result.type} • {result.tab}</p>
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No matching records found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm animate-pulse">
                <Activity className="h-4 w-4" />
              </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Notifications Popover */}
            <Popover open={activePopover === 'notifications'} onOpenChange={(open) => setActivePopover(open ? 'notifications' : null)}>
              <PopoverTrigger>
                <button className="relative h-12 w-12 rounded-2xl bg-muted hover:bg-muted/80 transition-all border border-border flex items-center justify-center group">
                  <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 ring-4 ring-background" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[420px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl ring-1 ring-border mt-4">
                <div className="bg-white">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Notifications</h3>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{unreadCount} NEW ALERTS</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                      className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div className="max-h-[450px] overflow-auto divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div key={n.id} className={cn(
                        "p-8 hover:bg-slate-50 transition-all flex items-start gap-6 group",
                        !n.isRead && "bg-slate-50/50"
                      )}>
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110",
                          n.level === 'Immediate' ? "bg-red-50 text-red-500" : "bg-sky-50 text-sky-500"
                        )}>
                          {n.level === 'Immediate' ? <AlertTriangle className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{n.level}</span>
                            {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mb-1">{n.title}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">{n.desc}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button className="w-full h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all">
                      View all activities
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-8 mx-2" />

            {/* User Dropdown */}
            <DropdownMenu open={activePopover === 'profile'} onOpenChange={(open) => setActivePopover(open ? 'profile' : null)}>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-muted transition-all border border-transparent hover:border-border group">
                  <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-black shadow-lg shadow-slate-950/20 group-hover:scale-105 transition-transform">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden xl:block pr-2">
                    <p className="text-sm font-black text-foreground leading-none">{profile?.full_name || 'System Administr...'}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 mt-4" align="right">
                <div className="p-4 border-b border-slate-50 mb-1 bg-slate-50/30">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Identified as</p>
                  <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user?.email}</p>
                </div>
                
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => { setActivePopover(null); setActiveTab('Profile'); }}
                    className="rounded-xl h-12 px-4 font-black text-slate-600 hover:bg-primary/5 hover:text-primary gap-3 cursor-pointer"
                  >
                    <User className="h-4 w-4" /> 
                    <span className="text-sm">Professional Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => { setActivePopover(null); setActiveTab('Settings'); }}
                    className="rounded-xl h-12 px-4 font-black text-slate-600 hover:bg-primary/5 hover:text-primary gap-3 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" /> 
                    <span className="text-sm">OS Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-red-600 rounded-xl h-12 px-4 font-black hover:bg-red-50 gap-3 cursor-pointer mt-1"
                >
                  <LogOut className="h-4 w-4" /> 
                  <span className="text-sm">Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-auto p-4 md:p-10"
            >
              {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
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
