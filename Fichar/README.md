# Registro horario · Práctica 1 (DISM)

Sistema de registro horario formado por:

| Componente | Carpeta | Puerto | Tecnología |
|---|---|---|---|
| Servicios web REST | `ServiciosRest` | 8080 | Node.js + Express (generado con openapi-generator), MySQL con `mysql2` |
| Aplicación de administración | `AppAdmin` | 8100 | Ionic + Angular |
| Aplicación de usuarios | `AppUsuarios` | 8101 | Ionic + Angular |
| Base de datos | `dism.sql` | 3306 | MySQL |

- **AppAdmin**: gestión de usuarios, trabajos y fichajes (con mapa de ubicación).
- **AppUsuarios**: cada usuario registra su entrada y salida y consulta sus fichajes.
- Ambas aplicaciones tienen login, envían una ApiKey al servidor y son PWA.

## 1. Requisitos

- **Node.js 20.19 o superior** (se recomienda la 22) y npm.
- **MySQL Server** y el cliente `mysql`.
- **Ionic CLI**: `npm install -g @ionic/cli`.

## 2. Estructura del proyecto

```
ServiciosRest/    servidor REST (api/openapi.yaml, services/, controllers/)
AppAdmin/         aplicación de administración
AppUsuarios/      aplicación de usuarios
dism.sql          script de la base de datos
```

El ZIP no incluye las carpetas `node_modules`: se generan con `npm install`.

## 3. Instalación

### 3.1 Base de datos

El script crea la base de datos `dism`, las tablas (Usuarios, Trabajos, Fichajes, ApiKey), una ApiKey inicial y el usuario de MySQL `dism`. Se importa como administrador, desde la carpeta que contiene `dism.sql`:

```bash
sudo mysql < dism.sql
```

Comprobación:

```bash
mysql -u dism -p dism -e "SHOW TABLES; SELECT * FROM ApiKey;"
```

Contraseña del usuario `dism`: `Dism2026!` (la misma que usa `ServiciosRest/services/db.js`).

La base de datos se crea vacía: hace falta al menos un usuario y un trabajo para poder probar las aplicaciones. Con este comando se crean unos de ejemplo (usuario `prueba`, clave `1234`):

```bash
mysql -u dism -p dism -e "INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES ('Prueba','prueba','1234'); INSERT INTO Trabajos (Nombre) VALUES ('Trabajo de prueba');"
```

También se pueden crear desde Swagger (`POST /usuarios` y `POST /trabajos`) o desde AppAdmin.

### 3.2 Servicios web

```bash
cd ServiciosRest
npm install
```

### 3.3 Aplicaciones

En cada aplicación:

```bash
cd AppAdmin       # y repetir en AppUsuarios
npm install
```

## 4. Ejecución

Abre una terminal para cada proceso, en este orden:

```bash
# 0. MySQL (si no está arrancado)
sudo systemctl start mysql

# 1. Servicios web  ->  http://localhost:8080
cd ServiciosRest
node index.js

# 2. AppAdmin  ->  http://localhost:8100
cd AppAdmin
ionic serve --port=8100

# 3. AppUsuarios  ->  http://localhost:8101
cd AppUsuarios
ionic serve --port=8101
```

- Documentación y pruebas de la API (Swagger): <http://localhost:8080/api-docs>
- Para entrar en las aplicaciones, usa un usuario de la tabla `Usuarios` (por ejemplo `prueba` / `1234`).

## 5. ApiKey

El servidor rechaza con **401** las peticiones que no llevan una clave válida en la cabecera `X-API-Key`. Las claves están en la tabla `ApiKey`.

- Clave inicial: `clave-dism-2026`.
- Las aplicaciones la envían automáticamente con un interceptor (`src/app/api-key.interceptor.ts`). Si cambias la clave en la tabla, cámbiala también ahí.
- En Swagger, pulsa **Authorize** e introduce la clave para probar los endpoints.
- No requieren clave: `/hello`, `/openapi` y `/api-docs`.

La URL del servidor que usan las aplicaciones está en `src/environments/environment.ts` y `environment.prod.ts` (propiedad `apiUrl`, por defecto `http://localhost:8080`).

## 6. PWA (versión de producción)

El service worker solo funciona en la compilación de producción y desde `localhost` o HTTPS. En cada aplicación:

```bash
npx ng build --configuration production
npx http-server www -p 8200 -c-1      # AppAdmin; usar 8201 para AppUsuarios
```

Abre `http://localhost:8200` en Chrome. Para comprobarlo:

1. Herramientas de desarrollo (`F12`) → pestaña **Application**.
2. **Manifest**: nombre, iconos y *Installability* sin errores.
3. **Service Workers**: `ngsw-worker.js` en estado *activated and running*.
4. Icono de instalación en la barra de direcciones (o menú ⋮ → *Instalar página como aplicación*).

Desde otro dispositivo (móvil) la app carga por la IP del PC, pero no se puede instalar sin HTTPS, y la API tendría que ser accesible en esa IP en lugar de `localhost`.

## 7. Solución de problemas

| Problema | Solución |
|---|---|
| `ERROR 1045 Access denied` al entrar en MySQL | Comprueba la contraseña en `ServiciosRest/services/db.js`. Si no coincide, como administrador: `sudo mysql -e "ALTER USER 'dism'@'localhost' IDENTIFIED BY 'Dism2026!'; FLUSH PRIVILEGES;"` |
| `ERROR 1227` al importar `dism.sql` | Importa como administrador: `sudo mysql < dism.sql` |
| `SHOW DATABASES` no muestra `dism` | El script no se ha importado todavía (apartado 3.1) |
| Las aplicaciones dan error 401 | La ApiKey de `api-key.interceptor.ts` no coincide con ninguna de la tabla `ApiKey` |
| Las aplicaciones no cargan datos | Comprueba que `node index.js` está en marcha y que `apiUrl` apunta a `http://localhost:8080` |
| Puerto ocupado | `lsof -i :8080` (o 8100, 8101) y cierra el proceso |
| `Bus error` o `ionic serve` se para solo | Reinstala: `rm -rf node_modules .angular && npm install`; comprueba `node -v` (≥ 20.19) y el espacio en disco |
| No aparece la opción de instalar la PWA | Usa la compilación de producción en `localhost` (no `ionic serve`) y revisa *Application → Manifest* |
| No se ve el manifiesto (404) | `angular.json` debe copiar `public` en los assets: `{ "glob": "**/*", "input": "public" }` |

## 9. Autor

Héctor Valero · Grupo 2 · Entrega 2 · 25-11-2026
