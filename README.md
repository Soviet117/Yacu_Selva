# Project YS - Django REST API + React Frontend

Sistema web full stack con Django como backend API REST y React como frontend, utilizando PostgreSQL como base de datos principal.

## 🏗️ Arquitectura del Proyecto

- **Backend:** Django REST API con autenticación JWT
- **Frontend:** React + Vite con enrutamiento SPA
- **Base de datos:** PostgreSQL
- **Comunicación:** API REST con Axios

## 📁 Estructura del Proyecto

```
PROJECT_YS/
├── backend/                 # Django REST API
│   ├── manage.py
│   ├── requirements.txt     # Dependencias Python
│   ├── .env.example         # Variables de entorno ejemplo
│   ├── settings.py
│   └── ...                  # Aplicaciones Django
├── frontend/                # React Application
│   ├── package.json         # Dependencias Node.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/        # Servicios API
│   ├── public/
│   └── ...
├── venv/                    # Virtual Environment (no incluido en Git)
├── .gitignore
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:

- **Python 3.8+**
- **Node.js 18+** y npm
- **PostgreSQL 12+**
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/project-ys.git
cd PROJECT_YS
```

### 2. Configuración del Backend (Django)

#### Crear y activar entorno virtual:

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate
```

#### Instalar dependencias:

```bash
cd backend
pip install -r requirements.txt
```

**Dependencias principales:**

- `Django` - Framework web
- `psycopg[binary]` - Conector PostgreSQL optimizado
- `python-dotenv` - Manejo de variables de entorno
- `djangorestframework` - API REST toolkit

#### Configuración de variables de entorno:

1. **Copiar archivo de ejemplo:**

   ```bash
   cp .env.example .env
   ```

2. **Editar `.env` con tus datos:**

   ```env
   # Database Configuration
   DB_NAME=tu_base_de_datos
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña_postgresql
   DB_HOST=localhost
   DB_PORT=5432

   # Django Configuration
   SECRET_KEY=tu-clave-secreta-django-super-segura
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

#### Configuración de la base de datos:

1. **Crear base de datos PostgreSQL:**

   ```bash
   # Conectar a PostgreSQL
   psql -U postgres

   # Crear base de datos
   CREATE DATABASE tu_base_de_datos;

   # Verificar creación
   \l

   # Salir
   \q
   ```

2. **Ejecutar migraciones:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Crear superusuario (opcional):**
   ```bash
   python manage.py createsuperuser
   ```

### 3. Configuración del Frontend (React)

```bash
cd ../frontend
npm install
```

**Dependencias principales:**

- `React 18` - Biblioteca para interfaces de usuario
- `Vite` - Build tool y servidor de desarrollo rápido
- `Axios` - Cliente HTTP para consumir APIs
- `React Router DOM` - Enrutamiento declarativo

### 4. Ejecutar el Proyecto

Necesitas **dos terminales** abiertas simultáneamente:

#### Terminal 1 - Servidor Backend:

```bash
cd backend

# Activar entorno virtual (si no está activo)
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Ejecutar servidor Django
python manage.py runserver
```

✅ **Backend disponible en:** http://localhost:8000

#### Terminal 2 - Servidor Frontend:

```bash
cd frontend
npm run dev
```

✅ **Frontend disponible en:** http://localhost:5173

## 🔧 Comandos Útiles

### Backend (Django):

```bash
# Servidor de desarrollo
python manage.py runserver

# Crear nuevas migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Shell interactivo de Django
python manage.py shell

# Recopilar archivos estáticos
python manage.py collectstatic

# Ejecutar tests
python manage.py test
```

### Frontend (React):

```bash
# Servidor de desarrollo con hot reload
npm run dev

# Build optimizado para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linting de código
npm run lint

# Instalar nueva dependencia
npm install nombre-paquete
```

## 🌐 Endpoints y URLs

### Frontend:

- **Aplicación principal:** http://localhost:5173
- **Desarrollo con hot reload**

