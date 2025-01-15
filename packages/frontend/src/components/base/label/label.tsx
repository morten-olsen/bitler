import React, { ReactNode } from "react";

type LabelProps = {
  title: string;
  className?: string;
  children?: ReactNode;
}

const Label = ({ title, children }: LabelProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm">{title}</div>
      {children}
    </div>
  );
}

export { Label }
