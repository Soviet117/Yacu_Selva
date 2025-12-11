import { useState } from "react";

function InputCheck({ title, items, value, onChange }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </label>

      <select
        value={value || ""}
        onChange={handleChange}
        className="focus:outline-none p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer transition-colors"
      >
        <option value="" disabled className="text-gray-500 dark:text-gray-400">
          Seleccionar...
        </option>

        {items.length > 0 ? (
          items.map((d) => (
            <option
              key={d.id}
              value={d.id}
              className="text-gray-900 dark:text-gray-100"
            >
              {d.nombre}
            </option>
          ))
        ) : (
          <option
            value=""
            disabled
            className="text-gray-500 dark:text-gray-400"
          >
            No hay opciones disponibles
          </option>
        )}
      </select>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {items.length} opciones disponibles
      </p>
    </div>
  );
}

export default InputCheck;
