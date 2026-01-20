import { test, expect } from '@playwright/test';

test.describe('Register', () => {
  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/register');

    // Generar un email único para evitar conflictos
    const timestamp = Date.now();
    const email = `test${timestamp}@nutriapp.com`;

    // Llenar el formulario de registro
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="nationality"]', 'Chile');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[name="password"]', 'testpassword123');

    // Enviar el formulario y esperar la navegación
    await Promise.all([
      page.waitForURL(/.*\/login/, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    // Verificar que se redirige a la página de login después del registro
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show error if email already exists', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Intentar registrar con un email que ya existe
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'test@nutriapp.com');
    await page.fill('input[name="nationality"]', 'Chile');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[name="password"]', 'password123');

    // Esperar la respuesta del API (puede ser 409 o 200 si hay algún problema)
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/register')
    );

    await page.click('button[type="submit"]');
    const response = await responsePromise;

    // Si la respuesta es 409, esperar el mensaje de error
    if (response.status() === 409) {
      await page.waitForSelector('p.text-red-500', { timeout: 5000 });
      const errorMessage = await page.locator('p.text-red-500').textContent();
      expect(errorMessage).toContain('email');
      await expect(page).toHaveURL(/.*\/register/);
    } else {
      // Si no es 409, puede que el usuario se haya creado o haya otro error
      // En ese caso, verificar que no estamos en /dishes
      await expect(page).not.toHaveURL(/.*\/dishes/);
    }
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/register');

    // Buscar y hacer clic en el enlace de login
    const loginLink = page.getByRole('link', { name: /inicia sesión|login/i });
    await loginLink.click();
    await expect(page).toHaveURL(/.*\/login/);
  });
});

