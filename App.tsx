
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import FormSection from './components/FormSection';
import DocumentPreview from './components/DocumentPreview';
import PaymentPage from './components/PaymentPage';
import { ContractData, ViewMode, CustomClause } from './types';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [data, setData] = useState<ContractData>({
    landlordName: 'Juan Pérez Moreno',
    landlordDNI: '12345678X',
    landlordAddress: 'Calle de Alcalá, 1, Madrid',
    tenantName: 'Sofía García López',
    tenantDNI: '87654321Y',
    propertyAddress: '',
    propertyRef: '',
    monthlyRent: '',
    startDate: '',
    customClauses: []
  });

  const progress = useMemo(() => {
    const { customClauses, ...fields } = data;
    const values = Object.values(fields) as string[];
    const filled = values.filter(v => v && v.trim() !== '').length;
    return Math.round((filled / values.length) * 100);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddClause = () => {
    const newClause: CustomClause = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'El arrendatario se compromete a mantener la vivienda en perfectas condiciones de higiene y limpieza...'
    };
    setData(prev => ({
      ...prev,
      customClauses: [...prev.customClauses, newClause]
    }));
  };

  const handleClauseChange = (id: string, text: string) => {
    setData(prev => ({
      ...prev,
      customClauses: prev.customClauses.map(c => c.id === id ? { ...c, text } : c)
    }));
  };

  const handleDownload = async () => {
    const element = document.getElementById('contract-document');
    if (!element) {
      alert("No se pudo encontrar el documento para descargar.");
      return;
    }

    try {
      const canvas = await window.html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Contrato_${data.tenantName.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
      console.error("Error PDF:", err);
      alert("Error al generar el PDF. Revisa que todos los datos básicos estén rellenos.");
    }
  };

  const handleSaveDraft = () => {
    alert("¡Borrador guardado! Podrás acceder a él desde 'Mis Documentos'.");
  };

  const handlePaymentSuccess = (email: string) => {
    alert(`¡Gracias por tu confianza! El contrato final se ha enviado a ${email}. Iniciando descarga...`);
    handleDownload();
    setViewMode('editor');
  };

  if (viewMode === 'payment') {
    return <PaymentPage onBack={() => setViewMode('editor')} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        viewMode={viewMode}
        onDownload={handleDownload}
        onSave={handleSaveDraft}
      />
      
      <main className="flex flex-1 mt-16 overflow-hidden">
        {/* Sidebar de Edición */}
        <aside className="w-[420px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto custom-scrollbar shadow-sm">
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">Alquiler Residencial</h2>
            <p className="text-[#3B82F6] text-xs font-bold mt-1.5 tracking-widest uppercase">Modelo oficial 2024</p>
          </div>

          <div className="px-8 py-6 border-b border-gray-50 bg-[#FAFAFA]">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2.5 uppercase tracking-widest">
              <span>Progreso de edición</span>
              <span className="text-[#3B82F6]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3B82F6] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 pb-10">
            <FormSection 
              number={1} 
              title="El Arrendador (Propietario)" 
              isCompleted={!!(data.landlordName && data.landlordDNI && data.landlordAddress)}
              isOpenInitial={true}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Nombre y Apellidos</label>
                  <input id="landlordName" value={data.landlordName} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">DNI / NIE</label>
                    <input id="landlordDNI" value={data.landlordDNI} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Domicilio de Notificaciones</label>
                  <input id="landlordAddress" value={data.landlordAddress} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
            </FormSection>

            <FormSection 
              number={2} 
              title="El Arrendatario (Inquilino)" 
              isCompleted={!!(data.tenantName && data.tenantDNI)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Nombre Completo</label>
                  <input id="tenantName" value={data.tenantName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Número de Identidad</label>
                  <input id="tenantDNI" value={data.tenantDNI} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
            </FormSection>

            <FormSection 
              number={3} 
              title="Objeto del Arrendamiento" 
              isCompleted={!!(data.propertyAddress && data.propertyRef)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Dirección de la Vivienda</label>
                  <input id="propertyAddress" value={data.propertyAddress} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="Ej: Calle Gran Vía 12, 4ºB" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Referencia Catastral</label>
                  <input id="propertyRef" value={data.propertyRef} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
            </FormSection>

            <FormSection 
              number={4} 
              title="Condiciones Económicas" 
              isCompleted={!!(data.monthlyRent && data.startDate)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Renta Mensual (€)</label>
                  <input id="monthlyRent" type="number" value={data.monthlyRent} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Fecha de Inicio de Contrato</label>
                  <input id="startDate" type="date" value={data.startDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
            </FormSection>

            {/* Renderizado de Cláusulas Extras dinámicas */}
            {data.customClauses.length > 0 && (
              <FormSection number="+" title="Cláusulas Personalizadas" isCompleted={true}>
                <div className="space-y-5">
                  {data.customClauses.map((clause, idx) => (
                    <div key={clause.id} className="relative group">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[9px] font-bold text-blue-500 uppercase tracking-wider">Añadida por usuario #{idx + 1}</label>
                        <button 
                          onClick={() => setData(prev => ({ ...prev, customClauses: prev.customClauses.filter(c => c.id !== clause.id) }))}
                          className="text-gray-300 hover:text-red-500 text-[10px] font-bold uppercase"
                        >
                          Eliminar
                        </button>
                      </div>
                      <textarea 
                        value={clause.text}
                        onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                        className="w-full px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-gray-700 outline-none focus:bg-white focus:border-blue-400 transition-all min-h-[100px] leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </FormSection>
            )}
          </div>

          <div className="p-8 bg-white border-t border-gray-100 space-y-4">
            <button 
              onClick={handleAddClause}
              className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2.5"
            >
              <i className="fas fa-plus-circle text-lg"></i> Añadir Cláusula Personalizada
            </button>
            <button 
              onClick={() => setViewMode('payment')}
              className="w-full py-4.5 bg-[#2563EB] text-white rounded-xl font-bold text-base shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Continuar al Pago <i className="fas fa-arrow-right text-sm"></i>
            </button>
          </div>
        </aside>

        {/* Previsualización del Documento */}
        <section className="flex-1 overflow-hidden">
          <DocumentPreview data={data} />
        </section>
      </main>
    </div>
  );
};

export default App;
