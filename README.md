# Clases a tu ritmo

## Enlaces del proyecto

| Servicio | URL |
| --- | --- |
| Frontend | https://clases-a-tu-ritmo.vercel.app/ |
| Backend | https://clases-a-tu-ritmo.onrender.com/ |
| Health check API | https://clases-a-tu-ritmo.onrender.com/api/health |

Clases a tu ritmo es una aplicación FullStack para entrenadores y clientes. La idea nace como una plataforma donde un entrenador puede crear sesiones de entrenamiento divididas en tracks, y un cliente puede seguir la clase desde casa de forma visual, como una experiencia tipo Just Dance, pero sin detección de movimiento.

El objetivo del proyecto es resolver un problema concreto: muchas personas quieren entrenar desde casa, pero necesitan una guía clara, ordenada y motivadora. Por eso la aplicación organiza los entrenamientos por programas, clases y tracks, permitiendo que cada usuario tenga una experiencia distinta según su rol.

## Público objetivo

La aplicación está pensada para dos tipos principales de usuario:

- Clientes que quieren encontrar clases guiadas, seguir entrenamientos y guardar las sesiones que completan.
- Entrenadores que quieren publicar clases y dividirlas en tracks para estructurar mejor sus sesiones.

También existe un rol de administrador para gestionar usuarios y cambiar roles desde un panel básico.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router
- Sass / SCSS
- Context API
- Fetch API

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- Bcrypt
- Dotenv
- Cloudinary
- Multer
- File System de Node.js (`fs`)

## Funcionalidades principales

- Registro de usuarios.
- Login con token JWT.
- Roles de usuario: `client`, `trainer` y `admin`.
- Catálogo de clases.
- Buscador por clase, programa o entrenador.
- Filtro por nivel.
- Detalle de cada clase.
- Tracks asociados a cada clase.
- Creación de clases por entrenadores.
- Subida de imágenes de clases con Cloudinary.
- Eliminación automática en Cloudinary de la imagen anterior al editar una clase.
- Edición y eliminación de clases por parte del trainer propietario o admin.
- Creación de tracks por entrenadores.
- Marcar clases como completadas por clientes.
- Página de entrenamientos completados para clientes.
- Página de clases publicadas para entrenadores.
- Panel de administración para modificar roles.
- Eliminación de usuarios por parte del admin.
- Posibilidad de que un usuario borre su propia cuenta desde API.
- Seed de base de datos desde archivos CSV.

## Roles de usuario

| Rol | Permisos principales |
| --- | --- |
| `client` | Puede ver clases, entrar al detalle y marcar clases como completadas. |
| `trainer` | Puede crear clases, añadir tracks y ver sus propias clases. |
| `admin` | Puede cambiar roles de usuarios y también acceder a funcionalidades de entrenador. |

## Estructura principal del proyecto

```txt
backend/
  src/
    config/
    controllers/
    data/csv/
    middlewares/
    models/
    routes/
    seeds/
    app.js
    server.js

frontend/
  src/
    components/
    context/
    pages/
    style.css
    main.jsx
    App.jsx
```

## Modelos de la base de datos

| Colección | Descripción | Relaciones |
| --- | --- | --- |
| `Users` | Usuarios de la aplicación. | Puede ser trainer de clases y tracks. Puede tener sesiones completadas. |
| `Programs` | Programas de entrenamiento, como BodyCombat, BodyPump o HIIT. | Un programa tiene muchas clases. |
| `Classes` | Sesiones de entrenamiento de unos 45 minutos. | Pertenece a un programa y a un trainer. También guarda la URL de imagen y, si procede, el `public_id` de Cloudinary. |
| `Tracks` | Partes pequeñas de una clase. | Pertenece a una clase y a un trainer. |
| `WorkoutSessions` | Registro de clases completadas por clientes. | Relaciona un usuario con una clase completada. |

## Seed desde CSV

La base de datos se genera a partir de archivos CSV ubicados en:

```txt
backend/src/data/csv/
```

