# Guía para subir el proyecto a GitHub

## Opción 1: Crear un nuevo repositorio (Recomendado)

### Paso 1: Crear el repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `nutriApp` (o el nombre que prefieras)
3. Descripción: "NutriApp - Aplicación web para gestión de platos saludables con Next.js, PostgreSQL y Playwright"
4. Visibilidad: **Público** (para GitHub Actions gratis) o **Privado**
5. **NO** marques "Add a README file" (ya tenemos uno)
6. **NO** marques "Add .gitignore" (ya tenemos uno)
7. Haz clic en **"Create repository"**

### Paso 2: Cambiar el remote origin
Después de crear el repositorio, GitHub te mostrará la URL. Ejecuta estos comandos:

```bash
# Remover el remote actual
git remote remove origin

# Agregar tu nuevo repositorio (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/nutriApp.git

# Verificar
git remote -v
```

### Paso 3: Subir el código
```bash
# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Add Playwright tests, CI/CD configuration, and improvements"

# Subir a tu repositorio
git push -u origin main
```

## Opción 2: Hacer Fork del repositorio original

Si prefieres hacer fork:

1. Ve a https://github.com/Academy-QA/happy_testing
2. Haz clic en el botón **"Fork"** (arriba a la derecha)
3. Selecciona tu cuenta como destino
4. Espera a que se complete el fork

Luego ejecuta:
```bash
# Cambiar el remote origin a tu fork
git remote set-url origin https://github.com/TU_USUARIO/happy_testing.git

# Verificar
git remote -v

# Subir cambios
git add .
git commit -m "Add Playwright tests, CI/CD configuration, and improvements"
git push -u origin main
```

## Verificar que todo esté bien

Después de subir, verifica:
- ✅ Los archivos están en GitHub
- ✅ El workflow de GitHub Actions aparece en la pestaña "Actions"
- ✅ El `.env` NO está subido (verifica que esté en `.gitignore`)

## Notas importantes

- El archivo `.env` está en `.gitignore`, así que NO se subirá (es correcto)
- Los reportes de Playwright (`playwright-report/`, `test-results/`) también están ignorados
- Los archivos de configuración de CI/CD (`.github/workflows/`) SÍ se subirán
