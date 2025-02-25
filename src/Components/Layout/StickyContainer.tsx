import React, { PropsWithChildren } from "react";

interface Props {
  className?: string;
}

/**
 * Keeps content placed in a fixed position over main content.
 * @param props
 */
export default function StickyContainer({
  children,
  className,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`sticky w-full bottom-0 pointer-events-none childrenPointerEvents ${className}`}
    >
      {children}
    </div>
  );
}
