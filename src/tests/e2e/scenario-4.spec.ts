import { pathToAuthFile } from '@constants';
import { describeTest, step, test } from '@fixtures/base-test';
import Note from 'page-object/main-page/note-object';
import { expect } from 'playwright/test';
import { parentSuites, suites } from 'tests/constants';

test.use({ storageState: pathToAuthFile });

describeTest(parentSuites.E2E, suites.Basket);

test('Scenario 4', async ({ userApi, mainPage, basketPage, actionsWeb }) => {
  const expectedBasketCount = 1;
  let noteToAdd: Note;

  await step('Precondition: clear basket', async () => {
    await userApi.postClearBasket();
  });

  await step('Open main page', async () => {
    await mainPage.goTo();
    await mainPage.waitLoaded();
    await mainPage.waitNotesListIsDisplayed();
  });

  await step('Add 1 item without a discount to the basket', async () => {
    const notes = await mainPage.getNotesWithoutDiscount();
    noteToAdd = notes[0];

    await noteToAdd.addToCard();
    await mainPage.waitNetworkIdle();
  });

  await step('Next to the basket icon, the number "1" is displayed', async () => {
    const actualCount = await mainPage.getBasketCount();

    expect(actualCount).toBe(expectedBasketCount);
  });

  await step('Click on the basket icon', async () => {
    await mainPage.basketDropdown.openDropdown();
  });

  await step('Product name in basket is visible', async () => {
    const noteName = await noteToAdd.getNoteName();
    const noteItem = await mainPage.basketDropdown.getItemByName(noteName);
    const isVisible = await actionsWeb.isElementVisible(noteItem);

    expect(isVisible).toBeTruthy();
  });

  await step('Product price and total price in basket are correct', async () => {
    const noteName = await noteToAdd.getNoteName();
    const expectedPrice = await noteToAdd.getNotePrice();
    const actualPrice = await mainPage.basketDropdown.getItemPriceByName(noteName);
    const actualTotalPrice = await mainPage.basketDropdown.getTotalPrice();

    expect(actualPrice && actualTotalPrice).toBe(expectedPrice);
  });

  await step('Click "Go to basket" button', async () => {
    await mainPage.basketDropdown.openBasketPage();
  });

  await step('Basket page is opened', async () => {
    const isUrlOpened = await basketPage.isUrlOpened();
    const isContentLoaded = await basketPage.isContentLoaded();

    expect(isUrlOpened && isContentLoaded).toBeTruthy();
  });
});
