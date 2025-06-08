export const mockCategoriesResponse = {
  Categories: [
    {
      NodeId: "specialsgroup",
      Description: "Specials",
      NodeLevel: 1,
      ParentNodeId: null,
      DisplayOrder: 1,
      IsRestricted: false,
      ProductCount: 0,
      IsSortEnabled: true,
      IsPaginationEnabled: true,
      UrlFriendlyName: "specials",
      Children: [],
      IsSpecial: true,
      RichRelevanceId: null,
      IsBundle: false,
      IsUntraceable: false,
    },
    {
      NodeId: "1_90E697B",
      Description: "Back to School",
      NodeLevel: 1,
      ParentNodeId: "1-4A3B264C",
      DisplayOrder: 1,
      IsRestricted: false,
      ProductCount: 0,
      IsSortEnabled: true,
      IsPaginationEnabled: true,
      UrlFriendlyName: "back-to-school",
      IsSpecial: false,
      RichRelevanceId: null,
      IsBundle: false,
      IsUntraceable: false,
    },
  ],
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
