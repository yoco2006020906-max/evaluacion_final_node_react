import React from 'react';
import { User, Mail, Lock, Phone, MapPin, Package, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const hasError = touched && error;

  // Icono dinámico por tipo
  const getDefaultIcon = () => {
    const iconMap = {
      'email': Mail,
      'password': Lock,
      'tel': Phone,
      'address': MapPin,
      'product': Package,
      'card': CreditCard,
      'user': User
    };
    return iconMap[name] || iconMap[type] || Icon;
  };

  const DefaultIcon = getDefaultIcon();
  const DisplayIcon = Icon || DefaultIcon;

  return (
    <div className={`group relative mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Icono */}
        {DisplayIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`p-1.5 rounded-lg ${
              hasError 
                ? 'bg-red-100 text-red-600' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              <DisplayIcon className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Input principal */}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            h-11 px-4 py-2
            bg-white
            border-2 rounded-xl
            text-sm font-medium
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50
            transition-all duration-200
            
            ${DisplayIcon ? 'pl-12' : 'pl-4'}
            
            ${hasError
              ? 'border-red-300 bg-red-50/50 text-red-900 placeholder-red-400 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300 focus:border-cyan-500'
            }
            
            ${disabled 
              ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' 
              : ''
            }
          `}
        />

        {/* Status indicator */}
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {hasError && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;