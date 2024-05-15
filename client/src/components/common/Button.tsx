import classNames from "classnames";
import React from "react";
import "../../css/Button.css";

interface ButtonProps {
    onClick?: () => void;
    className: string;
    testId?: string;
    type?: "submit" | "button" | "reset";
    children: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    testId,
    className,
    type = "submit",
}) => {
  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      className={classNames(
        
        className
      )}
    >
      {children}
    </button>
  );
};
