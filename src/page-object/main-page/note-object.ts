import { Locator, Page } from 'playwright';
import ActionsWeb from '../actions-web';
import { withoutCurrencyRegexp } from '@constants';

export default class Note {
  constructor(page: Page, name: string | Locator) {
    this.actionsWeb = new ActionsWeb(page);
    this.name = name;
  }

  private actionsWeb: ActionsWeb;
  private name: string | Locator;

  private nameLocator = '//div[contains(@class,"product_name")]';
  private notePriceLocator = '//span[contains(@class,"product_price")]';
  private noteDiscountLocator = '//span[contains(@class,"product_discount")]';
  private btnBuyProductLocator = '//button[contains(@class,"actionBuyProduct")]';
  private inputQuantityLocator = '//input[@name="product-enter-count"]';
  private discountClassName = 'hasDiscount';

  async getNoteElement() {
    return this.actionsWeb.getElement(this.name);
  }

  async getNoteName() {
    const note = await this.getNoteElement();
    const nameElement = this.actionsWeb.getChild(note, this.nameLocator);
    return await this.actionsWeb.getElementText(nameElement);
  }

  async getNotePrice() {
    const note = await this.getNoteElement();
    const priceElement = this.actionsWeb.getChild(note, this.notePriceLocator);
    const price = await this.actionsWeb.getElementText(priceElement);
    return Number(price.match(withoutCurrencyRegexp)[1]);
  }

  async hasDiscount() {
    const note = await this.getNoteElement();
    return this.actionsWeb.hasClass(note, this.discountClassName);
  }

  async getNoteDiscount() {
    const note = await this.getNoteElement();
    const discountElement = this.actionsWeb.getChild(note, this.noteDiscountLocator);
    return this.actionsWeb.getElementText(discountElement);
  }

  async addToCard(quantity?: number) {
    const note = await this.getNoteElement();
    const btnBuyNote = this.actionsWeb.getChild(note, this.btnBuyProductLocator);
    if (quantity) {
      const inputQuantity = this.actionsWeb.getChild(note, this.inputQuantityLocator);
      await this.actionsWeb.fillText(inputQuantity, String(quantity));
    }
    return this.actionsWeb.click(btnBuyNote);
  }
}
