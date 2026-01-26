import { test, expect } from '@playwright/test';
import { LoginPage, DishesPage } from '../page-objects/index.js';

test.describe('Auth - Functional (POM)', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
  });

  test('Login with valid credentials navigates to dishes and shows list', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('test@nutriapp.com', 'nutriapp123');
    await expect(page).toHaveURL(/\/dishes/);
    const dishes = new DishesPage(page);
    await expect(dishes.page.getByRole('heading', { level: 1, name: 'Sugerencias de Platillos' })).toBeVisible();
  });

  test('Shows validation when password missing (negative case)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.emailInput.fill('test@nutriapp.com');
    await login.submitButton.click();
    // Expect to remain on login page and see the prompt to login
    await expect(page.getByText('Inicia sesión para continuar')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});

