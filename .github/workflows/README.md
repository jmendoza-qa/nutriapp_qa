# CI/CD Configuration

Este proyecto incluye configuraciones para ejecutar tests automatizados en CI/CD.

## GitHub Actions

El workflow `.github/workflows/playwright.yml` se ejecuta automáticamente cuando:
- Se hace push a las ramas `main` o `develop`
- Se crea un Pull Request hacia `main` o `develop`
- Se ejecuta manualmente desde la pestaña "Actions" en GitHub

### Características:
- ✅ Configuración automática de PostgreSQL (usando servicios de GitHub Actions)
- ✅ Instalación automática de dependencias y navegadores de Playwright
- ✅ Ejecución de migraciones de Prisma
- ✅ Ejecución de todos los tests (funcionales y E2E)
- ✅ Generación y publicación de reportes HTML

### Ver resultados:
1. Ve a la pestaña "Actions" en tu repositorio de GitHub
2. Selecciona el workflow que quieres ver
3. Haz clic en el job "test"
4. Descarga el artifact "playwright-report" para ver el reporte HTML completo

## Jenkins

El archivo `Jenkinsfile` está configurado para ejecutarse en Jenkins.

### Requisitos previos:
- Jenkins con Node.js instalado (versión 20 recomendada)
- PostgreSQL corriendo y accesible desde Jenkins
- Plugin HTML Publisher instalado en Jenkins

### Configuración en Jenkins:
1. Crea un nuevo Pipeline Job
2. Configura el repositorio Git
3. Selecciona "Pipeline script from SCM"
4. Especifica la ruta del Jenkinsfile
5. Guarda y ejecuta

### Variables de entorno necesarias:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `BASE_URL`: URL base de la aplicación (default: http://localhost:3000)

## Comparación

| Característica | GitHub Actions | Jenkins |
|---------------|----------------|---------|
| Configuración | ✅ Muy fácil | ⚠️ Requiere más setup |
| PostgreSQL | ✅ Automático | ⚠️ Requiere configuración manual |
| Gratis | ✅ Sí (públicos) | ⚠️ Requiere servidor propio |
| Reportes | ✅ Artifacts | ✅ HTML Publisher |
| Integración Git | ✅ Nativa | ⚠️ Requiere plugins |

## Recomendación

Para este proyecto, **GitHub Actions es la mejor opción** porque:
- El repositorio ya está en GitHub
- Configuración más simple
- PostgreSQL se configura automáticamente
- No requiere infraestructura adicional
