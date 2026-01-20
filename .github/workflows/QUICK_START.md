# Guía Rápida - GitHub Actions para Playwright

## ¿Qué hace este workflow?

Este workflow automatiza la ejecución de tus tests de Playwright cada vez que:
- ✅ Haces push a las ramas `main` o `develop`
- ✅ Creas un Pull Request hacia `main` o `develop`
- ✅ Lo ejecutas manualmente desde GitHub

## Pasos del Workflow

1. **Checkout**: Descarga el código del repositorio
2. **Setup Node.js**: Configura Node.js 20
3. **Install dependencies**: Instala dependencias con `npm ci`
4. **Install Playwright**: Instala los navegadores necesarios
5. **Wait for PostgreSQL**: Espera a que PostgreSQL esté listo
6. **Setup Prisma**: Genera el cliente y ejecuta migraciones
7. **Run Tests**: Ejecuta todos los tests de Playwright
8. **Upload Reports**: Sube reportes HTML y traces si hay fallos

## Ver los Resultados

### 1. Ver el estado del workflow
- Ve a la pestaña **"Actions"** en tu repositorio
- Selecciona el workflow que quieres ver
- Revisa el estado de cada paso

### 2. Ver reportes HTML
- En la página del workflow, desplázate hacia abajo
- En la sección **"Artifacts"**, descarga `playwright-report`
- Descomprime y abre `index.html` en tu navegador

### 3. Ver logs detallados
- Haz clic en cualquier paso del workflow
- Revisa los logs para ver qué está pasando

## Ejecutar Manualmente

1. Ve a **Actions** > **Playwright Tests**
2. Haz clic en **"Run workflow"** (arriba a la derecha)
3. Selecciona la rama
4. Haz clic en **"Run workflow"**

## Configuración Actual

- **Node.js**: Versión 20
- **PostgreSQL**: Versión 15
- **Base de datos**: `nutriapp`
- **Usuario**: `postgres`
- **Contraseña**: `postgres`
- **Puerto**: `5432`
- **URL de la app**: `http://localhost:3000`

## Variables de Entorno

El workflow configura automáticamente:
- `DATABASE_URL`: Conexión a PostgreSQL
- `CI`: `true` (activa modo CI en Playwright)
- `BASE_URL`: URL base de la aplicación

## Troubleshooting

Si algo falla, consulta `.github/workflows/TROUBLESHOOTING.md` para soluciones detalladas.

## Próximos Pasos

1. ✅ Haz push de tus cambios
2. ✅ Ve a la pestaña "Actions" para ver el workflow ejecutándose
3. ✅ Revisa los resultados y descarga los reportes si es necesario
