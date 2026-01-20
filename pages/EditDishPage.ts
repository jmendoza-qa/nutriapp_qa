import { Page } from '@playwright/test';
import { DishFormData } from './NewDishPage';

export class EditDishPage {
  constructor(private page: Page) {}

  readonly nameInput = this.page.getByLabel('Nombre').or(this.page.locator('input[name="name"]'));
  readonly descriptionInput = this.page.getByLabel('Descripción').or(this.page.locator('textarea[name="description"]'));
  readonly quickPrepCheckbox = this.page.getByLabel('Preparación rápida').or(this.page.locator('input[name="quickPrep"]'));
  readonly prepTimeInput = this.page.getByLabel('Min. preparación').or(this.page.locator('input[name="prepTime"]'));
  readonly cookTimeInput = this.page.getByLabel('Min. cocción').or(this.page.locator('input[name="cookTime"]'));
  readonly caloriesInput = this.page.getByLabel('Calorías totales').or(this.page.locator('input[name="calories"]'));
  readonly imageUrlInput = this.page.getByLabel('URL de imagen').or(this.page.locator('input[name="imageUrl"]'));
  readonly submitButton = this.page.getByRole('button', { name: /Guardar/i });
  readonly errorMessage = this.page.locator('p.text-red-500');

  async navigate(dishId: string) {
    await this.page.goto(`/dishes/${dishId}`);
  }

  async updateName(name: string) {
    await this.nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.nameInput.fill('');
    await this.nameInput.fill(name);
  }

  async updateDescription(description: string) {
    await this.descriptionInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.descriptionInput.fill('');
    await this.descriptionInput.fill(description);
  }

  async updatePrepTime(prepTime: number) {
    await this.prepTimeInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.prepTimeInput.fill('');
    await this.prepTimeInput.fill(prepTime.toString());
  }

  async updateCookTime(cookTime: number) {
    await this.cookTimeInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.cookTimeInput.fill('');
    await this.cookTimeInput.fill(cookTime.toString());
  }

  async updateForm(data: Partial<DishFormData>) {
    if (data.name) await this.updateName(data.name);
    if (data.description) await this.updateDescription(data.description);
    if (data.prepTime !== undefined) await this.updatePrepTime(data.prepTime);
    if (data.cookTime !== undefined) await this.updateCookTime(data.cookTime);
    if (data.quickPrep !== undefined) {
      if (data.quickPrep) {
        await this.quickPrepCheckbox.check();
      } else {
        await this.quickPrepCheckbox.uncheck();
      }
    }
    if (data.calories !== undefined) {
      await this.caloriesInput.clear();
      await this.caloriesInput.fill(data.calories.toString());
    }
    if (data.imageUrl) {
      await this.imageUrlInput.clear();
      await this.imageUrlInput.fill(data.imageUrl);
    }
  }

  async save() {
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
