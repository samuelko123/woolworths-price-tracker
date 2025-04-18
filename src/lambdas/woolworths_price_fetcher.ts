type WoolworthsPriceFetcherEvent = {
  productId: string;
};

export const handler = async (event: WoolworthsPriceFetcherEvent) => {
  console.log({
    productId: event.productId,
  });
};
