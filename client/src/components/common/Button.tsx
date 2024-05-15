import classNames from "classnames";
import React from "react";
import "../../css/Button.css";
<<<<<<< HEAD

interface ButtonProps {
    onClick?: () => void;
    className: string;
    testId?: string;
    type?: "submit" | "button" | "reset";
    children: React.ReactNode;
=======
interface ButtonProps {
  onClick?: () => void;
  className: string;
  testId?: string;
  type?: "submit" | "button" | "reset";
  children: React.ReactNode;
>>>>>>> 6b7e2748937226dcc8c0bbe92cbb59c62092d720
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
<<<<<<< HEAD
        
=======
        "bg-rose-400 p-2 rounded-lg hover:bg-rose-600 text-white",
>>>>>>> 6b7e2748937226dcc8c0bbe92cbb59c62092d720
        className
      )}
    >
      {children}
    </button>
  );
};
