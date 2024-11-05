import { Page } from 'playwright';
import ActionsWeb from '../actions-web';
import { withoutCurrencyRegexp } from '@constants';

export default class BasketDropdown {
  constructor(page: Page) {
    this.actionsWeb = new ActionsWeb(page);
  }
  private actionsWeb: ActionsWeb;

  private basketBtnLocator = '//a[@id="dropdownBasket"]';
  private containerLocator = '//div[@aria-labelledby="dropdownBasket"]';
  private itemLocator = '//li[contains(@class, "basket-item")]';
  private itemNameLocator = '//span[@class="basket-item-title"]';
  private itemPriceLocator = '//span[@class="basket-item-price"]';
  private noteQuantityLocator = '//span[contains(@class,"basket-item-count")]';
  private itemTotalPriceLocator = '//span[@class="basket_price"]';
  private btnGoToBasketLocator = '//a[@href="/basket"]';

  async openDropdown() {
    await this.actionsWeb.click(this.basketBtnLocator);

    return this.isOpened();
  }

  async isOpened() {
    return this.actionsWeb.waitForVisibility(this.containerLocator);
  }

  async getItemNames() {
    return this.actionsWeb.getElementsArrayText(this.itemNameLocator);
  }

  async getItemByName(noteName: string) {
    return this.actionsWeb.getElementWithText(this.itemLocator, noteName);
  }

  async getItemPriceByName(noteName: string) {
    const dropdownItem = await this.actionsWeb.getElementWithText(this.itemLocator, noteName);
    const priceElement = this.actionsWeb.getChild(dropdownItem, this.itemPriceLocator);
    const price = await this.actionsWeb.getElementText(priceElement);

    return Number(price.match(withoutCurrencyRegexp)[1]);
  }

  async getTotalPrice() {
    const dropdownItem = this.actionsWeb.getElement(this.itemTotalPriceLocator);
    const price = await this.actionsWeb.getElementText(dropdownItem);

    return Number(price);
  }

  async openBasketPage() {
    const btnGoToBasket = this.actionsWeb.getElement(this.btnGoToBasketLocator);

    return this.actionsWeb.click(btnGoToBasket);
  }

  async getNoteQuantity(name: string) {
    const note = await this.getItemByName(name);
    const priceElement = this.actionsWeb.getChild(note, this.noteQuantityLocator);
    const price = await this.actionsWeb.getElementText(priceElement);

    return Number(price);
  }
}
