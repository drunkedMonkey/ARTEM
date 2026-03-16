'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Plus, Search, Filter, FileText, Trash2, Eye, Upload, X, Building } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface Barem {
  id: string;
  name: string;
  sector: string;
  description: string | null;
  amount: number | null;
  unit: string | null;
  filePath: string | null;
  extractedText: string | null;
  notes: string | null;
  company: Company;
  createdAt: string;
}

const defaultSectors = [
  'Mármoles',
  'Cristales',
  'Carpintería',
  'Fontanería',
  'Albañilería',
  'Pintura',
  'Gamma Blanca',
  'Electricidad',
  'Suelos',
  'Otros'
];

export default function BaremosPage() {
  const [baremos, setBaremos] = useState<Barem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBarem, setSelectedBarem] = useState<Barem | null>(null);
  const [sectors, setSectors] = useState<string[]>(defaultSectors);
  
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    companyId: '',
    amount: '',
    unit: '',
    description: '',
    notes: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchBaremos();
    fetchCompanies();
    fetchSectors();
  }, []);

  const fetchBaremos = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSector) params.append('sector', selectedSector);
      
      const res = await fetch(`http://localhost:3001/api/baremos?${params}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setBaremos(data);
    } catch (error) {
      console.error('Error fetching baremos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/companies', {
        credentials: 'include'
      });
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchSectors = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/baremos/sectors', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.length > 0) {
        const allSectors = [...new Set([...defaultSectors, ...data])];
        setSectors(allSectors);
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  useEffect(() => {
    fetchBaremos();
  }, [searchTerm, selectedSector]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend: any = {
      name: formData.name,
      sector: formData.sector,
      companyId: formData.companyId,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      unit: formData.unit || undefined,
      description: formData.description || undefined,
      notes: formData.notes || undefined
    };

    if (formData.file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        formDataToSend.fileBase64 = base64;
        formDataToSend.fileName = formData.file?.name;
        
        await createBarem(formDataToSend);
      };
      reader.readAsDataURL(formData.file);
    } else {
      await createBarem(formDataToSend);
    }
  };

  const createBarem = async (data: any) => {
    try {
      const res = await fetch('http://localhost:3001/api/baremos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchBaremos();
        fetchSectors();
      }
    } catch (error) {
      console.error('Error creating barem:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este baremo?')) return;
    
    try {
      await fetch(`http://localhost:3001/api/baremos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      fetchBaremos();
    } catch (error) {
      console.error('Error deleting barem:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sector: '',
      companyId: '',
      amount: '',
      unit: '',
      description: '',
      notes: '',
      file: null
    });
  };

  const openEditModal = (barem: Barem) => {
    setFormData({
      name: barem.name,
      sector: barem.sector,
      companyId: barem.company.id,
      amount: barem.amount?.toString() || '',
      unit: barem.unit || '',
      description: barem.description || '',
      notes: barem.notes || '',
      file: null
    });
    setSelectedBarem(barem);
    setShowModal(true);
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Baremos</h1>
              <p className="text-slate-400 mt-1">Gestiona tus tarifas y documentos</p>
            </div>
            <button 
              onClick={() => { resetForm(); setSelectedBarem(null); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo baremo
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar baremos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
            >
              <option value="">Todos los sectores</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Cargando...</div>
            ) : baremos.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No hay baremos. Crea el primero haciendo clic en "Nuevo baremo"
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Sector</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Compañía</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Precio</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Documento</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {baremos.map((barem) => (
                      <tr key={barem.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-white">{barem.name}</span>
                          {barem.description && (
                            <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{barem.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-violet-600/20 text-violet-400 rounded-full text-xs font-medium">
                            {barem.sector}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-slate-500" />
                            {barem.company.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {barem.amount ? (
                            <span>{barem.amount}€{barem.unit ? `/${barem.unit}` : ''}</span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {barem.filePath ? (
                            <a
                              href={`http://localhost:3001${barem.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 flex items-center gap-1 hover:text-emerald-300"
                              title="Ver PDF"
                            >
                              <FileText className="w-4 h-4" />
                              PDF
                            </a>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {barem.filePath ? (
                              <a
                                href={`http://localhost:3001${barem.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4 text-slate-400" />
                              </a>
                            ) : (
                              <button 
                                onClick={() => setSelectedBarem(barem)}
                                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4 text-slate-400" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(barem.id)}
                              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">
                  {selectedBarem ? 'Ver baremo' : 'Nuevo baremo'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              {selectedBarem ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Nombre</label>
                    <p className="text-white">{selectedBarem.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Sector</label>
                    <p className="text-white">{selectedBarem.sector}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Compañía</label>
                    <p className="text-white">{selectedBarem.company.name}</p>
                  </div>
                  {selectedBarem.filePath && (
                    <div>
                      <a
                        href={`http://localhost:3001${selectedBarem.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Ver PDF
                      </a>
                    </div>
                  )}
                  {selectedBarem.amount && (
                    <div>
                      <label className="text-sm text-slate-400">Precio</label>
                      <p className="text-white">{selectedBarem.amount}€{selectedBarem.unit ? `/${selectedBarem.unit}` : ''}</p>
                    </div>
                  )}
                  {selectedBarem.description && (
                    <div>
                      <label className="text-sm text-slate-400">Descripción</label>
                      <p className="text-white">{selectedBarem.description}</p>
                    </div>
                  )}
                  {selectedBarem.notes && (
                    <div>
                      <label className="text-sm text-slate-400">Notas</label>
                      <p className="text-white">{selectedBarem.notes}</p>
                    </div>
                  )}
                  {selectedBarem.extractedText && (
                    <div>
                      <label className="text-sm text-slate-400">Texto Extraído</label>
                      <div className="mt-2 p-4 bg-slate-800 rounded-lg text-sm text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
                        {selectedBarem.extractedText}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => openEditModal(selectedBarem)}
                    className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                  >
                    Editar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Sector *</label>
                      <select
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {sectors.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Compañía *</label>
                      <select
                        value={formData.companyId}
                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Notas</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Subir PDF</label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-violet-500 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">
                          {formData.file ? formData.file.name : 'Arrastra un PDF o haz clic'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
