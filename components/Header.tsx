
import React from 'react';

interface HeaderProps {
  onDownload: () => void;
  onSave: () => void;
  viewMode: 'editor' | 'payment';
}

const Header: React.FC<HeaderProps> = ({ onDownload, onSave, viewMode }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xl">
        <i className="fas fa-file-contract"></i>
        <span>LegalContract AI</span>
      </div>
      
      <nav className="hidden lg:flex items-center gap-10 text-sm font-medium text-gray-500">
        <a href="#" className="hover:text-gray-900 transition-colors">My Documents</a>
        <a href="#" className="hover:text-gray-900 transition-colors">Templates</a>
        <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={onDownload}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <i className="fas fa-download text-xs"></i> Download PDF
        </button>
        <button 
          onClick={onSave}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          Save Draft
        </button>
        <div className="w-10 h-10 bg-[#FEF3C7] rounded-full flex items-center justify-center text-[#D97706] border border-[#FDE68A] cursor-pointer">
          <i className="fas fa-bars text-sm"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
