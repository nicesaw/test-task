export type BasketResponse = {
  basket: BasketItem[];
  basketCount: number;
  basketPrice: number;
  response: boolean;
};

export type BasketItem = {
  count: number;
  discount: number;
  id: number;
  name: string;
  poster: string;
  price: number;
};
