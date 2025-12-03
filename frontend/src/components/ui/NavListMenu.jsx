// components/ui/NavListMenu.jsx (si existe)
import { NavLink } from "react-router-dom";

function NavListMenu({ url, text }) {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors ${
          isActive ? "bg-blue-50 text-blue-600 border-r-4 border-blue-500" : ""
        }`
      }
    >
      <span className="font-medium">{text}</span>
    </NavLink>
  );
}

export default NavListMenu;
