import { APIRequestContext, APIResponse } from 'playwright';
import { BasketItem } from './user/types';

export const getCsrfTokenFromHtml = async (requestContext: APIRequestContext, pageUrl: string) => {
  const pageResponse = await requestContext.get(pageUrl);
  const pageHtml = await pageResponse.text();

  const tokenMatch = pageHtml.match(/name="_csrf" value="([^"]+)"/);
  const csrfTokenFromHtml = tokenMatch ? tokenMatch[1] : null;

  if (!csrfTokenFromHtml) {
    throw new Error('CSRF token not found on the login page.');
  }

  return csrfTokenFromHtml;
};

export const getItemWithDiscount = (items: BasketItem[]) => items.find((note) => note.discount > 0);

export const getItemWithoutDiscount = (items: BasketItem[]) =>
  items.find((note) => note.discount === 0);
