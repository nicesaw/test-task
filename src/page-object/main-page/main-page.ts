import { Locator, Page } from 'playwright';
import BasePage from '../base-page';
import Note from './note-object';
import BasketDropdown from './card-dropdown';
import { expect } from 'playwright/test';

export default class MainPage extends BasePage {
  constructor(page: Page) {
    super('/', '//div[@class="site-index"]', page);
  }

  private notesListLocator = '//div[contains(@class,"note-list")]';
  private basketCountLocator = '//span[contains(@class,"basket-count-items")]';
  private notesItemLocator =
    '//div[contains(@class,"note-list")]//div[contains(@class,"note-item")]';
  private paginationPageLocator = (pageNumber: number) =>
    `//ul[contains(@class, "pagination")]//li[./a[@data-page-number="${pageNumber}"]]`;

  public basketDropdown = new BasketDropdown(this.page);

  async waitNotesListIsDisplayed() {
    const notesListElement = this.actionsWeb.getElement(this.notesListLocator);

    return this.actionsWeb.waitForVisibility(notesListElement);
  }

  getNote(name: string | Locator) {
    return new Note(this.page, name);
  }

  getBasketCountElement() {
    return this.actionsWeb.getElement(this.basketCountLocator);
  }

  async getAllNotesFromPage() {
    const notesElements = await this.actionsWeb.getElementsArray(this.notesItemLocator);
    const allNotes = notesElements.map((noteElement) => this.getNote(noteElement));

    return allNotes;
  }

  async getNotesWithDiscount() {
    const allNotes = await this.getAllNotesFromPage();
    const promises = allNotes.map(async (note: Note) => {
      const hasDiscount = await note.hasDiscount();
      return hasDiscount ? note : null;
    });
    const allNotesWithDiscount = (await Promise.all(promises)).filter((note) => note !== null);

    return allNotesWithDiscount;
  }

  async getNotesWithoutDiscount() {
    const allNotes = await this.getAllNotesFromPage();
    const promises = allNotes.map(async (note: Note) => {
      const hasDiscount = await note.hasDiscount();
      return !hasDiscount ? note : null;
    });
    const allNotesWithDiscount = (await Promise.all(promises)).filter((note) => note !== null);

    return allNotesWithDiscount;
  }

  async getBasketCount() {
    const count = await this.actionsWeb.getElementText(this.getBasketCountElement());

    return Number(count);
  }

  async waitForCardCount(count: number) {
    return expect(this.actionsWeb.getElement(this.basketCountLocator)).toHaveText(String(count));
  }

  async changePage(pageNumber: number) {
    const paginationPageElement = this.actionsWeb.getElement(
      this.paginationPageLocator(pageNumber)
    );
    const isActive = await this.actionsWeb.hasClass(paginationPageElement, 'active');
    if (!isActive) await this.actionsWeb.click(paginationPageElement);

    return await this.actionsWeb.waitForElementClassContainValue(paginationPageElement, 'active');
  }
}
