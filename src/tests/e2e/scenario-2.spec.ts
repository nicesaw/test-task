import { pathToAuthFile } from '@constants';
import { describeTest, step, test } from '@fixtures/base-test';
import { getItemWithDiscount } from 'api/helper';
import { BasketItem } from 'api/user/types';
import Note from 'page-object/main-page/note-object';
import { expect } from 'playwright/test';
import { parentSuites, suites } from 'tests/constants';

test.use({ storageState: pathToAuthFile });

describeTest(parentSuites.E2E, suites.Basket);

const filterAndAddNotes = async (
  notesToAdd: Note[],
  notesQuantity: number,
  excludeName: string
) => {
  let addedNotes: { name: string; price: number }[] = [];

  for (let i = 0; i < notesQuantity; i++) {
    const noteName = await notesToAdd[i].getNoteName();

    if (noteName !== excludeName) {
      const notePrice = await notesToAdd[i].getNotePrice();

      await notesToAdd[i].addToCard();

      addedNotes.push({ name: noteName, price: notePrice });
    }
  }
  return addedNotes;
};

test('Scenario 2', async ({ userApi, mainPage, basketPage, actionsWeb }) => {
  const notesQuantity = 8;
  const countInBasket = 1;
  let initialNote: BasketItem;
  let notesToAdd: Note[];
  let addedNotes: { name: string; price: number }[];

  await step('Precondition: there is 1 discounted item in the basket', async () => {
    const notesList1 = await userApi.postGetProduct();
    const notesList2 = await userApi.postGetProduct(2);
    const allNotes = notesList1.concat(notesList2);

    initialNote = getItemWithDiscount(allNotes);

    await userApi.postClearBasket();
    await userApi.postAddToBasket(initialNote.id, countInBasket);
  });

  await step('Open main page', async () => {
    await mainPage.goTo();
    await mainPage.waitLoaded();
    await mainPage.waitNotesListIsDisplayed();
  });

  await step('Add another 8 items to the basket and check count', async () => {
    notesToAdd = await mainPage.getAllNotesFromPage();

    addedNotes = await filterAndAddNotes(notesToAdd, notesToAdd.length, initialNote.name);

    if (addedNotes.length < notesQuantity) {
      await mainPage.changePage(2);
      notesToAdd = await mainPage.getAllNotesFromPage();

      const notes = await filterAndAddNotes(
        notesToAdd,
        notesQuantity - addedNotes.length,
        initialNote.name
      );

      addedNotes = addedNotes.concat(notes);
    }

    return expect(mainPage.getBasketCountElement()).toHaveText(
      String(notesQuantity + countInBasket)
    );
  });

  await step('Next to the basket icon, the number 9 is displayed', async () => {
    const actualCount = await mainPage.getBasketCount();

    expect(actualCount).toBe(countInBasket + notesQuantity);
  });

  await step('Click on the basket icon', async () => {
    await mainPage.basketDropdown.openDropdown();
  });

  await step('Products names in basket are visible', async () => {
    for (let i = 0; i < notesQuantity; i++) {
      const noteName = addedNotes[i].name;
      const noteItem = await mainPage.basketDropdown.getItemByName(noteName);
      const isVisible = await actionsWeb.isElementVisible(noteItem);

      expect(isVisible).toBeTruthy();
    }
  });

  await step('Products prices and total price in basket are correct', async () => {
    let expectedTotalPrice = 0;

    for (let i = 0; i < notesQuantity; i++) {
      const noteName = addedNotes[i].name;
      const notePrice = addedNotes[i].price;
      const noteQuantity = await mainPage.basketDropdown.getNoteQuantity(noteName);
      const actualPrice = await mainPage.basketDropdown.getItemPriceByName(noteName);

      expectedTotalPrice += notePrice;
      const expectedPrice = notePrice * noteQuantity;

      expect(actualPrice).toBe(expectedPrice);
    }

    const actualTotalPrice = await mainPage.basketDropdown.getTotalPrice();

    expect(actualTotalPrice).toBe(expectedTotalPrice);
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
