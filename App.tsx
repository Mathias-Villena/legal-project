
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import FormSection from './components/FormSection';
import DocumentPreview from './components/DocumentPreview';
import PaymentPage from './components/PaymentPage';
import { ContractData, ViewMode, CustomClause } from './types';

// Extendiendo window para las librerías cargadas vía script
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
    const filled = values.filter(v => v.trim() !== '').length;
    return Math.round((filled / values.length) * 100);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddClause = () => {
    const newClause: CustomClause = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'Nueva cláusula personalizada para este contrato...'
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
    if (!element) return;

    try {
      const canvas = await window.html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Contrato_Alquiler_${data.tenantName.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Hubo un error al generar el PDF. Por favor, asegúrate de haber completado los datos.");
    }
  };

  const handleSaveDraft = () => {
    alert("¡Borrador guardado exitosamente en tu perfil!");
  };

  const handlePaymentSuccess = (email: string) => {
    alert(`¡Pago completado con éxito!\nEl contrato final ha sido enviado a: ${email}.\nAhora se activará la descarga definitiva.`);
    handleDownload();
    setViewMode('editor');
  };

  if (viewMode === 'payment') {
    return <PaymentPage onBack={() => setViewMode('editor')} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      <Header 
        viewMode={viewMode}
        onDownload={handleDownload}
        onSave={handleSaveDraft}
      />
      
      <main className="flex flex-1 mt-16 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[400px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto custom-scrollbar shadow-sm">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Alquiler Residencial</h2>
            <p className="text-[#3B82F6] text-xs font-bold mt-1 tracking-wide uppercase">CONTRATO DE VIVIENDA HABITUAL</p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 border-b border-gray-50">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
              <span>Progreso de edición</span>
              <span className="text-[#3B82F6]">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3B82F6] transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 pb-10">
            <FormSection 
              number={1} 
              title="Datos del Arrendador" 
              isCompleted={!!(data.landlordName && data.landlordDNI && data.landlordAddress)}
              isOpenInitial={true}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Nombre Completo</label>
                  <input id="landlordName" value={data.landlordName} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">DNI / NIE</label>
                  <input id="landlordDNI" value={data.landlordDNI} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Domicilio Legal</label>
                  <input id="landlordAddress" value={data.landlordAddress} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
            </FormSection>

            <FormSection 
              number={2} 
              title="Datos del Arrendatario" 
              isCompleted={!!(data.tenantName && data.tenantDNI)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Nombre Completo</label>
                  <input id="tenantName" value={data.tenantName} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">DNI / NIE</label>
                  <input id="tenantDNI" value={data.tenantDNI} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
            </FormSection>

            <FormSection 
              number={3} 
              title="Propiedad Arrendada" 
              isCompleted={!!(data.propertyAddress && data.propertyRef)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Dirección Inmueble</label>
                  <input id="propertyAddress" value={data.propertyAddress} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Ej: Calle Gran Vía 12" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Ref. Catastral</label>
                  <input id="propertyRef" value={data.propertyRef} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
            </FormSection>

            <FormSection 
              number={4} 
              title="Renta y Fechas" 
              isCompleted={!!(data.monthlyRent && data.startDate)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Renta Mensual (€)</label>
                  <input id="monthlyRent" type="number" value={data.monthlyRent} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Fecha Comienzo</label>
                  <input id="startDate" type="date" value={data.startDate} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
            </FormSection>

            {data.customClauses.length > 0 && (
              <FormSection number="+" title="Cláusulas Extras" isCompleted={true}>
                <div className="space-y-6">
                  {data.customClauses.map((clause, idx) => (
                    <div key={clause.id} className="relative group">
                      <label className="block text-[9px] font-bold text-blue-400 uppercase mb-1">Cláusula {idx + 1}</label>
                      <textarea 
                        value={clause.text}
                        onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                        className="w-full px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 transition-all min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              </FormSection>
            )}
          </div>

          <div className="p-8 bg-white border-t border-gray-100 space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <button 
              onClick={handleAddClause}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus-circle"></i> Nueva cláusula
            </button>
            <button 
              onClick={() => setViewMode('payment')}
              className="w-full py-4 px-4 bg-[#2563EB] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Continuar al Pago <i className="fas fa-arrow-right text-xs"></i>
            </button>
          </div>
        </aside>

        {/* Document Preview */}
        <section className="flex-1 overflow-hidden">
          <DocumentPreview data={data} />
        </section>
      </main>
    </div>
  );
};

export default App;
