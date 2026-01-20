import { Page, Locator, expect } from '@playwright/test';

export class DishDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly calories: Locator;
  readonly stepsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 2 });
    this.calories = page.locator('text=kcal').first();
    this.stepsList = page.locator('ol, ul').first();
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
  }

  async getTitleText() {
    return this.title.textContent();
  }

  async getSteps() {
    return this.stepsList.locator('li').allTextContents();
  }
}
