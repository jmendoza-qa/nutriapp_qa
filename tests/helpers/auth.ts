import { Page } from '@playwright/test';

/**
 * Helper function to login via API and set the session cookie
 */
export async function loginViaAPI(page: Page, email: string = 'test@nutriapp.com', password: string = 'nutriapp123') {
  // Get the base URL from the page context or use default
  const baseURL = page.context().baseURL || 'http://localhost:3000';
  
  // Make API call to login
  const response = await page.request.post(`${baseURL}/api/login`, {
    data: { email, password },
  });

  if (response.status() !== 200) {
    throw new Error(`Login failed with status ${response.status()}`);
  }

  // Get the session cookie from the response
  const cookies = response.headers()['set-cookie'];
  if (cookies) {
    // Extract session cookie value
    const sessionMatch = cookies.match(/session=([^;]+)/);
    if (sessionMatch) {
      const sessionValue = sessionMatch[1];
      // Set the cookie in the browser context
      await page.context().addCookies([{
        name: 'session',
        value: sessionValue,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      }]);
    }
  }

  // Navigate to dishes page
  await page.goto('/dishes');
  await page.waitForLoadState('networkidle');
}

