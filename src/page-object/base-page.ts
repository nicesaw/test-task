import { Page } from 'playwright';
import ActionsWeb from './actions-web';

export default class BasePage {
  constructor(
    public url: string,
    public locator: string,
    protected page: Page
  ) {
    this.actionsWeb = new ActionsWeb(page);
    this.url = url;
    this.locator = locator;
  }

  protected actionsWeb: ActionsWeb;

  async isUrlOpened() {
    const currentUrl = this.page.url();

    return currentUrl === this.url;
  }

  async goTo() {
    return this.page.goto(this.url);
  }

  async waitLoaded() {
    await this.isUrlOpened();

    return this.actionsWeb.waitForVisibility(this.locator);
  }

  async isContentLoaded() {
    return this.actionsWeb.isElementVisible(this.locator);
  }

  async waitNetworkIdle() {
    try {
      await this.page.waitForLoadState('networkidle');
    } catch (err) {
      throw err.message;
    }
  }
}
