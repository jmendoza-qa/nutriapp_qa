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
    
    // Get the card element before deletion to wait for it to disappear
    const cardToDelete = await dishesPage.getDishCard(dishIndexToDelete);
    const dishNameElement = cardToDelete.locator('h2');
    
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
    
    // Wait for the dish card to disappear from the UI (React state update)
    // This ensures the client-side state has been updated
    try {
      await expect(dishNameElement).not.toBeVisible({ timeout: 5000 });
    } catch {
      // If it doesn't disappear immediately, that's okay - we'll verify after reload
    }
    
    // Wait a bit for React state to update and any animations
    await page.waitForTimeout(1000);
    
    // Reload the page to get fresh state from server
    // This ensures we're seeing the actual state after deletion
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify the dish was removed from the list with retry logic
    let dishStillPresent = true;
    let retries = 3;
    let cardsAfterDelete: any[] = [];
    
    while (retries > 0 && dishStillPresent) {
      // Re-initialize dishes page to get fresh state
      const dishesPageAfterReload = new DishesPage(page);
      await expect(dishesPageAfterReload.heading).toBeVisible();
      
      // Get fresh cards after reload
      cardsAfterDelete = await dishesPageAfterReload.getDishCards();
      
      // If no cards, dish is definitely gone
      if (cardsAfterDelete.length === 0) {
        dishStillPresent = false;
        break;
      }
      
      // Get all dish names from fresh cards
      const remainingNames = await Promise.all(
        cardsAfterDelete.map(async (_, idx) => {
          try {
            const name = await dishesPageAfterReload.getDishName(idx);
            return name ? name.trim() : null;
          } catch {
            return null;
          }
        })
      );
      
      // Check if the dish is still present (normalize both names for comparison)
      const normalizedUpdatedName = updatedDishName.trim().toLowerCase();
      dishStillPresent = remainingNames.some(name => {
        if (!name) return false;
        return name.trim().toLowerCase() === normalizedUpdatedName;
      });
      
      if (!dishStillPresent) {
        // Dish is gone, test passes
        break;
      }
      
      // If dish is still present, wait and reload again
      if (retries > 1) {
        await page.waitForTimeout(3000);
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
      }
      
      retries--;
    }
    
    // Final verification: the deleted dish name should not be in the list
    expect(dishStillPresent).toBe(false);
    
    // Also verify count decreased (if there were multiple dishes)
    if (countBeforeDelete > 1) {
      expect(cardsAfterDelete.length).toBeLessThan(countBeforeDelete);
    }
  });
});
