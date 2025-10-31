import { NavLink } from "react-router-dom";

function NavListMenu({ url, text }) {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `px-8 py-2 text-gray-500   hover:bg-blue-100 ${
          isActive ? "bg-blue-200 border-r-4 border-blue-500" : ""
        }`
      }
    >
      {text}
    </NavLink>
  );
}

export default NavListMenu;
