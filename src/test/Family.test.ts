import { Family } from "../index";

test("Family Name", () => {
    expect(new Family("Carl").name).toBe("Carl");
});
