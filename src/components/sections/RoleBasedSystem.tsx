import { Users, Stethoscope, BriefcaseMedical } from 'lucide-react';
import { Card } from '../ui/Card';

export function RoleBasedSystem() {
  return (
    <section id="roles" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Role-Based Access Control (RBAC)</h2>
          <p className="text-slate-600 text-lg">
            A structured workflow ensuring the right clinical staff handles the right cases at the right time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card delay={0.1} className="border-t-4 border-slate-700">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">CRO</h3>
            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              Customer Relationship Officer
            </p>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Full access to all general queries
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Monitors system health & SLA
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Assigns threads manually if needed
              </li>
            </ul>
          </Card>

          <Card delay={0.2} className="border-t-4 border-sky-400">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-6">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Nurse</h3>
            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              Clinical Support Staff
            </p>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                Handles Yellow (moderate) cases
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                Primary patient interaction layer
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                Can escalate to doctors
              </li>
            </ul>
          </Card>

          <Card delay={0.3} className="border-t-4 border-blue-600">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <BriefcaseMedical className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Doctor</h3>
            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              Lead Medical Professional
            </p>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Handles Red (critical) cases
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Makes critical medical decisions
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Can trigger Human Takeover (AI halt)
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
