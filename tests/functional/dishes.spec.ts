import { test, expect } from '@playwright/test';
import { DishesPage } from '../../page-objects/DishesPage.js';
import { NewDishPage } from '../../page-objects/NewDishPage.js';
import { EditDishPage } from '../../page-objects/EditDishPage.js';
import { ViewDishPage } from '../../page-objects/ViewDishPage.js';
import { loginViaAPI } from '../helpers/auth';

test.describe('Dishes Management Functionality', () => {
  let dishesPage: DishesPage;
  let newDishPage: NewDishPage;

  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
    dishesPage = new DishesPage(page);
    newDishPage = new NewDishPage(page);
    await dishesPage.navigate();
  });

  test('should display dishes list page with heading and add button', async ({ page }) => {
    await expect(dishesPage.heading).toBeVisible();
    await expect(dishesPage.addDishButton).toBeVisible();
  });

  test('should navigate to new dish page when clicking add button', async ({ page }) => {
    await dishesPage.goToNewDish();
    
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    await expect(newDishPage.heading).toBeVisible();
  });

  test('should create a new dish successfully', async ({ page }) => {
    await dishesPage.goToNewDish();
    
    const dishData = {
      name: `Test Dish ${Date.now()}`,
      description: 'A test dish description',
      quickPrep: true,
      prepTime: 10,
      cookTime: 15,
      calories: 300,
      steps: ['Step 1: Prepare ingredients', 'Step 2: Cook the dish'],
    };

    await newDishPage.createDish(dishData);
    
    await expect(page).toHaveURL(/.*\/dishes/, { timeout: 10000 });
    // Wait for page to fully load before checking heading
    await page.waitForLoadState('networkidle');
    await expect(dishesPage.heading).toBeVisible({ timeout: 5000 });
  });

  test('should display dish cards in the list', async ({ page }) => {
    const cards = await dishesPage.getDishCards();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('should view dish details', async ({ page }) => {
    const cards = await dishesPage.getDishCards();
    if (cards.length > 0) {
      await dishesPage.clickViewDish(0);
      await expect(page).toHaveURL(/.*\/dishes\/\d+\/view/);
    }
  });

  test('should navigate to edit dish page', async ({ page }) => {
    const cards = await dishesPage.getDishCards();
    if (cards.length > 0) {
      await dishesPage.clickEditDish(0);
      await expect(page).toHaveURL(/.*\/dishes\/\d+/);
    }
  });

  test('should edit dish successfully', async ({ page }) => {
    const cards = await dishesPage.getDishCards();
    if (cards.length > 0) {
      await dishesPage.clickEditDish(0);
      
      // Wait for edit page to load
      await page.waitForLoadState('networkidle');
      
      const editDishPage = new EditDishPage(page);
      // Wait for the input to be visible before clearing
      await editDishPage.nameInput.waitFor({ state: 'visible', timeout: 10000 });
      await editDishPage.updateName(`Updated Dish ${Date.now()}`);
      await editDishPage.save();
      
      await expect(page).toHaveURL(/.*\/dishes/, { timeout: 10000 });
    }
  });

  test('should delete a dish', async ({ page }) => {
    const initialCards = await dishesPage.getDishCards();
    const initialCount = initialCards.length;
    
    if (initialCount > 0) {
      // Get the dish name before deleting to verify it's removed
      const dishName = await dishesPage.getDishName(0);
      
      await dishesPage.clickDeleteDish(0);
      
      // Wait for the deletion to complete and page to update
      await page.waitForTimeout(2000);
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const finalCards = await dishesPage.getDishCards();
      // Verify either count decreased or the dish name is no longer present
      if (finalCards.length === initialCount) {
        // If count is same, verify the dish was actually removed by checking names
        const remainingNames = await Promise.all(
          finalCards.map(async (_, idx) => await dishesPage.getDishName(idx))
        );
        expect(remainingNames).not.toContain(dishName);
      } else {
        expect(finalCards.length).toBeLessThan(initialCount);
      }
    }
  });
});
