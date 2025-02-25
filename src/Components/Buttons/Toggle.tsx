import React, { PropsWithChildren, useEffect } from "react";
import { useAppSelector } from "../../hooks";

interface Props {
  label: string;
  defaultValue: boolean;
  form?: "createShow" | "createSRG" | "editProfile" | "inviteArtists";
  field?: boolean;
  onChange: (newValue: boolean) => void;
}

export default function Toggle({
  label,
  form,
  field,
  defaultValue,
  onChange,
  children,
}: PropsWithChildren<Props>) {
  const active = useAppSelector((state) => state.user.forms[form]?.field);

  const toggle = (value: boolean) => {
    if (form && field) {
      onChange(value);
    }
  };

  useEffect(() => {
    toggle(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={() => toggle(!active)}
      className={`transition-all rounded-lg border border-gray-300 p-4 w-48 text-center ${
        active ? "bg-orange text-white" : "shadow-toggle"
      }`}
    >
      <p className="text-xl font-black">{label}</p>
      <p>{children}</p>
    </div>
  );
}
