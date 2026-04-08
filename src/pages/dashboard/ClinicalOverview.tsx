import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { ClinicalMetricCard } from '../../components/dashboard/ClinicalMetricCard';
import { PatientInflowChart, RiskDistributionChart } from '../../components/dashboard/OverviewCharts';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  Target,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { getDashboardMetrics, type DashboardMetrics } from '../../lib/dashboardService';
import { motion } from 'framer-motion';

export function ClinicalOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="dashboard">
        <div className="flex-1 flex items-center justify-center h-full">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
             className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"
           />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="dashboard">
      <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">Clinical Overview</h1>
            <p className="text-xs sm:text-sm font-bold text-slate-400/80 tracking-widest uppercase flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              Real-time Production Database Sync
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               size="sm" 
               className="bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest px-5 h-12 shadow-premium hover:bg-slate-50 transition-all rounded-2xl"
             >
               <Filter className="w-4 h-4 mr-2 text-sky-500" />
               Analytics Filter
             </Button>
             <Button 
               size="sm" 
               className="bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-widest px-7 h-12 shadow-bespoke hover:scale-[1.02] transition-transform rounded-2xl"
             >
               <Plus className="w-4 h-4 mr-2" />
               Register Patient
             </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          <ClinicalMetricCard 
            title="Total Patients"
            value={metrics?.totalPatients.toLocaleString() || '0'}
            subtitle="Actual production records"
            trend={{ value: "LIVE", isUp: true }}
            icon={Users}
            variant="blue"
            delay={0.1}
          />
          <ClinicalMetricCard 
            title="Critical Risk"
            value={metrics?.criticalRiskCount.toLocaleString() || '0'}
            subtitle="Active triage requirements"
            trend={{ value: "SYNC", isUp: false }}
            icon={ShieldAlert}
            variant="red"
            delay={0.2}
          />
          <ClinicalMetricCard 
            title="SLA Compliance"
            value={`${metrics?.slaComplianceRate}%` || '0%'}
            subtitle="Response rate success"
            trend={{ value: "REQ", isUp: true }}
            icon={Activity}
            variant="green"
            delay={0.3}
          />
          <ClinicalMetricCard 
            title="Growth Index"
            value={metrics?.growthIndex || '0'}
            subtitle="Operational index"
            trend={{ value: "KPI", isUp: true }}
            icon={Target}
            variant="orange"
            delay={0.4}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
           <div className="lg:col-span-2">
              <PatientInflowChart data={metrics?.patientInflow || []} />
           </div>
           <div className="flex flex-col">
              <RiskDistributionChart data={metrics?.riskDistribution || []} />
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
