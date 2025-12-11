// components/ui/NavListMenu.jsx
import { NavLink } from "react-router-dom";

function NavListMenu({ url, text, icon = "•", isCollapsed = false, onClick }) {
  return (
    <NavLink
      to={url}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg my-1 ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500"
            : ""
        } ${isCollapsed ? "justify-center" : ""}`
      }
      title={isCollapsed ? text : ""}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span className="font-medium truncate">{text}</span>}
    </NavLink>
  );
}

export default NavListMenu;
