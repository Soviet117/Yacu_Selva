// hooks/useUser.js
import { useMemo } from "react";

export const useUser = (user) => {
  return useMemo(() => {
    if (!user) {
      return {
        nombre: "Usuario",
        rol: "Administrador",
        email: "usuario@yacuselva.com",
        empresa: "Yacu Selva",
        modulos: [], // Módulos a los que tiene acceso
      };
    }

    return {
      nombre: user.nombre_completo || user.nom_user,
      rol: user.tipo_usuario,
      email: user.nom_user,
      empresa: "Yacu Selva", // Puedes agregar este campo en tu backend si es necesario
      modulos: user.modulos_acceso || [], // Módulos a los que tiene acceso
      id: user.id_user,
      tipoUsuario: user.id_tipo_user,
    };
  }, [user]);
};
