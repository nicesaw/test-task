import { defaultTimeout } from '@constants';
import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export default class ActionsWeb {
  constructor(private page: Page) {}

  getElement(locator: string | Locator) {
    if (typeof locator == 'string') {
      return this.page.locator(locator);
    } else {
      return locator;
    }
  }

  async getElementsArray(locator: string | Locator) {
    if (typeof locator == 'string') {
      return this.page.locator(locator).all();
    } else {
      return locator.all();
    }
  }

  async getElementsArrayText(locator: string | Locator) {
    const elementsArray = await this.getElementsArray(locator);
    const promises = elementsArray.map(async (element: Locator) => {
      return this.getElementText(element);
    });
    const elementsTexts = Promise.all(promises);

    return elementsTexts;
  }

  async getElementWithText(locator: string | Locator, text: string) {
    return this.getElement(locator).filter({ hasText: text });
  }

  async getElementText(locator: string | Locator) {
    try {
      await this.waitForVisibility(locator);
    } catch (err) {
      console.error(err.message);
    }

    return this.getElement(locator).innerText();
  }

  getChild(
    parentElementsLocator: string | Locator,
    childLocator: string | Locator,
    hasText?: string
  ) {
    const parentElement = this.getElement(parentElementsLocator);

    return parentElement.locator(childLocator, { hasText });
  }

  async waitForElement(
    locator: string | Locator,
    state: 'attached' | 'detached' | 'visible' | 'hidden',
    timeout: number = defaultTimeout
  ) {
    return this.getElement(locator).first().waitFor({ state, timeout });
  }

  async waitForVisibility(locator: string | Locator, timeout?: number) {
    return this.waitForElement(locator, 'visible', timeout);
  }

  async isElementVisible(locator: string | Locator, timeout?: number) {
    return this.getElement(locator).isVisible({ timeout });
  }

  async hasClass(locator: string | Locator, className: string) {
    const element = this.getElement(locator);
    const classAttribute = await element.getAttribute('class');

    return classAttribute?.split(' ').includes(className) || false;
  }

  async waitForElementClassContainValue(locator: string | Locator, value: string) {
    await expect
      .poll(async () => {
        const classValue = await this.getElement(locator).getAttribute('class', {
          timeout: defaultTimeout
        });

        if (typeof classValue === 'string') {
          return classValue.split(' ').includes(value);
        }

        if (!classValue) {
          return false;
        }
      })
      .toBeTruthy();
  }

  async click(locator: string | Locator) {
    const element = this.getElement(locator);

    return element.click();
  }

  async fillText(locator: string | Locator, text: string) {
    const element = this.getElement(locator);

    return element.fill(text);
  }
}
