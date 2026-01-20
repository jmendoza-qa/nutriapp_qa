import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: /Bienvenido/i });
  readonly emailInput = this.page.getByLabel('Email').or(this.page.locator('input[name="email"]'));
  readonly passwordInput = this.page.getByLabel('Contraseña').or(this.page.locator('input[name="password"]'));
  readonly submitButton = this.page.getByRole('button', { name: /Iniciar sesión/i });
  readonly registerLink = this.page.getByRole('link', { name: /Regístrate/i });
  readonly errorMessage = this.page.locator('p.text-red-500');

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Wait for API response (can be 200 for success or 401/400 for failure)
    const responsePromise = this.page.waitForResponse(response => 
      response.url().includes('/api/login')
    );
    
    // Wait for any overlays to disappear before clicking
    await this.page.waitForTimeout(500);
    
    // Click and wait for response
    await Promise.all([
      responsePromise,
      this.submitButton.click({ force: true })
    ]);
    
    const response = await responsePromise;
    
    // Only wait for navigation if login was successful
    if (response.status() === 200) {
      await this.page.waitForURL(/.*\/dishes/, { timeout: 15000 });
    }
    // If login failed, we stay on login page (no navigation)
  }

  async goToRegister() {
    await this.registerLink.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.errorMessage.textContent();
  }
}
