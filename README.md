# HernandezLab - Sistema de Gestión

Este proyecto es una plataforma web para la administración de personal y control de inventario (insumos y reactivos) para laboratorios clínicos.

---

## 🛠️ Tecnologías y Arquitectura

El sistema utiliza una arquitectura cliente-servidor desacoplada:

- **Backend**: API REST desarrollada con **Node.js**, **Express**, **MySQL** y autenticación basada en **JSON Web Tokens (JWT)**.
- **Frontend**: Single Page Application (SPA) construida con **React**, **Vite**, **Tailwind CSS v4** y enrutamiento con **React Router v6**.

---

## 📁 Estructura del Código

El proyecto está dividido en dos directorios principales:

```
HernandezLab/
├── backend/            # API REST (Servidor)
│   ├── src/
│   │   ├── config/     # Conexión DB (Pool) y esquema SQL
│   │   ├── controllers/# Lógica de peticiones y respuestas HTTP
│   │   ├── models/     # Consultas SQL a las tablas
│   │   ├── routes/     # Enrutadores Express (auth, empleados, inventario)
│   │   └── server.js   # Inicio del servidor Node
│   └── scripts/        # Utilidades (creación de usuario e inicio de BD)
│
└── frontend/           # Aplicación de Interfaz de Usuario (Cliente)
    ├── src/
    │   ├── api/        # Cliente Axios con interceptor de token JWT
    │   ├── components/ # Layouts (Sidebar/Navbar) y componentes UI reutilizables
    │   ├── context/    # Manejo de sesión global (AuthContext)
    │   └── pages/      # Vistas principales (Login, Dashboard, Empleados, Inventario)
```

---

## ⚙️ Funcionalidades del Sistema

1. **Autenticación Segura**: Login mediante correo y contraseña. Sesiones protegidas por tokens JWT almacenados en el navegador.
2. **Gestión de Empleados (CRUD)**: Panel para agregar, editar y dar de baja al personal del laboratorio con control de datos y estados.
3. **Gestión de Inventario Dinámico (Insumos y Reactivos)**:
   - **Pestañas de Filtro**: Permite visualizar todo el inventario junto o segmentarlo en *Insumos* (materiales de uso diario) y *Reactivos* (sustancias de análisis).
   - **Control de Stock Mínimo**: Alerta visual automática (**"Bajo Stock"**) cuando la cantidad actual del elemento es inferior al mínimo de seguridad establecido.

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Requisitos
- Node.js instalado.
- MySQL corriendo en local (vía XAMPP).

### 2. Configurar la Base de Datos e Iniciar el Backend
Desde la carpeta `backend/`:
```bash
# 1. Crear las tablas en la BD (XAMPP debe estar encendido)
npm run db:init

# 2. Crear el primer usuario administrador para loguearse
node scripts/create-user.js "Administrador" admin@hernandezlab.com admin1234 admin

# 3. Iniciar el servidor de desarrollo
npm run dev
```

### 3. Iniciar el Frontend
Desde la carpeta `frontend/`:
```bash
# Iniciar la aplicación de desarrollo en el puerto 5173
npm run dev
```
Accede desde tu navegador a `http://localhost:5173`.
