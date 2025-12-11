// fix-all-apis.js - Guarda como este archivo
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para buscar archivos recursivamente
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = join(dirPath, file);

    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = extname(file).toLowerCase();
      if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Obtener TODOS los archivos .js/.jsx en src/
const allFiles = getAllFiles(join(__dirname, "src"));

console.log(`🔍 Encontrados ${allFiles.length} archivos para verificar...`);

let modifiedCount = 0;
let errorCount = 0;

allFiles.forEach((filePath) => {
  try {
    let content = readFileSync(filePath, "utf8");
    const originalContent = content;

    // 1. Para archivos API (que usan BASE_URL = "http://...")
    if (
      content.includes('BASE_URL = "http://') ||
      content.includes("BASE_URL = 'http://")
    ) {
      // Reemplazar BASE_URL = "http://localhost:8000/..."
      content = content.replace(
        /BASE_URL\s*=\s*["']http:\/\/localhost:8000(\/[^"']*)["']/g,
        'BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}$1`'
      );

      // Reemplazar BASE_URL = "http://127.0.0.1:8000/..."
      content = content.replace(
        /BASE_URL\s*=\s*["']http:\/\/127\.0\.0\.1:8000(\/[^"']*)["']/g,
        'BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}$1`'
      );
    }

    // 2. Reemplazar URLs directas (para fetch/axios)
    // Patrones para localhost:8000
    content = content.replace(
      /["']http:\/\/localhost:8000(\/[^"']*)["']/g,
      '`${import.meta.env.VITE_API_URL || "http://localhost:8000"}$1`'
    );

    // Patrones para 127.0.0.1:8000
    content = content.replace(
      /["']http:\/\/127\.0\.0\.1:8000(\/[^"']*)["']/g,
      '`${import.meta.env.VITE_API_URL || "http://localhost:8000"}$1`'
    );

    // 3. Para archivos que usan axios con URLs completas pero sin BASE_URL
    if (
      content.includes("axios.") &&
      (content.includes("localhost:8000") || content.includes("127.0.0.1:8000"))
    ) {
      // Ya se reemplazaron arriba, solo registrar
    }

    if (content !== originalContent) {
      writeFileSync(filePath, content, "utf8");
      modifiedCount++;

      // Mostrar nombre relativo
      const relativePath = filePath.replace(__dirname + "/", "");
      console.log(`✅ ${relativePath} - Actualizado`);

      // Mostrar ejemplo del cambio
      const oldLines = originalContent
        .split("\n")
        .filter(
          (line) =>
            line.includes("localhost:8000") || line.includes("127.0.0.1:8000")
        );
      if (oldLines.length > 0) {
        console.log(`   📝 Ejemplo: "${oldLines[0].trim()}"`);
      }
    }
  } catch (err) {
    errorCount++;
    console.log(`❌ ${filePath} - Error: ${err.message}`);
  }
});

console.log("\n📊 RESUMEN:");
console.log(`   Total archivos: ${allFiles.length}`);
console.log(`   Archivos modificados: ${modifiedCount}`);
console.log(`   Errores: ${errorCount}`);
console.log("🎯 Proceso completado!");

// Verificar si quedaron URLs sin cambiar
console.log("\n🔍 Verificando URLs pendientes...");
const remainingFiles = allFiles.filter((filePath) => {
  try {
    const content = readFileSync(filePath, "utf8");
    return (
      content.includes("localhost:8000") || content.includes("127.0.0.1:8000")
    );
  } catch {
    return false;
  }
});

if (remainingFiles.length > 0) {
  console.log(`⚠️  ${remainingFiles.length} archivos aún tienen URLs locales:`);
  remainingFiles.forEach((filePath) => {
    const relativePath = filePath.replace(__dirname + "/", "");
    console.log(`   - ${relativePath}`);
  });
} else {
  console.log("✅ ¡Todas las URLs han sido actualizadas!");
}
