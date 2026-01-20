import { Page } from '@playwright/test';

export interface DishFormData {
  name: string;
  description: string;
  quickPrep?: boolean;
  prepTime: number;
  cookTime: number;
  calories?: number;
  imageUrl?: string;
  steps: string[];
}

export class NewDishPage {
  constructor(private page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: /Agregar Platillo/i });
  readonly nameInput = this.page.getByLabel('Nombre').or(this.page.locator('input[name="name"]'));
  readonly descriptionInput = this.page.getByLabel('Descripción').or(this.page.locator('textarea[name="description"]'));
  readonly quickPrepCheckbox = this.page.getByLabel('Preparación rápida').or(this.page.locator('input[name="quickPrep"]'));
  readonly prepTimeInput = this.page.getByLabel('Min. preparación').or(this.page.locator('input[name="prepTime"]'));
  readonly cookTimeInput = this.page.getByLabel('Min. cocción').or(this.page.locator('input[name="cookTime"]'));
  readonly caloriesInput = this.page.getByLabel('Calorías totales').or(this.page.locator('input[name="calories"]'));
  readonly imageUrlInput = this.page.getByLabel('URL de imagen').or(this.page.locator('input[name="imageUrl"]'));
  readonly submitButton = this.page.getByRole('button', { name: /Guardar/i });
  readonly addStepButton = this.page.getByRole('button', { name: /Agregar paso/i });
  readonly errorMessage = this.page.locator('p.text-red-500');

  async navigate() {
    await this.page.goto('/dishes/new');
  }

  async fillBasicInfo(name: string, description: string, quickPrep: boolean = false) {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
    if (quickPrep) {
      await this.quickPrepCheckbox.check();
    }
  }

  async fillDetails(prepTime: number, cookTime: number, calories?: number, imageUrl?: string) {
    await this.prepTimeInput.fill(prepTime.toString());
    await this.cookTimeInput.fill(cookTime.toString());
    if (calories !== undefined) {
      await this.caloriesInput.fill(calories.toString());
    }
    if (imageUrl) {
      await this.imageUrlInput.fill(imageUrl);
    }
  }

  async addStep(stepText: string, index: number = 0) {
    const stepInput = this.page.locator(`input[placeholder="Paso ${index + 1}"]`);
    await stepInput.fill(stepText);
  }

  async addAdditionalStep() {
    await this.addStepButton.click();
  }

  async fillSteps(steps: string[]) {
    for (let i = 0; i < steps.length; i++) {
      if (i > 0) {
        await this.addAdditionalStep();
      }
      await this.addStep(steps[i], i);
    }
  }

  async fillForm(data: DishFormData) {
    await this.fillBasicInfo(data.name, data.description, data.quickPrep || false);
    await this.fillDetails(data.prepTime, data.cookTime, data.calories, data.imageUrl);
    await this.fillSteps(data.steps);
  }

  async submit() {
    await this.submitButton.click();
  }

  async createDish(data: DishFormData) {
    await this.fillForm(data);
    await this.submit();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
