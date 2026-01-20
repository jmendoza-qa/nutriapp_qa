import { test, expect } from '@playwright/test';
import { LoginPage, DishesPage, NewDishPage } from '../page-objects';

test.describe('Dishes - Functional (POM)', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('test@nutriapp.com', 'nutriapp123');
    await expect(page).toHaveURL(/\/dishes/);
  });

  test('Create a new dish and verify it appears in the list (happy path)', async ({ page }) => {
    const dishes = new DishesPage(page);
    await dishes.goto();
    await dishes.clickAddDish();

    const newDish = new NewDishPage(page);
    const unique = `E2E Test Dish ${Date.now()}`;
    await newDish.fillBasic(unique, 'Descripción de prueba creada por CI');
    await newDish.addStepInput.fill('Paso de prueba 1');
    await newDish.addStepButton.click();
    await newDish.caloriesSpin.fill('250');
    await newDish.save();

    // After save, should redirect back to /dishes and the new heading should be visible
    await expect(page).toHaveURL(/\/dishes/);
    await expect(page.getByRole('heading', { level: 2, name: unique })).toBeVisible();
  });

  test('Create validation: missing name shows form still open', async ({ page }) => {
    const dishes = new DishesPage(page);
    await dishes.goto();
    await dishes.clickAddDish();

    const newDish = new NewDishPage(page);
    await newDish.descriptionInput.fill('Solo descripción, sin nombre');
    await newDish.save();

    // Should still be on the new page and show the heading
    await expect(page.getByRole('heading', { level: 1, name: 'Agregar Platillo' })).toBeVisible();
  });
});
