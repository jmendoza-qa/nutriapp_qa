import { Page, expect } from '@playwright/test';

export class ViewDishPage {
  constructor(public page: Page) {}

  readonly dishName = this.page.locator('h1, h2').first();
  readonly dishDescription = this.page.getByText(/descripción/i).or(this.page.locator('p'));

  async navigate(dishId: string) {
    await this.page.goto(`/dishes/${dishId}/view`);
  }

  async getDishName() {
    return await this.dishName.textContent();
  }

  async getDishDescription() {
    return await this.dishDescription.textContent();
  }

  // Methods for compatibility with DishDetailPage
  async expectLoaded() {
    await expect(this.dishName).toBeVisible({ timeout: 10000 });
  }

  async getTitleText() {
    return await this.dishName.textContent();
  }
}
