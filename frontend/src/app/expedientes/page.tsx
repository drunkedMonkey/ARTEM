'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Plus, Search, Filter, Upload, Camera, FileText, MoreVertical, Phone, User } from 'lucide-react';

interface Expedition {
  id: string;
  code: string;
  company: { name: string };
  location: string;
  description: string | null;
  clientName: string | null;
  clientPhone: string | null;
  status: string;
  date: string;
}

const statusMap: Record<string, { label: string; class: string }> = {
  OPEN: { label: 'Abierto', class: 'bg-amber-600/20 text-amber-400' },
  IN_PROGRESS: { label: 'En progreso', class: 'bg-blue-600/20 text-blue-400' },
  PENDING_BUDGET: { label: 'Pendiente', class: 'bg-violet-600/20 text-violet-400' },
  COMPLETED: { label: 'Completado', class: 'bg-emerald-600/20 text-emerald-400' },
  CANCELLED: { label: 'Cancelado', class: 'bg-slate-600/20 text-slate-400' }
};

export default function ExpedientesPage() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const fetchExpeditions = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/expeditions', {
        credentials: 'include'
      });
      const data = await res.json();
      setExpeditions(data);
    } catch (error) {
      console.error('Error fetching expeditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpeditions = expeditions.filter(exp =>
    exp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Cargando...</div>
          ) : filteredExpeditions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No hay expedientes. Crea el primero haciendo clic en "Nuevo Expediente"
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Expediente</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Compañía</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Ubicación</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Teléfono</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Fecha</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredExpeditions.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-white">{exp.code}</span>
                        {exp.description && (
                          <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{exp.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {exp.clientName ? (
                          <div className="flex items-center gap-2 text-slate-300">
                            <User className="w-4 h-4 text-slate-500" />
                            {exp.clientName}
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{exp.company.name}</td>
                      <td className="px-6 py-4 text-slate-400">{exp.location}</td>
                      <td className="px-6 py-4">
                        {exp.clientPhone ? (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {exp.clientPhone}
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[exp.status]?.class || 'bg-slate-600/20 text-slate-400'}`}>
                          {statusMap[exp.status]?.label || exp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(exp.date).toLocaleDateString('es-ES')}
                      </td>
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
          )}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
