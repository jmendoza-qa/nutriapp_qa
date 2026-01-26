import { test, expect } from '@playwright/test';
import { loginViaAPI } from './helpers/auth';

test.describe('Dishes Management', () => {
  // Helper function para hacer login antes de las pruebas
  async function login(page: any) {
    await loginViaAPI(page);
    await expect(page).toHaveURL(/.*\/dishes/);
  }

  test('should display dishes list after login', async ({ page }) => {
    await login(page);

    // Verificar que estamos en la página de platos
    await expect(page).toHaveURL(/.*\/dishes/);
    
    // Verificar que el título de la página está visible
    await expect(page.getByRole('heading', { name: /Sugerencias de Platillos/i })).toBeVisible();
    
    // Verificar que hay al menos un plato en la lista (los platos están en divs con shadow-lg)
    const dishesList = page.locator('div.shadow-lg').first();
    await expect(dishesList).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to create new dish page', async ({ page }) => {
    await login(page);

    // Buscar y hacer clic en el botón para crear un nuevo plato
    const newDishButton = page.getByRole('link', { name: /Agregar Platillo/i });
    
    await Promise.all([
      page.waitForURL(/.*\/dishes\/new/, { timeout: 10000 }),
      newDishButton.click()
    ]);
    
    await expect(page).toHaveURL(/.*\/dishes\/new/);
  });

  test('should create a new dish', async ({ page }) => {
    await login(page);
    await page.goto('/dishes/new');
    await page.waitForLoadState('networkidle');

    // Llenar el formulario de nuevo plato
    await page.fill('input[name="name"]', 'Plato de Prueba');
    await page.fill('textarea[name="description"]', 'Descripción del plato de prueba');
    await page.fill('input[name="prepTime"]', '15');
    await page.fill('input[name="cookTime"]', '30');
    
    // Llenar el primer paso de preparación
    await page.fill('input[placeholder="Paso 1"]', 'Paso de preparación de prueba');
    
    // Set up response and URL listeners BEFORE clicking
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/dishes') && response.method() === 'POST' && response.status() === 200
    );
    const urlPromise = page.waitForURL(/.*\/dishes/, { timeout: 15000 });
    
    // Click the submit button to trigger the request
    await page.click('button[type="submit"]');
    
    // Wait for both the API response and navigation
    await Promise.all([responsePromise, urlPromise]);

    // Verificar que se redirige a la lista de platos
    await expect(page).toHaveURL(/.*\/dishes/);
  });

  test('should view dish details', async ({ page }) => {
    await login(page);

    // Esperar a que los platos se carguen
    await page.waitForSelector('div.shadow-lg', { timeout: 5000 });
    
    // Hacer clic en el botón "Ver" del primer plato
    const viewButton = page.getByRole('link', { name: /Ver/i }).first();
    
    await Promise.all([
      page.waitForURL(/.*\/dishes\/\d+\/view/, { timeout: 10000 }),
      viewButton.click()
    ]);

    // Verificar que estamos en la página de detalles
    await expect(page).toHaveURL(/.*\/dishes\/\d+\/view/);
  });
});