Archivos utilizados:

| Archivo | Datos que contiene |
| --- | --- |
| `users.csv` | Usuarios iniciales, incluyendo clientes, trainers y admin. |
| `programs.csv` | Programas de entrenamiento. |
| `classes.csv` | Clases relacionadas con programas y trainers. |
| `tracks.csv` | Tracks relacionados con clases y trainers. |

Cantidad actual de datos iniciales:

| Archivo | Número de registros |
| --- | ---: |
| `users.csv` | 6 |
| `programs.csv` | 5 |
| `classes.csv` | 10 |
| `tracks.csv` | 90 |
| **Total** | **111** |

El archivo `backend/src/seeds/seed.js` lee los CSV con `fs.readFileSync`, transforma los datos y crea las relaciones entre colecciones antes de insertarlas en MongoDB.


## Nota sobre las imágenes del seed

Las clases creadas desde los archivos CSV usan imágenes de ejemplo y por eso varias pueden aparecer repetidas. Esto ocurre porque son datos iniciales para poblar la base de datos y poder probar la aplicación rápidamente.

Las clases creadas desde el frontend por un entrenador sí pueden subir una imagen propia mediante Cloudinary. Si el entrenador crea una clase sin subir imagen, la aplicación asigna una imagen por defecto para que la tarjeta no quede vacía. Cuando una clase creada con Cloudinary cambia de imagen, la imagen anterior se elimina de Cloudinary para no dejar archivos antiguos sin uso.

## Endpoints del backend

### Health check

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| GET | `/api/health` | Pública | Comprueba si la API está funcionando. |

### Auth

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Pública | Registra un nuevo usuario. |
| POST | `/api/auth/login` | Pública | Inicia sesión y devuelve un token JWT. |

### Users

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin | Obtiene todos los usuarios sin mostrar la contraseña. |
| PATCH | `/api/users/:userId/role` | Admin | Cambia el rol de un usuario. |
| DELETE | `/api/users/:userId` | Usuario logueado/Admin | Permite que un usuario borre su propia cuenta o que un admin borre cualquier usuario. |

### Programs

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| GET | `/api/programs` | Pública | Obtiene todos los programas. |

### Classes

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| GET | `/api/classes` | Pública | Obtiene todas las clases con su programa y entrenador. |
| GET | `/api/classes/:classId` | Pública | Obtiene el detalle de una clase concreta. |
| POST | `/api/classes` | Trainer/Admin | Crea una nueva clase. |
| PATCH | `/api/classes/:classId` | Trainer propietario/Admin | Edita una clase. |
| DELETE | `/api/classes/:classId` | Trainer propietario/Admin | Elimina una clase junto con sus tracks y sesiones asociadas. |

### Tracks

Los tracks están pensados como parte de una clase, por eso se accede a ellos desde la ruta de clases.

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| GET | `/api/classes/:classId/tracks` | Pública | Obtiene todos los tracks de una clase. |
| GET | `/api/classes/:classId/tracks/:trackId` | Pública | Obtiene un track concreto dentro de una clase. |
| POST | `/api/classes/:classId/tracks` | Trainer/Admin | Crea un track dentro de una clase. |

### Workout sessions

| Método | Endpoint | Protección | Descripción |
| --- | --- | --- | --- |
| POST | `/api/workouts` | Usuario logueado | Marca una clase como completada. |
| GET | `/api/workouts/me` | Usuario logueado | Obtiene las sesiones completadas del usuario actual. |

## Rutas del frontend

| Ruta | Página | Descripción |
| --- | --- | --- |
| `/` | Home | Página de bienvenida con información del proyecto y clases destacadas. |
| `/catalog` | Catalog | Catálogo completo de clases con búsqueda y filtro. |
| `/classes/:id` | ClassDetails | Detalle de una clase y sus tracks. |
| `/classes/create` | CreateClass | Formulario para crear clases. Solo trainer/admin. |
| `/login` | Login | Inicio de sesión. |
| `/register` | Register | Registro de usuario. |
| `/my-workouts` | MyWorkouts | Entrenamientos completados para clientes o clases creadas para trainers. |
| `/admin` | AdminPanel | Panel de administración para cambiar roles. |

