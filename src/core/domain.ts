export type Category = {
  id: string;
  urlName: string;
  displayName: string;
};

export type Product = {
  barcode: string | null;
  sku: string;
  name: string;
  packageSize: string;
  imageUrl: string;
  price: number;
};
