import { test as baseTest } from '@playwright/test';
import * as allure from 'allure-js-commons';
import UserApi from 'api/user/user-api';
import ActionsWeb from 'page-object/actions-web';
import BasketPage from 'page-object/basket-page/basket-page';
import MainPage from 'page-object/main-page/main-page';

export type BaseTestFixtures = {
  actionsWeb: ActionsWeb;
  userApi: UserApi;
  mainPage: MainPage;
  basketPage: BasketPage;
};

export const test = baseTest.extend<BaseTestFixtures>({
  userApi: async ({ page }, use) => {
    await use(new UserApi(page));
  },
  actionsWeb: async ({ page }, use) => {
    await use(new ActionsWeb(page));
  },
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
  basketPage: async ({ page }, use) => {
    await use(new BasketPage(page));
  }
});

export const describeTest = (parentSuite: string, suite: string) => {
  test.beforeAll(async () => {
    await allure.parentSuite(parentSuite);
    await allure.suite(suite);
  });
};

export const step = test.step;
