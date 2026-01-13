
import React, { useState } from 'react';

interface FormSectionProps {
  number: number | string;
  title: string;
  isCompleted: boolean;
  isOpenInitial?: boolean;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  number, 
  title, 
  isCompleted, 
  isOpenInitial = false,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(isOpenInitial);

  return (
    <div className="border-b border-gray-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            isCompleted 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
          }`}>
            {isCompleted ? <i className="fas fa-check"></i> : number}
          </div>
          <span className={`text-sm font-semibold transition-colors ${
            isOpen ? 'text-blue-600' : 'text-gray-700'
          }`}>{title}</span>
        </div>
        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2 ml-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;
