import { expect, test } from "vitest";

test("uses jsdom by default", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});
