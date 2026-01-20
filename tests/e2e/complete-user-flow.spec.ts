import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage.js';
import { LoginPage } from '../../page-objects/LoginPage.js';
import { DishesPage } from '../../page-objects/DishesPage.js';
import { NewDishPage } from '../../page-objects/NewDishPage.js';
import { loginViaAPI } from '../helpers/auth';

test.describe('End-to-End: Complete User Flow', () => {
  test('should complete full user journey: home → login → view dishes → create dish', async ({ page }) => {
    // Step 1: Start at home page
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(homePage.welcomeHeading).toBeVisible();

    // Step 2: Navigate to login from home
    await homePage.goToLogin();
    await expect(page).toHaveURL(/.*\/login/);

    // Step 3: Login with test credentials (using API helper for reliability)
    await loginViaAPI(page, 'test@nutriapp.com', 'nutriapp123');

    // Step 4: Verify redirect to dishes page
    await expect(page).toHaveURL(/.*\/dishes/);

    // Step 5: Verify dishes page is displayed
    const dishesPage = new DishesPage(page);
    await expect(dishesPage.heading).toBeVisible();
    await expect(dishesPage.addDishButton).toBeVisible();

    // Step 6: Navigate to create new dish
    await dishesPage.goToNewDish();
    await expect(page).toHaveURL(/.*\/dishes\/new/);

    // Step 7: Create a new dish
    const newDishPage = new NewDishPage(page);
    const dishData = {
      name: `Complete Flow Dish ${Date.now()}`,
      description: 'Created during complete user flow test',
      quickPrep: false,
      prepTime: 20,
      cookTime: 30,
      calories: 400,
      steps: ['Complete all steps', 'Verify the flow'],
    };

    await newDishPage.createDish(dishData);

    // Step 8: Verify redirect back to dishes list
    await expect(page).toHaveURL(/.*\/dishes/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await expect(dishesPage.heading).toBeVisible({ timeout: 5000 });
  });
});
