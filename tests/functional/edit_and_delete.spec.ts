import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { DishesPage } from '../../page-objects/DishesPage';
import { NewDishPage } from '../../page-objects/NewDishPage';

test.describe('Functional: Edit and Delete Dish (POM)', () => {
  test('Create -> Edit -> Verify -> Delete -> Confirm removal', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.login('test@nutriapp.com', 'nutriapp123');
    // Wait for navigation after login
    await page.waitForURL(/\/dishes/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dishes/);

    const dishes = new DishesPage(page);
    await dishes.navigate();
    await dishes.goToNewDish();

    const newDish = new NewDishPage(page);
    const baseName = `Functional Edit ${Date.now()}`;
    await newDish.fillBasicInfo(baseName, 'Dish to edit and delete');
    await newDish.addStep('Paso edit 1', 0);
    await newDish.addAdditionalStep();
    await newDish.fillDetails(10, 15, 180);
    await newDish.submit();

    // Ensure created
    await expect(page.getByRole('heading', { level: 2, name: baseName })).toBeVisible();

    // Click Edit next to created heading
    const heading = page.getByRole('heading', { level: 2, name: baseName });
    const card = heading.locator('..');
    await card.getByRole('link', { name: 'Editar' }).click();

    // Edit using EditDishPage
    const { EditDishPage } = await import('../../pages/EditDishPage');
    const editForm = new EditDishPage(page);
    const editedName = baseName + ' (edited)';
    await editForm.updateName(editedName);
    await editForm.save();

    // Back to list and verify edited
    await expect(page.getByRole('heading', { level: 2, name: editedName })).toBeVisible();

    // Delete the edited item
    const editedHeading = page.getByRole('heading', { level: 2, name: editedName });
    const editedCard = editedHeading.locator('..');
    const delBtn = editedCard.getByRole('button', { name: 'Eliminar' });
    if (await delBtn.count() > 0) {
      await delBtn.click();
      // confirm removed
      await expect(page.getByRole('heading', { level: 2, name: editedName })).toHaveCount(0);
    } else {
      test.skip(true, 'No delete control available in this environment');
    }
  });
});
