import { Page, Locator } from '@playwright/test';

export class DishesPage {
  readonly page: Page;
  readonly addDishLink: Locator;
  readonly dishHeadings: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addDishLink = page.getByRole('link', { name: '+ Agregar Platillo' });
    this.dishHeadings = page.getByRole('heading', { level: 2 });
  }

  async goto() {
    await this.page.goto('/dishes');
  }

  async clickAddDish() {
    await this.addDishLink.click();
  }

  async openDishByName(name: string) {
    const link = this.page.getByRole('link', { name: 'Ver' }).filter({ hasText: name });
    if (await link.count() > 0) {
      await link.first().click();
      return;
    }
    // fallback: click the first "Ver" link
    await this.page.getByRole('link', { name: 'Ver' }).first().click();
  }
}
