import React, { PropsWithChildren } from "react";

interface Props {
  icon?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  iconColor?: string;
}

export default function IconButton({
  icon,
  onClick,
  className,
  iconColor,
  children,
}: PropsWithChildren<Props>) {
  const handleClick = (e: React.MouseEvent) => {
    // Stop the event propagation,
    // even if there was no onClick prop given to us.
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex-1 ${className ? className : "hover:bg-gray-200"}`}
    >
      {icon && (
        <i
          className={`material-symbols-outlined ${iconColor ? iconColor : ""}`}
        >
          {icon}
        </i>
      )}
      {children}
    </button>
  );
}
