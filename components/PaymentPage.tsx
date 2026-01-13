
import React, { useState } from 'react';

interface PaymentPageProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'card' | 'paypal' | null>('card');

  const handlePay = () => {
    if (!email) return alert('Por favor, introduce tu correo electrónico.');
    onSuccess(email);
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-20 overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Resumen de compra estilo imagen */}
        <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-8 mb-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-700 font-medium">Contrato de arrendamiento de vivienda habitual</h3>
              <p className="text-gray-500 text-sm mt-1">Descarga inmediata en formatos Word y PDF</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">29,99 €</div>
              <div className="text-emerald-500 text-sm font-medium">Incluido</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-8">
            <i className="fas fa-users"></i>
            <span>8.995 personas ya han comprado este documento</span>
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900">Importe total, con impuestos</span>
            <span className="text-2xl font-bold text-[#2563EB]">29,99 €</span>
          </div>
        </div>

        <div className="space-y-10">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
              DIRECCIÓN DE CORREO ELECTRÓNICO (PARA RECIBIR EL DOCUMENTO) *
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 shadow-sm"
              placeholder="tu@email.com"
            />
          </div>

          {/* Forma de Pago */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-6">Forma de pago</h4>
            <div className="space-y-4">
              {/* Tarjeta */}
              <button 
                onClick={() => setMethod('card')}
                className={`w-full flex items-center p-6 border-2 rounded-xl transition-all ${method === 'card' ? 'border-[#2563EB] bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 mr-6 flex items-center justify-center ${method === 'card' ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                   {method === 'card' && <i className="fas fa-check text-[10px] text-white"></i>}
                </div>
                <div className="flex gap-3 text-2xl text-gray-400 mr-6">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Tarjeta de pago</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                </div>
              </button>

              {/* PayPal */}
              <button 
                onClick={() => setMethod('paypal')}
                className={`w-full flex items-center p-6 border-2 rounded-xl transition-all ${method === 'paypal' ? 'border-[#2563EB] bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 mr-6 flex items-center justify-center ${method === 'paypal' ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                   {method === 'paypal' && <i className="fas fa-check text-[10px] text-white"></i>}
                </div>
                <div className="text-2xl text-[#003087] mr-6">
                  <i className="fab fa-paypal"></i>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">PayPal</div>
                  <div className="text-sm text-gray-500">Paga de forma segura con tu cuenta PayPal</div>
                </div>
              </button>
            </div>
          </div>

          {/* Pago Seguro */}
          <div className="bg-[#F0FDF4] text-[#166534] p-6 rounded-xl flex items-center gap-4 border border-emerald-100">
            <i className="fas fa-shield-halved text-2xl opacity-60"></i>
            <div>
              <div className="font-bold">Pago seguro</div>
              <div className="text-sm opacity-80 mt-0.5">Datos encriptados. Descarque asegurada mediante SSL.</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onBack}
              className="px-8 py-4 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Anterior
            </button>
            <button 
              onClick={handlePay}
              className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
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
