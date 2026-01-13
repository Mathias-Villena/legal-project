
import React, { useState } from 'react';

interface PaymentPageProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'card' | 'paypal' | null>('card');

  const handlePay = () => {
    if (!email || !email.includes('@')) {
      return alert('Por favor, introduce una dirección de correo electrónico válida.');
    }
    onSuccess(email);
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-20 overflow-y-auto">
      <div className="max-w-[850px] mx-auto px-6 py-8">
        
        {/* Header de la sección de pago similar a la imagen */}
        <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-8 mb-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-gray-800 text-lg font-normal">Contrato de arrendamiento de vivienda habitual</h3>
              <p className="text-gray-500 text-sm mt-1">Descarga inmediata en formatos Word y PDF</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-lg tracking-tight">29,99 €</div>
              <div className="text-[#10B981] text-sm font-medium mt-1">Incluido</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[#10B981] text-sm font-medium mt-4 mb-8">
            <i className="fas fa-users-viewfinder"></i>
            <span>8.995 personas ya han comprado este documento</span>
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
            <span className="font-bold text-xl text-gray-900">Importe total, con impuestos</span>
            <span className="text-2xl font-bold text-[#2563EB]">29,99 €</span>
          </div>
        </div>

        <div className="space-y-12">
          {/* Campo Email con estilo exacto */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-3">
              DIRECCIÓN DE CORREO ELECTRÓNICO (PARA RECIBIR EL DOCUMENTO) *
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400 text-gray-700 shadow-sm"
              placeholder="tu@email.com"
            />
          </div>

          {/* Formas de Pago con check visual */}
          <div>
            <h4 className="font-bold text-gray-900 text-xl mb-6">Forma de pago</h4>
            <div className="space-y-4">
              {/* Opción Tarjeta */}
              <button 
                onClick={() => setMethod('card')}
                className={`w-full flex items-center p-6 border rounded-xl transition-all ${method === 'card' ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className={`w-6 h-6 rounded border flex items-center justify-center mr-6 ${method === 'card' ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                   {method === 'card' && <i className="fas fa-check text-[10px] text-white"></i>}
                </div>
                <div className="flex gap-3 text-3xl text-gray-400 mr-8">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-900 text-lg">Tarjeta de pago</div>
                  <div className="text-sm text-gray-500 font-medium">Visa, Mastercard, American Express</div>
                </div>
              </button>

              {/* Opción PayPal */}
              <button 
                onClick={() => setMethod('paypal')}
                className={`w-full flex items-center p-6 border rounded-xl transition-all ${method === 'paypal' ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className={`w-6 h-6 rounded border flex items-center justify-center mr-6 ${method === 'paypal' ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                   {method === 'paypal' && <i className="fas fa-check text-[10px] text-white"></i>}
                </div>
                <div className="text-3xl text-[#003087] mr-8">
                  <i className="fab fa-paypal"></i>
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-900 text-lg">PayPal</div>
                  <div className="text-sm text-gray-500 font-medium">Paga de forma segura con tu cuenta PayPal</div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer de seguridad en verde claro */}
          <div className="bg-[#F0FDF4] text-[#15803D] p-6 rounded-xl flex items-start gap-4 border border-[#DCFCE7]">
            <i className="fas fa-shield-check text-2xl mt-0.5 opacity-80"></i>
            <div>
              <div className="font-bold text-base">Pago seguro</div>
              <div className="text-sm font-medium opacity-90 mt-1 leading-relaxed">
                Tus datos están protegidos. El proceso de pago está encriptado y asegurado mediante certificados SSL de alta seguridad.
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onBack}
              className="px-10 py-4 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-lg"
            >
              Anterior
            </button>
            <button 
              onClick={handlePay}
              className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
            >
              Finalizar y Pagar 29,99 € <i className="fas fa-arrow-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
