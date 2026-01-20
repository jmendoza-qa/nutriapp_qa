import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  readonly welcomeHeading = this.page.getByRole('heading', { name: /Welcome to NutriApp!/i });
  readonly goToLoginLink = this.page.getByRole('link', { name: /Go to Login/i });
  readonly testEmailDisplay = this.page.getByText('test@nutriapp.com');
  readonly testPasswordDisplay = this.page.getByText('nutriapp123');

  async navigate() {
    await this.page.goto('/');
  }

  async goToLogin() {
    await this.goToLoginLink.click();
  }
}
