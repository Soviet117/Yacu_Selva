function TopBar() {
  return (
    <div className="w-auto h-15 bg-white shadow-md flex justify-end items-center px-8 space-x-3">
      <div className="text-end">
        <p className="text-lg font-semibold">"Admin Principal"</p>
        <p className="text-gray-500">"Administrador"</p>
      </div>
      <span className="px-4 py-2 bg-blue-600 rounded-full text-xl font-bold text-white">
        A
      </span>
    </div>
  );
}

export default TopBar;
