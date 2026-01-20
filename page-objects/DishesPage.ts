import { Page } from '@playwright/test';

export class DishesPage {
  constructor(private page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: /Sugerencias de Platillos/i });
  readonly addDishButton = this.page.getByRole('link', { name: /Agregar Platillo/i });
  readonly dishesGrid = this.page.locator('div.shadow-lg');
  readonly emptyStateMessage = this.page.getByText(/No hay platillos registrados/i);

  async navigate() {
    await this.page.goto('/dishes');
  }

  async goToNewDish() {
    await this.addDishButton.click();
  }

  async getDishCards() {
    return await this.dishesGrid.all();
  }

  async getDishCard(index: number) {
    const cards = await this.getDishCards();
    return cards[index];
  }

  async clickViewDish(index: number) {
    const card = await this.getDishCard(index);
    const viewButton = card.getByRole('link', { name: /Ver/i });
    await viewButton.click();
  }

  async clickEditDish(index: number) {
    const card = await this.getDishCard(index);
    const editButton = card.getByRole('link', { name: /Editar/i });
    await editButton.click();
  }

  async clickDeleteDish(index: number) {
    const card = await this.getDishCard(index);
    const deleteButton = card.getByRole('button', { name: /Eliminar/i });
    await deleteButton.click();
  }

  async getDishName(index: number) {
    const card = await this.getDishCard(index);
    return await card.locator('h2').textContent();
  }
}
