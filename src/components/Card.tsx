import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'clickable' | 'highlight';
  borderColor?: string;
  onClick?: () => void;
}

/**
 * Reusable card component with consistent styling
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  borderColor,
  onClick 
}) => {
  const baseStyles = 'bg-white rounded-xl border shadow-sm overflow-hidden';
  
  const variantStyles = {
    default: 'border-gray-200',
    clickable: 'border-gray-200 hover:border-[#005595] hover:shadow-md transition-all cursor-pointer',
    highlight: borderColor ? '' : 'border-blue-200',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  const style = borderColor ? { borderColor } : undefined;

  return (
    <div className={combinedStyles} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card content/body component
 */
export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card title component
 */
export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-bold text-[#1F1F1F] ${className}`}>
      {children}
    </h3>
  );
};
