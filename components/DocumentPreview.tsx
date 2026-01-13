
import React from 'react';
import { ContractData } from '../types';
import { numberToWordsSpanish } from '../utils/helpers';

interface DocumentPreviewProps {
  data: ContractData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const {
    landlordName, landlordDNI, landlordAddress,
    tenantName, tenantDNI,
    propertyAddress, propertyRef,
    monthlyRent, startDate, customClauses
  } = data;

  const rentInWords = numberToWordsSpanish(monthlyRent);

  return (
    <div className="w-full h-full bg-[#E5E7EB] p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div id="contract-document" className="max-w-[800px] mx-auto bg-white paper-shadow min-h-[1122px] p-12 md:p-20 relative font-serif text-[#1F2937] leading-relaxed">
        <div className="absolute top-8 right-8 flex items-center gap-2 text-[9px] text-emerald-600 font-bold uppercase tracking-widest no-print">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sincronización en vivo
        </div>

        <h1 className="text-lg font-bold text-center underline mb-12 decoration-1 underline-offset-8">
          CONTRATO DE ARRENDAMIENTO DE VIVIENDA HABITUAL
        </h1>

        <div className="text-right text-sm mb-12 italic">
          En Madrid, a {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <div className="space-y-8 text-sm text-justify">
          <div className="font-bold uppercase tracking-widest text-xs border-b border-gray-100 pb-2">REUNIDOS</div>
          
          <p>
            De una parte, <strong>{landlordName.toUpperCase() || '[Nombre del Arrendador]'}</strong>, mayor de edad, con DNI/NIE número <strong>{landlordDNI || '[DNI]'}</strong>, y domicilio en <strong>{landlordAddress || '[Dirección]'}</strong>. En adelante el <strong>"ARRENDADOR"</strong>.
          </p>

          <p>
            Y de otra parte, <strong>{tenantName.toUpperCase() || '[Nombre del Arrendatario]'}</strong>, mayor de edad, con DNI/NIE número <strong>{tenantDNI || '[DNI]'}</strong>, en adelante el <strong>"ARRENDATARIO"</strong>.
          </p>

          <div className="font-bold uppercase tracking-widest text-xs border-b border-gray-100 pb-2 pt-4">EXPONEN</div>

          <p>
            I. Que el ARRENDADOR es propietario de la vivienda situada en <strong>{propertyAddress || '[Dirección de la Propiedad]'}</strong>, con referencia catastral <strong>{propertyRef || '[Referencia]'}</strong>.
          </p>

          <div className="font-bold uppercase tracking-widest text-xs border-b border-gray-100 pb-2 pt-4">CLÁUSULAS</div>

          <p>
            <strong>PRIMERA. OBJETO.</strong> El ARRENDADOR cede en arrendamiento al ARRENDATARIO la vivienda descrita anteriormente para ser destinada exclusivamente a vivienda permanente.
          </p>

          <p>
            <strong>SEGUNDA. DURACIÓN.</strong> El contrato comienza el día <strong>{startDate || '[Fecha]'}</strong> por un plazo de un año.
          </p>

          <p>
            <strong>TERCERA. RENTA.</strong> La renta mensual es de <strong>{rentInWords}</strong> euros (<strong>{monthlyRent || '0.00'}</strong> €).
          </p>

          {customClauses.map((clause, index) => (
            <p key={clause.id}>
              <strong>CLÁUSULA ADICIONAL {index + 1}.</strong> {clause.text}
            </p>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs">
          <div className="border-t border-gray-300 pt-4">Fdo: EL ARRENDADOR</div>
          <div className="border-t border-gray-300 pt-4">Fdo: EL ARRENDATARIO</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