### Backend:

- **API Base:** http://localhost:8000/api/
- **Panel de administración:** http://localhost:8000/admin/
- **Documentación API:** http://localhost:8000/api/docs/ (si está configurado)

## 🔒 Configuración de Seguridad

### Variables de entorno obligatorias:

```env
SECRET_KEY=clave-super-secreta-y-unica
DEBUG=False  # En producción
DB_PASSWORD=contraseña-segura
```

### Notas de seguridad:

- ❌ **NUNCA** subas archivos `.env` al repositorio
- ✅ Usa contraseñas fuertes para PostgreSQL
- ✅ Cambia `SECRET_KEY` en producción
- ✅ Establece `DEBUG=False` en producción
- ✅ Configura `ALLOWED_HOSTS` apropiadamente

## 👥 Desarrollo Colaborativo

### Para nuevos desarrolladores:

1. **Clonar repositorio**
2. **Crear su propio archivo `.env`** (nunca compartir el tuyo)
3. **Instalar dependencias** de backend y frontend
4. **Configurar su propia base de datos local**

### Workflow recomendado:

```bash
# Crear rama para nueva feature
git checkout -b feature/nueva-funcionalidad

# Desarrollar y hacer commits
git add .
git commit -m "feat: descripción de la funcionalidad"

# Push de la rama
git push origin feature/nueva-funcionalidad

# Crear Pull Request en GitHub
```

## 🛠️ Stack Tecnológico

### Backend:

- **Django 5.x** - Framework web de Python
- **Django REST Framework** - Toolkit para APIs REST
- **PostgreSQL** - Base de datos relacional
- **psycopg** - Adaptador PostgreSQL más eficiente

### Frontend:

- **React 18** - Biblioteca de JavaScript para UI
- **Vite** - Build tool ultrarrápido
- **Axios** - Cliente HTTP con interceptores
- **React Router DOM** - Enrutamiento SPA

### Herramientas:

- **Git** - Control de versiones
- **npm** - Gestor de paquetes Node.js
- **pip** - Gestor de paquetes Python

## 📋 Scripts Disponibles

### Backend:

```bash
# Actualizar requirements.txt
pip freeze > requirements.txt

# Backup de base de datos
python manage.py dumpdata > backup.json

# Cargar datos desde backup
python manage.py loaddata backup.json
```

### Frontend:

```bash
# Instalar dependencias exactas
npm ci

# Auditar vulnerabilidades
npm audit

# Actualizar dependencias
npm update
```

## 🐛 Resolución de Problemas

### Error de conexión a PostgreSQL:

```bash
# Verificar que PostgreSQL esté ejecutándose
psql -U postgres

# Verificar variables de entorno
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DB_NAME:', os.getenv('DB_NAME'))
print('DB_USER:', os.getenv('DB_USER'))
"
```

### Puerto ocupado:

```bash
# Backend en puerto alternativo
python manage.py runserver 8001

# El frontend cambiará automáticamente de puerto si 5173 está ocupado
npm run dev
```

### Problemas con dependencias:

```bash
# Backend - reinstalar dependencias
pip install -r requirements.txt --force-reinstall

# Frontend - limpiar e instalar
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

### Antes de reportar un problema:

1. ✅ **PostgreSQL está ejecutándose** en el puerto 5432
2. ✅ **Archivo `.env` configurado** correctamente
3. ✅ **Dependencias instaladas** según requirements.txt y package.json
4. ✅ **Base de datos creada** y migraciones aplicadas
5. ✅ **Puerto 8000 y 5173 disponibles**

### Logs útiles:

```bash
# Ver logs detallados de Django
python manage.py runserver --verbosity=2

# Ver información de build de Vite
npm run dev -- --debug
```

## 📝 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

**¡Listo para desarrollar! 🚀**

Para cualquier duda, revisar la sección de resolución de problemas o abrir un issue en GitHub.
