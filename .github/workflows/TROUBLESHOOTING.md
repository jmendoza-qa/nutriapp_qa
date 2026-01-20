# Guía de Solución de Problemas - GitHub Actions

## Problemas Comunes y Soluciones

### 1. Error: "PostgreSQL connection failed"

**Síntomas:**
```
Error: P1001: Can't reach database server
```

**Soluciones:**
- El workflow ya incluye un paso para esperar a que PostgreSQL esté listo
- Verifica que el servicio de PostgreSQL esté configurado correctamente en el workflow
- Asegúrate de que el `DATABASE_URL` sea correcto: `postgresql://postgres:postgres@localhost:5432/nutriapp`

### 2. Error: "Migration failed" o "Schema is not in sync"

**Síntomas:**
```
Error: Migration failed
```

**Soluciones:**
1. Verifica que todas las migraciones estén en el repositorio:
   ```bash
   ls -la prisma/migrations/
   ```

2. Asegúrate de que el archivo `prisma/migrations/migration_lock.toml` esté presente

3. Si agregaste nuevas migraciones localmente, haz commit y push:
   ```bash
   git add prisma/migrations/
   git commit -m "Add new migrations"
   git push
   ```

### 3. Error: "Next.js server not starting"

**Síntomas:**
```
Error: webServer timed out
```

**Soluciones:**
- El timeout está configurado a 120 segundos
- Verifica que no haya errores de compilación en Next.js
- Revisa los logs del paso "Run Playwright tests" para ver qué está fallando

### 4. Tests fallan en CI pero funcionan localmente

**Posibles causas:**

**a) Variables de entorno faltantes:**
- Asegúrate de que `DATABASE_URL`, `CI`, y `BASE_URL` estén configuradas en el workflow

**b) Diferencias en el entorno:**
- Los tests en CI se ejecutan con `workers: 1` (sin paralelización)
- Los tests tienen 2 reintentos automáticos en CI

**c) Problemas de timing:**
- Agrega más `waitFor` en tus tests si es necesario
- Verifica que los selectores sean estables

### 5. Error: "Playwright browsers not installed"

**Síntomas:**
```
Error: Executable doesn't exist
```

**Soluciones:**
- El workflow ya incluye `npx playwright install --with-deps`
- Si persiste, verifica que el paso se ejecute correctamente

### 6. Los reportes HTML no se generan

**Síntomas:**
- No aparece el artifact "playwright-report"

**Soluciones:**
- Verifica que el reporter esté configurado en `playwright.config.ts`:
  ```typescript
  reporter: process.env.CI 
    ? [['html'], ['list']]
    : 'html',
  ```
- Los reportes se generan en `playwright-report/` y se suben automáticamente

## Verificar el Estado del Workflow

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **"Actions"**
3. Selecciona el workflow que falló
4. Revisa cada paso para identificar dónde falló
5. Descarga los artifacts si están disponibles:
   - `playwright-report`: Reporte HTML completo
   - `playwright-traces`: Traces de tests fallidos
   - `playwright-screenshots`: Capturas de pantalla de errores

## Ejecutar el Workflow Manualmente

1. Ve a **Actions** > **Playwright Tests**
2. Haz clic en **"Run workflow"**
3. Selecciona la rama (generalmente `main`)
4. Haz clic en **"Run workflow"**

## Debugging Local

Para reproducir el entorno de CI localmente:

```bash
# Usar Docker para PostgreSQL
docker run --name postgres-test -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nutriapp -p 5432:5432 -d postgres:15

# Configurar variables de entorno
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nutriapp"
export CI=true
export BASE_URL="http://localhost:3000"

# Ejecutar migraciones
npx prisma generate
npx prisma migrate deploy

# Ejecutar tests
npm test
```

## Mejores Prácticas

1. **Siempre verifica los logs completos** en GitHub Actions
2. **Descarga los artifacts** cuando los tests fallen para análisis detallado
3. **Ejecuta los tests localmente** antes de hacer push
4. **Mantén las migraciones actualizadas** en el repositorio
5. **Revisa los reportes HTML** para entender mejor los fallos

## Contacto y Soporte

Si encuentras problemas que no están cubiertos aquí:
1. Revisa la documentación oficial de [Playwright CI](https://playwright.dev/docs/ci)
2. Revisa la documentación de [GitHub Actions](https://docs.github.com/en/actions)
3. Verifica los issues en el repositorio
