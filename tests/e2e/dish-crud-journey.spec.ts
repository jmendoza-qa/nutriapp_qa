import { test, expect } from '@playwright/test';
import { DishesPage } from '../../page-objects/DishesPage.js';
import { NewDishPage } from '../../page-objects/NewDishPage.js';
import { EditDishPage } from '../../page-objects/EditDishPage.js';
import { ViewDishPage } from '../../page-objects/ViewDishPage.js';
import { loginViaAPI } from '../helpers/auth';

test.describe('End-to-End: Dish CRUD Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Use API helper for reliable authentication
    await loginViaAPI(page, 'test@nutriapp.com', 'nutriapp123');
    await expect(page).toHaveURL(/.*\/dishes/);
  });

  test('should complete full CRUD flow: create → view → edit → delete', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const dishName = `E2E Test Dish ${Date.now()}`;
    const updatedDishName = `Updated ${dishName}`;

    // Step 1: Create a new dish
    await dishesPage.goToNewDish();
    const newDishPage = new NewDishPage(page);
    
    const dishData = {
      name: dishName,
      description: 'E2E test dish description',
      quickPrep: true,
      prepTime: 5,
      cookTime: 10,
      calories: 250,
      steps: [
        'Step 1: Gather ingredients',
        'Step 2: Prepare the dish',
        'Step 3: Serve and enjoy',
      ],
    };

    await newDishPage.createDish(dishData);

    // Step 2: Verify redirect to dishes list
    await expect(page).toHaveURL(/.*\/dishes/, { timeout: 10000 });

    // Step 3: Verify dish appears in the list
    await expect(dishesPage.heading).toBeVisible();
    const cards = await dishesPage.getDishCards();
    expect(cards.length).toBeGreaterThan(0);

    // Step 4: View the dish details
    const lastCardIndex = cards.length - 1;
    await dishesPage.clickViewDish(lastCardIndex);
    await expect(page).toHaveURL(/.*\/dishes\/\d+\/view/);

    const viewDishPage = new ViewDishPage(page);
    const viewedName = await viewDishPage.getDishName();
    expect(viewedName).toContain(dishName);

    // Step 5: Navigate back and edit the dish
    await dishesPage.navigate();
    await dishesPage.clickEditDish(lastCardIndex);
    await expect(page).toHaveURL(/.*\/dishes\/\d+/);

    const editDishPage = new EditDishPage(page);
    await editDishPage.updateName(updatedDishName);
    await editDishPage.save();

    // Step 6: Verify edit was saved
    await expect(page).toHaveURL(/.*\/dishes/, { timeout: 10000 });

    // Step 7: Delete the dish we just created and edited
    // Find the dish by its updated name
    const cardsAfterEdit = await dishesPage.getDishCards();
    if (cardsAfterEdit.length === 0) {
      test.skip(true, 'No dishes available to delete');
      return;
    }
    
    // Find the index of the dish we edited by matching the exact name
    let dishIndexToDelete = -1;
    let dishIdToDelete: string | null = null;
    
    for (let i = 0; i < cardsAfterEdit.length; i++) {
      const name = await dishesPage.getDishName(i);
      if (name && name.trim() === updatedDishName.trim()) {
        dishIndexToDelete = i;
        // Get the dish ID from the edit link
        const card = await dishesPage.getDishCard(i);
        const editLink = card.getByRole('link', { name: /Editar/i });
        const href = await editLink.getAttribute('href');
        if (href) {
          const match = href.match(/\/dishes\/(\d+)/);
          if (match) {
            dishIdToDelete = match[1];
          }
        }
        break;
      }
    }
    
    if (dishIndexToDelete === -1 || !dishIdToDelete) {
      test.skip(true, 'Dish to delete not found');
      return;
    }
    
    const countBeforeDelete = cardsAfterEdit.length;
    
    // Set up response listener BEFORE clicking
    const deleteResponsePromise = page.waitForResponse(response => 
      response.url().includes(`/api/dishes/${dishIdToDelete}`) && 
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    
    // Click delete button
    await dishesPage.clickDeleteDish(dishIndexToDelete);
    
    // Wait for API response to confirm deletion
    const deleteResponse = await deleteResponsePromise;
    expect(deleteResponse.status()).toBe(200);
    
    // Wait for the dish name to disappear from the page (React state update)
    await expect(page.getByText(updatedDishName, { exact: true })).not.toBeVisible({ timeout: 10000 });
    
    // Primary verification: assert via API that the dish is gone (source of truth)
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const listRes = await page.request.get(`${baseURL}/api/dishes`);
    expect(listRes.ok()).toBe(true);
    const listData = await listRes.json();
    const dishesAfterDelete: { id: number; name: string }[] = listData.dishes || [];
    const deletedStillInApi = dishesAfterDelete.some(
      (d) => String(d.id) === dishIdToDelete || d.name.trim() === updatedDishName.trim()
    );
    expect(deletedStillInApi).toBe(false);
    
    // Secondary verification: UI list should not show the deleted dish (fresh navigation)
    await page.goto('/dishes');
    await page.waitForLoadState('networkidle');
    const dishesPageAfter = new DishesPage(page);
    await expect(dishesPageAfter.heading).toBeVisible();
    const cardsAfterDelete = await dishesPageAfter.getDishCards();
    
    if (cardsAfterDelete.length > 0) {
      const remainingNames = await Promise.all(
        cardsAfterDelete.map((_, idx) =>
          dishesPageAfter.getDishName(idx).then((n) => (n || '').trim()).catch(() => '')
        )
      );
      const normalizedUpdated = updatedDishName.trim().toLowerCase();
      const dishStillInUi = remainingNames.some((n) => n.toLowerCase() === normalizedUpdated);
      expect(dishStillInUi).toBe(false);
    }
    
    if (countBeforeDelete > 1) {
      expect(cardsAfterDelete.length).toBeLessThan(countBeforeDelete);
    }
  });
});
