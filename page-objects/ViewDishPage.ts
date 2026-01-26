import { Page, expect } from '@playwright/test';

export class ViewDishPage {
  constructor(public page: Page) {}

  // More specific selector: h2 inside the detail card container
  // This selector targets the h2 that is inside the white card container in the detail view
  readonly dishName = this.page.locator('div.bg-white.rounded-2xl.shadow-lg h2.font-extrabold.text-3xl');
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
    // First, ensure we're on the correct URL
    await this.page.waitForURL(/\/dishes\/\d+\/view/, { timeout: 10000 });
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    // Then wait for the specific dish name element to be visible
    await expect(this.dishName).toBeVisible({ timeout: 10000 });
  }

  async getTitleText() {
    // Ensure we're on the detail page before getting text
    await this.page.waitForURL(/\/dishes\/\d+\/view/, { timeout: 5000 }).catch(() => {});
    return await this.dishName.textContent();
  }
}
