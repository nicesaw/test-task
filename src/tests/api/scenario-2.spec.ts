import { pathToAuthFile } from '@constants';
import { describeTest, step, test } from '@fixtures/base-test';
import { getItemWithDiscount } from 'api/helper';
import { BasketResponse, BasketItem } from 'api/user/types';
import { expect } from 'playwright/test';
import { parentSuites, suites } from 'tests/constants';

test.use({ storageState: pathToAuthFile });

describeTest(parentSuites.API, suites.Basket);

test('Scenario 2', async ({ userApi }) => {
  const notesQuantity = 8;
  const initialCount = 1;
  let notesList: BasketItem[];
  let notesToAdd: BasketItem[];
  let basketResponse: BasketResponse;
  let initialNote: BasketItem;

  await step('Precondition: there is 1 discounted item in the basket', async () => {
    await userApi.postClearBasket();
    const notesFirstPage = await userApi.postGetProduct();
    const notesSecondPage = await userApi.postGetProduct(2);
    notesList = notesFirstPage.concat(notesSecondPage);
    initialNote = getItemWithDiscount(notesList);
    await userApi.postAddToBasket(initialNote.id);
  });

  await step('Add another 8 items to the basket', async () => {
    notesToAdd = notesList.filter((note) => note.name != initialNote.name);
    notesToAdd.length = notesQuantity;
    for (let i = 0; i < notesToAdd.length; i++) {
      const addResponse = await userApi.postAddToBasket(notesToAdd[i].id);

      expect(addResponse, `${notesToAdd[i].name} is added`).toBeTruthy();
    }
  });

  await step('Basket contains 9 items', async () => {
    basketResponse = await userApi.postGetBasket();
    expect(basketResponse.basketCount).toBe(notesQuantity + initialCount);
  });

  await step('Product names in basket are correct', async () => {
    const productNames = [initialNote].concat(notesToAdd);
    for (let i = 0; i < productNames.length; i++) {
      expect(basketResponse.basket[i].name).toBe(productNames[i].name);
    }
  });

  await step('Product price and total price in basket are correct', async () => {
    const totalPrice = basketResponse.basketPrice;
    const totalNotesPrice = basketResponse.basket.reduce((total, note) => total + note.price, 0);
    const expectedTotalNotesPrice = notesToAdd.reduce(
      (total, note) => total + (note.price - note.discount),
      initialNote.price - initialNote.discount
    );

    expect(totalPrice && totalNotesPrice).toBe(expectedTotalNotesPrice);
  });

  await step('Open basket page', async () => {
    const basketPageResponse = await userApi.getBasketPage();

    expect(basketPageResponse).toBeTruthy();
  });
});
