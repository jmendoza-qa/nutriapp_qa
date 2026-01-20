import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login form with all required elements', async ({ page }) => {
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await loginPage.login('test@nutriapp.com', 'nutriapp123');
    
    await expect(page).toHaveURL(/.*\/dishes/, { timeout: 10000 });
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@test.com', 'wrongpassword');
    
    // Wait for error message to appear
    await page.waitForSelector('p.text-red-500', { timeout: 5000 });
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    // The error message can be in English or Spanish
    expect(errorMessage?.toLowerCase()).toMatch(/invalid|incorrectas|credenciales/i);
    
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should navigate to register page when clicking register link', async ({ page }) => {
    await loginPage.goToRegister();
    
    await expect(page).toHaveURL(/.*\/register/);
  });

  test('should require email and password fields', async ({ page }) => {
    const emailInput = loginPage.emailInput;
    const passwordInput = loginPage.passwordInput;
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });
});
