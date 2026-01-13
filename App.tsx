
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header from './components/Header';
import FormSection from './components/FormSection';
import DocumentPreview from './components/DocumentPreview';
import PaymentPage from './components/PaymentPage';
import { ContractData, ViewMode, CustomClause } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [isGenerating, setIsGenerating] = useState(false);
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
    const filled = values.filter(v => v && String(v).trim() !== '').length;
    return Math.round((filled / values.length) * 100);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  // Función para usar Gemini e inventar una cláusula legal
  const handleSuggestClause = async () => {
    setIsGenerating(true);
    try {
      // Corrected GoogleGenAI initialization: directly using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Corrected model selection: gemini-3-pro-preview for complex reasoning tasks like legal drafting
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Escribe una cláusula legal corta y profesional en español para un contrato de alquiler de vivienda sobre mascotas o reparaciones domésticas.",
        config: { temperature: 0.7 }
      });
      
      // Corrected response extraction: response.text is a property, not a method
      const suggestedText = response.text || "El arrendatario se compromete al mantenimiento básico de la vivienda.";
      
      const newClause: CustomClause = {
        id: Math.random().toString(36).substring(2, 11),
        text: suggestedText
      };
      
      setData(prev => ({
        ...prev,
        customClauses: [...prev.customClauses, newClause]
      }));
    } catch (error) {
      console.error("Gemini Error:", error);
      // Fallback si falla la API
      handleAddClause();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddClause = () => {
    const newClause: CustomClause = {
      id: Math.random().toString(36).substring(2, 11),
      text: 'El arrendatario declara haber visitado la vivienda y aceptarla en su estado actual...'
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
    // Fixed TypeScript errors by casting window to any to access globally loaded libraries
    const anyWindow = window as any;
    if (!element || !anyWindow.html2canvas || !anyWindow.jspdf) return;

    try {
      const canvas = await anyWindow.html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new anyWindow.jspdf.jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Contrato_${data.tenantName.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
      alert("Error al crear el PDF. Inténtalo de nuevo.");
    }
  };

  if (viewMode === 'payment') {
    return <PaymentPage onBack={() => setViewMode('editor')} onSuccess={() => setViewMode('editor')} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header viewMode={viewMode} onDownload={handleDownload} onSave={() => alert('Guardado')} />
      
      <main className="flex flex-1 mt-16 overflow-hidden">
        <aside className="w-[420px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">Editor de Contrato</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">ESPAÑA</span>
              <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">Ley de Arrendamientos Urbanos</span>
            </div>
          </div>

          <div className="px-8 py-6 border-b border-gray-50">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase">
              <span>Progreso</span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex-1 pb-10">
            <FormSection number={1} title="Arrendador (Dueño)" isCompleted={!!data.landlordName} isOpenInitial={true}>
              <input id="landlordName" placeholder="Nombre completo" value={data.landlordName} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm mb-3 outline-none focus:border-blue-500" />
              <input id="landlordDNI" placeholder="DNI / NIE" value={data.landlordDNI} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm mb-3 outline-none focus:border-blue-500" />
              <input id="landlordAddress" placeholder="Dirección legal" value={data.landlordAddress} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-500" />
            </FormSection>

            <FormSection number={2} title="Arrendatario (Inquilino)" isCompleted={!!data.tenantName}>
              <input id="tenantName" placeholder="Nombre completo" value={data.tenantName} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm mb-3 outline-none focus:border-blue-500" />
              <input id="tenantDNI" placeholder="DNI / NIE" value={data.tenantDNI} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-500" />
            </FormSection>

            <FormSection number={3} title="La Propiedad" isCompleted={!!data.propertyAddress}>
              <input id="propertyAddress" placeholder="Dirección vivienda" value={data.propertyAddress} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm mb-3 outline-none focus:border-blue-500" />
              <input id="propertyRef" placeholder="Referencia Catastral" value={data.propertyRef} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-500" />
            </FormSection>

            <FormSection number={4} title="Renta y Pago" isCompleted={!!data.monthlyRent}>
              <input id="monthlyRent" type="number" placeholder="Precio mensual (€)" value={data.monthlyRent} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm mb-3 outline-none focus:border-blue-500" />
              <input id="startDate" type="date" value={data.startDate} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-500" />
            </FormSection>

            {data.customClauses.map((clause, idx) => (
              <div key={clause.id} className="px-8 mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Cláusula Extra {idx + 1}</span>
                  <button onClick={() => setData(prev => ({ ...prev, customClauses: prev.customClauses.filter(c => c.id !== clause.id) }))} className="text-red-400 hover:text-red-600 text-[10px] font-bold">ELIMINAR</button>
                </div>
                <textarea value={clause.text} onChange={(e) => handleClauseChange(clause.id, e.target.value)} className="w-full p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs min-h-[80px] outline-none" />
              </div>
            ))}
          </div>

          <div className="p-8 bg-white border-t border-gray-100 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleAddClause} className="py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all">
                + Manual
              </button>
              <button 
                onClick={handleSuggestClause} 
                disabled={isGenerating}
                className="py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-robot"></i>}
                Sugerencia IA
              </button>
            </div>
            <button onClick={() => setViewMode('payment')} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all">
              Finalizar y Pagar (29,99€)
            </button>
          </div>
        </aside>

        <section className="flex-1 bg-gray-200 overflow-hidden">
          <DocumentPreview data={data} />
        </section>
      </main>
    </div>
  );
};

export default App;
