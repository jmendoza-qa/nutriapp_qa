import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../page-objects/RegisterPage';

test.describe('Registration Functionality', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test('should display registration form with all required fields', async ({ page }) => {
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.nationalityInput).toBeVisible();
    await expect(registerPage.phoneInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${timestamp}@nutriapp.com`,
      nationality: 'Chile',
      phone: '123456789',
      password: 'testpassword123',
    };

    await registerPage.register(userData);
    
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });

  test('should show error when registering with existing email', async ({ page }) => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@nutriapp.com',
      nationality: 'Chile',
      phone: '123456789',
      password: 'testpassword123',
    };

    await registerPage.register(userData);
    
    const errorMessage = await registerPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage?.toLowerCase()).toContain('email');
    
    await expect(page).toHaveURL(/.*\/register/);
  });

  test('should navigate to login page when clicking login link', async ({ page }) => {
    await registerPage.goToLogin();
    
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should require all form fields', async ({ page }) => {
    await expect(registerPage.firstNameInput).toHaveAttribute('required');
    await expect(registerPage.lastNameInput).toHaveAttribute('required');
    await expect(registerPage.emailInput).toHaveAttribute('required');
    await expect(registerPage.nationalityInput).toHaveAttribute('required');
    await expect(registerPage.phoneInput).toHaveAttribute('required');
    await expect(registerPage.passwordInput).toHaveAttribute('required');
  });
});
