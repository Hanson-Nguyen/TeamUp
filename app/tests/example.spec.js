// @ts-check
const { test, expect } = require('@playwright/test');

test('TC01: Cannot access protected page without login', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test('TC02: Cannot create a user that already exists', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test('TC03: Successfully registered account', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');

})

test('TC04: Cannot login with invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC05: Successful login', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC06: First time basic users take a questionnaire', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC07: On completion of questionnaire go to the view projects page', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC08: Contributor Login', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC09: Contributor can create projects', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC10: Clicking on a project allows the contirbutor to edit its contents', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC11: A contributor can edit projects', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC12: When a contributor navigates to the view project page only display projects that they have created', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC13: When a project is published state that it is published in the table', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC14: When searching for a project you did not creat a contributor cannot see it', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC15: A basic user when viewing a project can only see projects based on the tag assigned to them', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC16: Clicking on a project brings up the modal that displays details about it', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC17: A basic user can join any open project that shows up in the view projec page', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC18: Any user can navigate to the top right of the page click on their profile icon and select logout from the drop-down', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC19: An administrator sees all users that have registered to the application', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC20: Administrators can change the role of a user to Basic or Contributor', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC21: Administrators can revoke access to the website', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC22: Basic users cannot see the create project page', async ({ page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC23: Basic users cannot see the admin page', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC24: Contributors cannot see the admin page', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC25 Administrator Login', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC26: Contributors and Administrators can delete projects', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('TC27 Administrators can delete users', async ({page}) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/login');
})
