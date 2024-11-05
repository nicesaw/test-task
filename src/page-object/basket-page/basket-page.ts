import { Page } from 'playwright';
import BasePage from '../base-page';

export default class BasketPage extends BasePage {
  constructor(page: Page) {
    super('/basket', '//div[@id="basket"]', page);
  }
}
