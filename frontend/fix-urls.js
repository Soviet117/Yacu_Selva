import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = [
  "src/components/sections/StartConf.jsx",
  "src/components/sections/UserManagement.jsx", 
  "src/components/ui/FormAgregarTrabajador.jsx",
  "src/components/ui/FormDespedirTrabajador.jsx",
  "src/components/ui/FormularioEditarTrabajador.jsx",
  "src/components/ui/GraficoPerformance.jsx",
  "src/pages/Trabajadores.jsx",
  "src/components/sections/SecctionTablaCaja.jsx",
  "src/components/ui/CardReporteFlexible.jsx",
  "src/components/ui/CardReporte.jsx"
];

console.log("🔧 Corrigiendo URLs...");

files.forEach(file => {
  try {
    const filePath = join(__dirname, file);
    let content = readFileSync(filePath, "utf8");
    
    // Reemplazar URLs
    content = content.replace(/"http:\/\/localhost:8000(\/[^"]*)"/g, 
      \`\${import.meta.env.VITE_API_URL || "http://localhost:8000"}\$1\`);
    content = content.replace(/"http:\/\/127\.0\.0\.1:8000(\/[^"]*)"/g,
      \`\${import.meta.env.VITE_API_URL || "http://localhost:8000"}\$1\`);
    
    writeFileSync(filePath, content, "utf8");
    console.log(\`✅ \${file} - Actualizado\`);
  } catch (err) {
    console.log(\`❌ \${file} - Error: \${err.message}\`);
  }
});
