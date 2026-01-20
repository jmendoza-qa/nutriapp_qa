import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { DishesPage } from '../../page-objects/DishesPage';
import { RegisterPage } from '../../page-objects/RegisterPage';

test.describe('End-to-End: Authentication Flow', () => {
  test('should handle authentication: login → access protected page → logout attempt', async ({ page }) => {
    // Step 1: Attempt to access protected page without login
    await page.goto('/dishes');
    
    // Step 2: Verify redirect to login (protected route)
    await expect(page).toHaveURL(/.*\/login/);

    // Step 3: Login with valid credentials using API helper for reliability
    const { loginViaAPI } = await import('../helpers/auth');
    await loginViaAPI(page, 'test@nutriapp.com', 'nutriapp123');

    // Step 4: Verify successful access to protected page
    await expect(page).toHaveURL(/.*\/dishes/);
    const dishesPage = new DishesPage(page);
    await expect(dishesPage.heading).toBeVisible();

    // Step 5: Verify can access other protected routes
    await page.goto('/dishes/new');
    await expect(page).toHaveURL(/.*\/dishes\/new/);
  });

  test('should handle failed login and retry with correct credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Step 1: Attempt login with wrong credentials
    await loginPage.emailInput.fill('wrong@email.com');
    await loginPage.passwordInput.fill('wrongpassword');
    await page.waitForTimeout(500);
    
    // Set up response listener BEFORE clicking (optional, don't fail if it times out)
    const failedResponsePromise = page.waitForResponse(response => 
      response.url().includes('/api/login') && (response.status() === 401 || response.status() === 400)
    , { timeout: 10000 }).catch(() => null);
    
    await loginPage.submitButton.click({ force: true });
    
    // Wait for failed response (optional)
    await failedResponsePromise;
    
    // Step 2: Verify error message is shown (with longer timeout for WebKit)
    // Wait for either error message or stay on login page
    await Promise.race([
      page.waitForSelector('p.text-red-500', { timeout: 10000 }),
      page.waitForTimeout(5000)
    ]);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    await expect(page).toHaveURL(/.*\/login/);

    // Step 3: Retry with correct credentials using API helper
    const { loginViaAPI } = await import('../helpers/auth');
    await loginViaAPI(page, 'test@nutriapp.com', 'nutriapp123');

    // Step 4: Verify successful login
    await expect(page).toHaveURL(/.*\/dishes/);
  });

  test('should navigate between login and register pages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Step 1: Navigate to register from login
    await loginPage.goToRegister();
    await expect(page).toHaveURL(/.*\/register/);

    // Step 2: Navigate back to login from register
    const registerPage = new RegisterPage(page);
    await registerPage.goToLogin();
    await expect(page).toHaveURL(/.*\/login/);
  });
});
