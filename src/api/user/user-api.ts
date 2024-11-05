import { pathToAuthFile, baseUrl } from '@constants';
import { readFileSync } from 'fs';
import { Page, request } from 'playwright';
import { BasketResponse, BasketItem } from './types';
import { getCsrfTokenFromHtml } from 'api/helper';

export default class UserApi {
  constructor(page: Page) {
    this.page = page;
  }

  page: Page;

  async postAddToBasket(id: number, count: number = 1): Promise<boolean> {
    const storageState = JSON.parse(readFileSync(pathToAuthFile, 'utf-8'));
    const context = await request.newContext({ storageState: storageState });
    const csrfTokenFromHtml = await getCsrfTokenFromHtml(context, '/');

    const data = new URLSearchParams();
    data.append('product', String(id));
    data.append('count', String(count));

    const response = await context.post(`${baseUrl}basket/create`, {
      headers: {
        'x-csrf-token': csrfTokenFromHtml,
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      },
      data: data.toString(),
      failOnStatusCode: true
    });

    const result = await response.json();

    await context.dispose();

    return result.response;
  }

  async postGetBasket(): Promise<BasketResponse> {
    const storageState = JSON.parse(readFileSync(pathToAuthFile, 'utf-8'));
    const context = await request.newContext({ storageState: storageState });
    const csrfTokenFromHtml = await getCsrfTokenFromHtml(context, '/');

    const response = await context.post(`${baseUrl}basket/get`, {
      headers: {
        'x-csrf-token': csrfTokenFromHtml,
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      },
      failOnStatusCode: true
    });

    const result = await response.json();

    await context.dispose();

    return result;
  }

  async postClearBasket(): Promise<boolean> {
    const storageState = JSON.parse(readFileSync(pathToAuthFile, 'utf-8'));
    const context = await request.newContext({ storageState: storageState });
    const csrfTokenFromHtml = await getCsrfTokenFromHtml(context, '/');

    const response = await context.post(`${baseUrl}basket/clear`, {
      headers: {
        'x-csrf-token': csrfTokenFromHtml,
        'x-requested-with': 'XMLHttpRequest'
      },
      failOnStatusCode: true
    });

    const result = await response.json();

    await context.dispose();

    return result.response;
  }

  async postGetProduct(pageNumber: number = 1): Promise<BasketItem[]> {
    const storageState = JSON.parse(readFileSync(pathToAuthFile, 'utf-8'));
    const context = await request.newContext({ storageState: storageState });
    const csrfTokenFromHtml = await getCsrfTokenFromHtml(context, '/');

    const data = new URLSearchParams();
    data.append('page', String(pageNumber));

    const response = await context.post(`${baseUrl}product/get`, {
      headers: {
        'x-csrf-token': csrfTokenFromHtml,
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      },
      data: data.toString(),
      failOnStatusCode: true
    });

    const result = await response.json();

    await context.dispose();

    return result.products;
  }

  async getBasketPage(): Promise<boolean> {
    const storageState = JSON.parse(readFileSync(pathToAuthFile, 'utf-8'));
    const context = await request.newContext({ storageState: storageState });

    const response = await context.get(`${baseUrl}basket`, {
      failOnStatusCode: true
    });

    const result = response.ok();

    await context.dispose();

    return result;
  }
}
