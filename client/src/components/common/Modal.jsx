import React from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'lg',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4 h-screen'
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`
          relative w-full ${sizes[size]} mx-auto 
          bg-white 
          border border-slate-200 shadow-xl rounded-xl
          overflow-hidden
          transition-all
        `}>

          {(title || showCloseButton) && (
            <div className="relative p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-xl font-bold text-slate-900">
                    {title}
                  </h3>
                )}
                
                <div className="flex items-center gap-2">
                  {size !== 'full' && (
                    <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors">
                      <Maximize2 className="w-4 h-4 text-slate-600" />
                    </button>
                  )}
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 bg-slate-100 hover:bg-red-100 rounded-lg border border-slate-300 hover:border-red-300 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-600 hover:text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative p-6 max-h-[80vh] overflow-y-auto">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #94a3b8;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #64748b;
              }
            `}</style>
            
            <div className="custom-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Modal;