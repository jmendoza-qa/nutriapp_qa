import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../page-objects/RegisterPage.js';
import { LoginPage } from '../../page-objects/LoginPage.js';
import { DishesPage } from '../../page-objects/DishesPage.js';

test.describe('End-to-End: User Registration Journey', () => {
  test('should complete full registration flow: register → login → view dishes', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      firstName: 'E2E',
      lastName: 'Test',
      email: `e2e${timestamp}@nutriapp.com`,
      nationality: 'Chile',
      phone: '987654321',
      password: 'e2epassword123',
    };

    // Step 1: Register new user
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    
    // Register (the submit method already handles response and navigation)
    await registerPage.register(userData);

    // Step 2: Verify redirect to login (already handled in register method)
    await expect(page).toHaveURL(/.*\/login/);

    // Step 3: Login with new credentials using API helper for reliability
    const { loginViaAPI } = await import('../helpers/auth');
    await loginViaAPI(page, userData.email, userData.password);

    // Step 4: Verify redirect to dishes page
    await expect(page).toHaveURL(/.*\/dishes/);

    // Step 5: Verify dishes page is displayed
    const dishesPage = new DishesPage(page);
    await expect(dishesPage.heading).toBeVisible();
  });
});
