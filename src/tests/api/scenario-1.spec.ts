import { pathToAuthFile } from '@constants';
import { describeTest, step, test } from '@fixtures/base-test';
import { getItemWithDiscount } from 'api/helper';
import { BasketResponse, BasketItem } from 'api/user/types';
import { expect } from 'playwright/test';
import { parentSuites, suites } from 'tests/constants';

test.use({ storageState: pathToAuthFile });

describeTest(parentSuites.API, suites.Basket);

test('Scenario 1', async ({ userApi }) => {
  const notesQuantity = 9;
  let note: BasketItem;
  let basketResponse: BasketResponse;

  await step('Precondition: clear basket', async () => {
    await userApi.postClearBasket();
  });

  await step('Add 9 items of the same product with a discount to the basket', async () => {
    const notesList = await userApi.postGetProduct();
    note = getItemWithDiscount(notesList);
    const addResponse = await userApi.postAddToBasket(note.id, notesQuantity);

    expect(addResponse).toBeTruthy();
  });

  await step('Basket contains 9 items', async () => {
    basketResponse = await userApi.postGetBasket();

    expect(basketResponse.basketCount).toBe(notesQuantity);
  });

  await step('Product name in basket is correct', async () => {
    expect(basketResponse.basket[0].name).toBe(note.name);
  });

  await step('Product price and total price in basket are correct', async () => {
    const actualTotalPrice = basketResponse.basketPrice;
    const actualNotesPrice = basketResponse.basket[0].price;
    const expectedPrice = (note.price - note.discount) * notesQuantity;

    expect(actualTotalPrice && actualNotesPrice).toBe(expectedPrice);
  });

  await step('Open basket page', async () => {
    const basketPageResponse = await userApi.getBasketPage();

    expect(basketPageResponse).toBeTruthy();
  });
});
