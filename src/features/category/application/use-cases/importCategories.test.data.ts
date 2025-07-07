export const queueUrl = "https://sqs.example.com/categories";

export const categoriesResponse = {
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
    {
      NodeId: "1_B63CF9E",
      Description: "Front of Store",
      NodeLevel: 1,
      ParentNodeId: "1-4A3B264C",
      DisplayOrder: 34,
      IsRestricted: true,
      ProductCount: 0,
      IsSortEnabled: true,
      IsPaginationEnabled: true,
      UrlFriendlyName: "front-of-store",
      IsSpecial: false,
      RichRelevanceId: null,
      IsBundle: false,
      IsUntraceable: false,
    },
  ],
};

export const categories = [
  { id: "1_90E697B", urlName: "back-to-school", displayName: "Back to School" },
];
