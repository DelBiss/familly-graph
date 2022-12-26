import { Family } from "../index";
import { Individual } from "../interface/individual";

test("Family Name", () => {
    expect(new Family("Carl").name).toBe("Carl");
});

test("Family Individual - One by One", () => {
    const f = new Family("Carl");
    const i: Individual[] = [
        { name: "Papa", age: 40 },
        { name: "Maman", age: 38 },
        { name: "Enfant", age: 15 },
    ];
    expect(f.addIndividual(i[0])).toEqual(i[0]);
    expect(f.addIndividual(i[1])).toEqual(i[1]);
    expect(f.addIndividual(i[2])).toEqual(i[2]);

    const r = f.getAllIndividual();
    expect(r).toEqual(expect.arrayContaining(i));
});
test("Family Individual - One by One Chain", () => {
    const f = new Family("Carl");
    const i: Individual[] = [
        { name: "Papa", age: 40 },
        { name: "Maman", age: 38 },
        { name: "Enfant", age: 15 },
    ];
    const r = f.addIndividual(i[0], i[1], i[2]);
    expect(r).toEqual(expect.arrayContaining(i));
    expect(f.getAllIndividual()).toEqual(expect.arrayContaining(i));
});
test("Family Individual - Array", () => {
    const f = new Family("Carl");
    const i: Individual[] = [
        { name: "Papa", age: 40 },
        { name: "Maman", age: 38 },
        { name: "Enfant", age: 15 },
    ];
    const r = f.addIndividual(i);

    expect(r).toEqual(expect.arrayContaining(i));
    expect(f.getAllIndividual()).toEqual(expect.arrayContaining(i));
});
