import { useState } from "react";
import {
  Save,
  RefreshCw,
  Bell,
  Shield,
  Database,
  Mail,
  FileText,
  Download,
  Upload,
} from "lucide-react";

function StartConf() {
  const [config, setConfig] = useState({
    // Configuración de notificaciones
    notificacionesEmail: true,
    notificacionesSistema: true,
    alertasStockBajo: true,
    recordatoriosPagos: false,

    // Configuración de seguridad
    autologout: 30, // minutos
    intentosLogin: 3,
    complejidadPassword: "media",

    // Configuración del sistema
    autoBackup: true,
    frecuenciaBackup: "diario",
    maxRegistros: 10000,

    // Configuración de reportes
    formatoReporte: "pdf",
    incluirLogo: true,
    emailReportes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    alert("✅ Configuración guardada correctamente");
  };

  const handleBackup = () => {
    alert("🔄 Iniciando backup automático...");
    // Aquí iría la lógica de backup
  };

  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.backup";
    input.onchange = (e) => {
      alert("📁 Archivo seleccionado para restaurar");
      // Lógica de restauración
    };
    input.click();
  };

  const handleExport = () => {
    alert("📤 Exportando configuración...");
    // Lógica de exportación
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold dark:text-white">
          Configuración del Sistema
        </p>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>

      {/* Sección de Notificaciones */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold dark:text-white">Notificaciones</h3>
        </div>

        <div className="space-y-3">
          <ToggleOption
            label="Notificaciones por Email"
            description="Recibir alertas importantes por correo"
            checked={config.notificacionesEmail}
            onChange={(checked) =>
              setConfig({ ...config, notificacionesEmail: checked })
            }
          />

          <ToggleOption
            label="Notificaciones del Sistema"
            description="Mostrar alertas en el panel principal"
            checked={config.notificacionesSistema}
            onChange={(checked) =>
              setConfig({ ...config, notificacionesSistema: checked })
            }
          />

          <ToggleOption
            label="Alertas de Stock Bajo"
            description="Notificar cuando productos estén por agotarse"
            checked={config.alertasStockBajo}
            onChange={(checked) =>
              setConfig({ ...config, alertasStockBajo: checked })
            }
          />

          <ToggleOption
            label="Recordatorios de Pagos"
            description="Recordar pagos pendientes automáticamente"
            checked={config.recordatoriosPagos}
            onChange={(checked) =>
              setConfig({ ...config, recordatoriosPagos: checked })
            }
          />
        </div>
      </div>

      {/* Sección de Seguridad */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold dark:text-white">Seguridad</h3>
        </div>

        <div className="space-y-4">
          <SelectOption
            label="Auto-logout (minutos)"
            description="Tiempo de inactividad antes de cerrar sesión"
            value={config.autologout}
            options={[
              { value: 15, label: "15 minutos" },
              { value: 30, label: "30 minutos" },
              { value: 60, label: "1 hora" },
              { value: 120, label: "2 horas" },
            ]}
            onChange={(value) =>
              setConfig({ ...config, autologout: parseInt(value) })
            }
          />

          <SelectOption
            label="Intentos de login fallidos"
            description="Número de intentos antes de bloquear cuenta"
            value={config.intentosLogin}
            options={[
              { value: 3, label: "3 intentos" },
              { value: 5, label: "5 intentos" },
              { value: 10, label: "10 intentos" },
            ]}
            onChange={(value) =>
              setConfig({ ...config, intentosLogin: parseInt(value) })
            }
          />

          <SelectOption
            label="Complejidad de contraseñas"
            description="Nivel de seguridad requerido para contraseñas"
            value={config.complejidadPassword}
            options={[
              { value: "baja", label: "Baja (6 caracteres)" },
              { value: "media", label: "Media (8 caracteres + números)" },
              {
                value: "alta",
                label: "Alta (10 caracteres + números + símbolos)",
              },
            ]}
            onChange={(value) =>
              setConfig({ ...config, complejidadPassword: value })
            }
          />
        </div>
      </div>

      {/* Sección de Backup y Mantenimiento */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold dark:text-white">
            Backup & Mantenimiento
          </h3>
        </div>

        <div className="space-y-4">
          <ToggleOption
            label="Backup Automático"
            description="Realizar copias de seguridad automáticamente"
            checked={config.autoBackup}
            onChange={(checked) =>
              setConfig({ ...config, autoBackup: checked })
            }
          />

          {config.autoBackup && (
            <SelectOption
              label="Frecuencia de Backup"
              description="Cada cuánto tiempo realizar backup automático"
              value={config.frecuenciaBackup}
              options={[
                { value: "diario", label: "Diario" },
                { value: "semanal", label: "Semanal" },
                { value: "mensual", label: "Mensual" },
              ]}
              onChange={(value) =>
                setConfig({ ...config, frecuenciaBackup: value })
              }
            />
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleBackup}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Backup Ahora</span>
            </button>

            <button
              onClick={handleRestore}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Restaurar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Reportes */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold dark:text-white">Reportes</h3>
        </div>

        <div className="space-y-4">
          <SelectOption
            label="Formato de Reportes"
            description="Formato predeterminado para generar reportes"
            value={config.formatoReporte}
            options={[
              { value: "pdf", label: "PDF" },
              { value: "excel", label: "Excel" },
              { value: "ambos", label: "PDF y Excel" },
            ]}
            onChange={(value) =>
              setConfig({ ...config, formatoReporte: value })
            }
          />

          <ToggleOption
            label="Incluir Logo en Reportes"
            description="Agregar logo de la empresa en los reportes"
            checked={config.incluirLogo}
            onChange={(checked) =>
              setConfig({ ...config, incluirLogo: checked })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email para Reportes Automáticos
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={config.emailReportes}
                onChange={(e) =>
                  setConfig({ ...config, emailReportes: e.target.value })
                }
                placeholder="reportes@empresa.com"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleExport}
                className="bg-gray-600 text-white px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Probar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para opciones toggle
const ToggleOption = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// Componente para opciones select
const SelectOption = ({ label, description, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
      {description}
    </p>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default StartConf;
