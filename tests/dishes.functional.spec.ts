import { test, expect } from '@playwright/test';
import { LoginPage, DishesPage, NewDishPage } from '../page-objects/index.js';

test.describe('Dishes - Functional (POM)', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.login('test@nutriapp.com', 'nutriapp123');
    await expect(page).toHaveURL(/\/dishes/);
  });

  test('Create a new dish and verify it appears in the list (happy path)', async ({ page }) => {
    const dishes = new DishesPage(page);
    await dishes.navigate();
    await dishes.goToNewDish();

    const newDish = new NewDishPage(page);
    const unique = `E2E Test Dish ${Date.now()}`;
    await newDish.fillBasicInfo(unique, 'Descripción de prueba creada por CI');
    await newDish.addStep('Paso de prueba 1', 0);
    await newDish.fillDetails(0, 0, 250);
    await newDish.submit();

    // After save, should redirect back to /dishes and the new heading should be visible
    await expect(page).toHaveURL(/\/dishes/);
    await expect(page.getByRole('heading', { level: 2, name: unique })).toBeVisible();
  });

  test('Create validation: missing name shows form still open', async ({ page }) => {
    const dishes = new DishesPage(page);
    await dishes.navigate();
    await dishes.goToNewDish();

    const newDish = new NewDishPage(page);
    await newDish.descriptionInput.fill('Solo descripción, sin nombre');
    await newDish.submit();

    // Should still be on the new page and show the heading
    await expect(page.getByRole('heading', { level: 1, name: 'Agregar Platillo' })).toBeVisible();
  });
});
