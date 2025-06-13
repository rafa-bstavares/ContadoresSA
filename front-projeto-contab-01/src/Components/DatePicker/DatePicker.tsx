// src/components/DatePickerBrasil.tsx

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import {ptBR} from "date-fns/locale/pt-BR";
import "react-day-picker/dist/style.css";

interface DatePickerBrasilProps {
  label: string;
  id: string;
  value?: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({
  label,
  id,
  value,
  onChange,
}: DatePickerBrasilProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha o calendário ao clicar fora
  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (ref.current && !ref.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col" ref={ref}>
      <label htmlFor={id} className="text-gray-400 ">
        {label}
      </label>
      <input
        id={id}
        readOnly
        className="outline-none rounded-md border-2 border-solid border-gray-300 p-1 w-[10vw] bg-transparent text-white cursor-pointer"
        value={value ? format(value, "dd'/'MM'/'yyyy", { locale: ptBR }) : ""}
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <div className="absolute z-50 mt-2 bg-[#2E2E2E] rounded-md shadow-lg">
        <DayPicker
        captionLayout="dropdown"

        /* 2) define até onde vai o select de ano: */
        fromYear={1900}
      toYear={new Date().getFullYear()}
        mode="single"
        selected={value}
        onSelect={(d) => {
            if (d) {
            onChange(d)
            setOpen(false)
            }
        }}
        locale={ptBR}
        footer={null}
        styles={{
            // styling de elementos
            caption:   { color: "black" },
            head_cell: { color: "white" },
            day:       { color: "white" },
        }}
        modifiersStyles={{
            // styling de modifiers
            selected: {
            backgroundColor: "#3b82f6",
            color:           "white",
            },
        }}
        />

        </div>
      )}
    </div>
  );
}
