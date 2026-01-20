import { test, expect } from '@playwright/test';
import { NewDishPage } from '../../pages/NewDishPage';
import { loginViaAPI } from '../helpers/auth';

test.describe('Form Validation', () => {
  let newDishPage: NewDishPage;

  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
    newDishPage = new NewDishPage(page);
    await newDishPage.navigate();
  });

  test('should require dish name field', async ({ page }) => {
    await expect(newDishPage.nameInput).toHaveAttribute('required');
  });

  test('should require description field', async ({ page }) => {
    await expect(newDishPage.descriptionInput).toHaveAttribute('required');
  });

  test('should require prep time field', async ({ page }) => {
    await expect(newDishPage.prepTimeInput).toHaveAttribute('required');
  });

  test('should require cook time field', async ({ page }) => {
    await expect(newDishPage.cookTimeInput).toHaveAttribute('required');
  });

  test('should require at least one preparation step', async ({ page }) => {
    const firstStepInput = page.locator('input[placeholder="Paso 1"]');
    await expect(firstStepInput).toHaveAttribute('required');
  });

  test('should allow adding multiple preparation steps', async ({ page }) => {
    await newDishPage.addStep('First step', 0);
    await newDishPage.addAdditionalStep();
    
    const secondStepInput = page.locator('input[placeholder="Paso 2"]');
    await expect(secondStepInput).toBeVisible();
  });
});
