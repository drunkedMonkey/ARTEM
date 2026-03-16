import { Sidebar } from '@/components/layout/Sidebar';
import { FolderOpen, FileText, Calculator, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const stats = [
  { name: 'Expedientes Activos', value: '24', icon: FolderOpen, color: 'text-violet-400', bg: 'bg-violet-600/20' },
  { name: 'Presupuestos Pendientes', value: '12', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-600/20' },
  { name: 'Baremos Disponibles', value: '48', icon: Calculator, color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  { name: 'Siniestros Este Mes', value: '156', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-600/20' },
];

const recentExpedients = [
  { id: 'SIN-2026-001', company: 'Mapfre', status: 'En progreso', date: '15/03/2026' },
  { id: 'SIN-2026-002', company: 'AXA', status: 'Pendiente', date: '14/03/2026' },
  { id: 'SIN-2026-003', company: 'Santander', status: 'Completado', date: '13/03/2026' },
  { id: 'SIN-2026-004', company: 'Allianz', status: 'En progreso', date: '12/03/2026' },
];

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Resumen de tu actividad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Expedientes Recientes</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {recentExpedients.map((exp) => (
              <div key={exp.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{exp.id}</p>
                    <p className="text-sm text-slate-400">{exp.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    exp.status === 'Completado' 
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : exp.status === 'En progreso'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-amber-600/20 text-amber-400'
                  }`}>
                    {exp.status === 'Completado' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {exp.status}
                  </span>
                  <span className="text-sm text-slate-500">{exp.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
