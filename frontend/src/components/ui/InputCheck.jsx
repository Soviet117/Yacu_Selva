import { useState } from "react";

function InputCheck({ title, items,value, onChange }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className="flex flex-col space-y-1 w-full max-w-xs">
      <label className="text-sm font-medium text-gray-700">{title}</label>

      <select
        value={value}
        onChange={handleChange}
        className="focus:outline-none
                    p-2 
                    border 
                    border-gray-300 
                    rounded-md 
                    shadow-sm 
                    focus:border-blue-500 
                    focus:ring 
                    focus:ring-blue-500 
                    focus:ring-opacity-50 
                    w-full 
                    bg-white
                    cursor-pointer
                "
      >
        <option value="" disabled>
          Seleccionar...
        </option>

        {items.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InputCheck;
