import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  title,
  subtitle,
  value,
  icon,
  onClick,
  className = "",
  children,
}: CardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between mb-2">
        {title && (
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </div>
        )}
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {value && (
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      )}
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      {children}
    </>
  );

  const baseStyles =
    "bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full";
  const clickStyles = onClick ? "cursor-pointer active:scale-[0.98]" : "";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${clickStyles} ${className} text-left w-full`}
      >
        {content}
      </button>
    );
  }

  return <div className={`${baseStyles} ${className}`}>{content}</div>;
}
