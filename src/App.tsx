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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl relative bg-muted/50 border border-border">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background animate-bounce" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[400px] rounded-[2rem] p-0 border border-border shadow-2xl overflow-hidden mt-2">
                <div className="p-6 bg-card border-b flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">{unreadCount} New Alerts</p>
                  </div>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                    className="text-[10px] uppercase font-black hover:underline underline-offset-4 text-primary"
                  >
                    Mark all read
                  </button>
                </div>
                <ScrollArea className="h-80">
                  <div className="divide-y divide-border/50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-5 hover:bg-muted/50 transition-colors flex gap-4 items-start",
                          !n.isRead && "bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                          n.type === 'EMERGENCY' ? "bg-red-50 text-red-600" : "bg-sky-50 text-sky-600"
                        )}>
                          {n.type === 'EMERGENCY' ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">{n.level}</p>
                          <p className="text-sm font-bold text-foreground leading-tight">{n.title}</p>
                          <p className="text-[11px] font-medium text-muted-foreground leading-snug">{n.desc}</p>
                          <p className="text-[10px] font-bold text-muted-foreground pt-1">{n.time}</p>
                        </div>
                        {!n.isRead && <div className="ml-auto w-2 h-2 rounded-full bg-primary mt-1" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 bg-muted/50 text-center">
                  <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">View All Activities</button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 flex items-center gap-3 px-3 hover:bg-muted rounded-xl transition-all border border-border bg-card shadow-sm">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-inner">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block text-left mr-1">
                    <p className="text-[11px] font-black text-foreground tracking-tight leading-none truncate max-w-[100px]">
                      {profile?.full_name || 'Clinic Admin'}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                      {profile?.role || 'Staff'}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border border-border shadow-2xl mt-2">
                <DropdownMenuLabel className="p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest leading-none">Identified As</p>
                    <p className="text-sm font-bold text-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => {
                      setActiveTab('Profile');
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-xl h-11 px-4 font-bold text-slate-600 focus:bg-primary focus:text-primary-foreground gap-3 cursor-pointer"
                  >
                    <User className="h-4 w-4" /> 
                    <span className="text-sm">Professional Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setActiveTab('Settings');
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-xl h-11 px-4 font-bold text-slate-600 focus:bg-primary focus:text-primary-foreground gap-3 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" /> 
                    <span className="text-sm">OS Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-red-600 rounded-lg py-2.5 cursor-pointer hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" /> 
                  <span className="font-bold text-sm">Terminate Session</span>
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
