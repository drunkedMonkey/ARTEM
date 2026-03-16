import { Sidebar } from '@/components/layout/Sidebar';
import { Plus, Search, Filter, Upload, Camera, FileText, MoreVertical } from 'lucide-react';

const expeditions = [
  { 
    id: 'SIN-2026-001', 
    company: 'Mapfre', 
    status: 'En progreso',
    location: 'Calle Mayor 25, Madrid',
    date: '15/03/2026',
    hasPdf: true,
    hasPhotos: true,
    hasBudget: false
  },
  { 
    id: 'SIN-2026-002', 
    company: 'AXA', 
    status: 'Pendiente',
    location: 'Avenida Barcelona 12, Barcelona',
    date: '14/03/2026',
    hasPdf: true,
    hasPhotos: false,
    hasBudget: true
  },
  { 
    id: 'SIN-2026-003', 
    company: 'Santander', 
    status: 'Completado',
    location: 'Plaza España 8, Sevilla',
    date: '13/03/2026',
    hasPdf: true,
    hasPhotos: true,
    hasBudget: true
  },
];

export default function ExpedientesPage() {
  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Expedientes</h1>
            <p className="text-slate-400 mt-1">Gestiona todos tus siniestros</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Nuevo Expediente
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar expedientes..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Expediente</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Compañía</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Ubicación</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Documentos</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Fecha</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {expeditions.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{exp.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{exp.company}</td>
                    <td className="px-6 py-4 text-slate-400">{exp.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`p-1.5 rounded ${exp.hasPdf ? 'bg-violet-600/20 text-violet-400' : 'bg-slate-800 text-slate-600'}`} title="PDF">
                          <FileText className="w-4 h-4" />
                        </span>
                        <span className={`p-1.5 rounded ${exp.hasPhotos ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`} title="Fotos">
                          <Camera className="w-4 h-4" />
                        </span>
                        <span className={`p-1.5 rounded ${exp.hasBudget ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`} title="Presupuesto">
                          <Upload className="w-4 h-4" />
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        exp.status === 'Completado' ? 'bg-emerald-600/20 text-emerald-400' :
                        exp.status === 'En progreso' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-amber-600/20 text-amber-400'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{exp.date}</td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
