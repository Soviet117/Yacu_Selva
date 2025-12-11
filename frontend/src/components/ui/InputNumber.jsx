function InputText({
  title,
  descripcion,
  onChange,
  value,
  min,
  type = "number",
}) {
  const handleChange = (e) => {
    const val = type === "number" ? Number(e.target.value) : e.target.value;
    onChange(val);
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </label>
      <input
        type={type}
        className="p-2 mt-1 focus:outline-none border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer transition-colors"
        onChange={handleChange}
        placeholder={descripcion}
        value={value || ""}
        min={min}
      />
      {descripcion && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {descripcion}
        </p>
      )}
    </div>
  );
}

export default InputText;
