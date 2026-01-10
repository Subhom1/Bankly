import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    type: "button" | "submit" | "reset";
    className: string;
}

export const Button = ({
    children,
    onClick,
    disabled,
    type,
    className
}: ButtonProps) => {
    return (
        <button type={type} className={className} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}