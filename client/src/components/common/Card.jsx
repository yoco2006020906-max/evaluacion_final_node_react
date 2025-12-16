import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = true,
  shadow = 'xl'
}) => {
  const paddingClass = padding ? 'p-4 lg:p-5' : '';
  const hoverClass = hover ? 'transition-all duration-200 hover:shadow-lg' : '';

  const shadowClasses = {
    sm: 'shadow-sm border border-slate-100',
    md: 'shadow-md border border-slate-200',
    lg: 'shadow-lg border border-slate-200',
    xl: 'shadow-xl border border-slate-200 bg-white',
    none: 'border-transparent'
  };

  return (
    <div className={`
      bg-white rounded-xl ${shadowClasses[shadow]} ${paddingClass} ${hoverClass} ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;