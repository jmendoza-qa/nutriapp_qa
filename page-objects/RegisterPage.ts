import { Page } from '@playwright/test';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  phone: string;
  password: string;
}

export class RegisterPage {
  constructor(private page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: /Crear cuenta/i });
  readonly firstNameInput = this.page.getByLabel('Nombre').or(this.page.locator('input[name="firstName"]'));
  readonly lastNameInput = this.page.getByLabel('Apellido').or(this.page.locator('input[name="lastName"]'));
  readonly emailInput = this.page.getByLabel('Email').or(this.page.locator('input[name="email"]'));
  readonly nationalityInput = this.page.getByLabel('Nacionalidad').or(this.page.locator('input[name="nationality"]'));
  readonly phoneInput = this.page.getByLabel('Celular').or(this.page.locator('input[name="phone"]'));
  readonly passwordInput = this.page.getByLabel('Contraseña').or(this.page.locator('input[name="password"]'));
  readonly submitButton = this.page.getByRole('button', { name: /Registrarse/i });
  readonly loginLink = this.page.getByRole('link', { name: /Inicia sesión/i });
  readonly errorMessage = this.page.locator('p.text-red-500');

  async navigate() {
    await this.page.goto('/register');
  }

  async fillForm(data: RegisterFormData) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.nationalityInput.fill(data.nationality);
    await this.phoneInput.fill(data.phone);
    await this.passwordInput.fill(data.password);
  }

  async submit() {
    // Wait for any overlays to disappear before clicking
    await this.page.waitForTimeout(500);
    
    // Set up response listener BEFORE clicking (with longer timeout for WebKit)
    // Don't fail if response doesn't come - rely on navigation instead
    const responsePromise = this.page.waitForResponse(response => 
      response.url().includes('/api/register')
    , { timeout: 15000 }).catch(() => null);
    
    // Click the submit button
    await this.submitButton.click({ force: true });
    
    // Wait for API response (optional)
    const response = await responsePromise;
    
    // Wait for navigation to login page (this is the reliable indicator of success)
    // If response was successful OR if we just navigate, that's fine
    try {
      await this.page.waitForURL(/.*\/login/, { timeout: 20000 });
    } catch (error) {
      // If navigation doesn't happen, check if there was an error
      if (response && response.status() !== 200) {
        // Registration failed, stay on register page
        return;
      }
      // Check if page is still open before waiting
      if (this.page.isClosed()) {
        throw error;
      }
      // Otherwise, wait a bit more and check URL again
      try {
        await this.page.waitForTimeout(2000);
        const currentUrl = this.page.url();
        if (!currentUrl.includes('/login')) {
          throw new Error('Registration did not redirect to login page');
        }
      } catch (timeoutError) {
        // If page closed during wait, re-throw original error
        if (this.page.isClosed()) {
          throw error;
        }
        throw timeoutError;
      }
    }
  }

  async register(data: RegisterFormData) {
    await this.fillForm(data);
    await this.submit();
  }

  async goToLogin() {
    // Wait for any overlays to disappear before clicking
    await this.page.waitForTimeout(500);
    await this.loginLink.click({ force: true });
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.errorMessage.textContent();
  }
}
