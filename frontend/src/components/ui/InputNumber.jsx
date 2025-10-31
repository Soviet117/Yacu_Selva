function InputText({ title, descripcion, onChange, value }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <input
        type="number"
        className="p-2 
        focus:outline-none
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
                    cursor-pointer"
        onChange={handleChange}
        placeholder={descripcion}
        value={value}
      ></input>
    </div>
  );
}
export default InputText;
