import { Page, Locator } from '@playwright/test';

export class NewDishPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly quickCheckbox: Locator;
  readonly prepSpin: Locator;
  readonly cookSpin: Locator;
  readonly caloriesSpin: Locator;
  readonly imageUrlInput: Locator;
  readonly addStepInput: Locator;
  readonly addStepButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByRole('textbox', { name: 'Ej: Ensalada de quinoa' });
    this.descriptionInput = page.getByPlaceholder('Describe el platillo, ingredientes principales, etc.');
    this.quickCheckbox = page.getByRole('checkbox', { name: 'Preparación rápida' });
    this.prepSpin = page.getByRole('spinbutton').nth(0);
    this.cookSpin = page.getByRole('spinbutton').nth(1);
    this.caloriesSpin = page.getByRole('spinbutton').nth(2);
    this.imageUrlInput = page.getByRole('textbox', { name: 'https://...' }).first();
    this.addStepInput = page.getByPlaceholder('Paso 1');
    this.addStepButton = page.getByRole('button', { name: '+ Agregar paso' });
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async goto() {
    await this.page.goto('/dishes/new');
  }

  async fillBasic(name: string, description: string) {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
  }

  async save() {
    await this.saveButton.click();
  }
}
