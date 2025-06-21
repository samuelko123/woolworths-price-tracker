import { JsonStringSchema } from "./JsonStringSchema";

describe("JsonStringSchema", () => {
  it("parses valid JSON string", () => {
    const validJson = "{\"foo\": \"bar\", \"num\": 42}";

    const result = JsonStringSchema.safeParse(validJson);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ foo: "bar", num: 42 });
  });

  it("fails on invalid JSON string", () => {
    const invalidJson = "not a valid json";

    const result = JsonStringSchema.safeParse(invalidJson);

    expect(result.success).toBe(false);

    const issues = result.error!.issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Invalid JSON string");
    expect(issues[0].code).toBe("custom");
  });

  it("fails on non-string input", () => {
    const result = JsonStringSchema.safeParse(123);

    expect(result.success).toBe(false);

    const issues = result.error!.issues;
    expect(issues[0].code).toBe("invalid_type");
    expect(issues[0].message).toBe("Expected string, received number");
  });
});