## Hooks utilizados

| Hook | Uso en el proyecto |
| --- | --- |
| `useState` | Gestión de formularios, carga, errores, filtros y datos recibidos de la API. |
| `useEffect` | Peticiones al backend cuando se cargan páginas o cambia el usuario. |
| `useContext` | Acceso global al usuario y token mediante `AuthContext`. |
| Custom hook `useAuth` | Simplifica el uso del contexto de autenticación en las páginas y componentes. |
| `AbortController` | Cancela peticiones si el componente se desmonta antes de terminar el fetch. |
| `Promise.all` | Carga datos relacionados a la vez en el detalle de clase. |

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone Clases_a_tu_ritmo
cd Clases_a_tu_ritmo
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Crear variables de entorno del backend

Crear un archivo `.env` dentro de `backend/` con este contenido:

```env
PORT=3000
DB_URL=TU_URL_DE_MONGODB
JWT_SECRET=TU_SECRETO_JWT
FRONTEND_URL=https://clases-a-tu-ritmo.vercel.app
CLOUDINARY_CLOUD_NAME=TU_CLOUD_NAME
CLOUDINARY_API_KEY=TU_API_KEY
CLOUDINARY_API_SECRET=TU_API_SECRET
```

### 4. Ejecutar el seed

```bash
npm run seed
```

### 5. Arrancar el backend

```bash
npm run dev
```

### 6. Instalar dependencias del frontend

En otra terminal:

```bash
cd frontend
npm install
```

### 7. Variables de entorno del frontend para producción

Para desplegar el frontend hay que crear esta variable en Vercel:

```env
VITE_API_URL=https://clases-a-tu-ritmo.onrender.com
```

En local puede quedar vacía porque Vite usa el proxy configurado en `vite.config.js`.

### 8. Arrancar el frontend

```bash
npm run dev
```

La aplicación frontend se abrirá normalmente en:

```txt
http://localhost:5173
```

El backend se ejecuta normalmente en:

```txt
http://localhost:3000
```

## Usuarios de prueba

Todos los usuarios del seed usan la contraseña:

```txt
Password123
```

| Rol | Email |
| --- | --- |
| Admin | `admin@example.es` |
| Trainer | `laura.trainer@example.com` |
| Trainer | `pablo.trainer@example.com` |
| Trainer | `sara.trainer@example.com` |
| Cliente | `marta.client@example.com` |
| Cliente | `daniel.client@example.com` |

## Decisiones de diseño

La aplicación separa las clases en tracks porque la idea futura es que cada sesión pueda funcionar como una experiencia visual guiada. En vez de tener un único vídeo largo en la clase, cada track puede representar una parte concreta del entrenamiento: calentamiento, bloque principal, recuperación o vuelta a la calma.

El catálogo está separado de la home para que la página inicial explique mejor el sentido del proyecto. La home presenta la idea, muestra acciones según el usuario logueado y enseña algunas clases destacadas. El catálogo queda dedicado a buscar y filtrar clases.

Los roles permiten que la misma aplicación tenga experiencias distintas. Un cliente no necesita ver formularios de creación, un trainer necesita gestionar sus clases, y un admin necesita controlar los roles de los usuarios.

## Mejoras futuras

- Subida real de vídeos e imágenes con Cloudinary.
- Reproductor visual parecido a Just Dance.
- Página de perfil de usuario.
- Estadísticas de progreso para clientes.
- Edición y borrado de clases/tracks.
- Validaciones más completas en frontend y backend.
- Diseño responsive más avanzado.
- Tests automatizados.

## Estado del proyecto

El proyecto tiene implementado el MVP principal: autenticación, roles, catálogo, clases, tracks, sesiones completadas, panel admin y seed desde CSV. Queda como parte final preparar el despliegue del backend y frontend.

