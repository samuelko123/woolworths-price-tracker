export const mockCategory = {
  id: "1-E5BEE36E",
  level: 1,
  urlName: "fruit-veg",
  displayName: "Fruit & Veg",
};

export const mockCategoryProductsResponse = {
  TotalRecordCount: 2,
  Bundles: [
    {
      Products: [
        {
          Barcode: "1234567890123",
          Stockcode: 123456,
          DisplayName: "Product 1",
          PackageSize: "500g",
          MediumImageFile: "https://example.com/image1.jpg",
          Price: 10.99,
        },
      ],
    },
    {
      Products: [
        {
          Barcode: "7890123456789",
          Stockcode: 789012,
          DisplayName: "Product 2",
          PackageSize: "1kg",
          MediumImageFile: "https://example.com/image2.jpg",
          Price: 15.99,
        },
      ],
    },
  ],
};
