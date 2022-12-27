import { isIndividual, Individual } from "../interface/individual";

const anIndividual: Individual = {
    name: "Someone",
    age: 40,
};
const anIndividualWithoutType = {
    name: "Someone",
    age: 40,
};
const anIndividualWithoutName = {
    name: "Someone",
};
const anIndividualWithoutAge = {
    age: 40,
};

const somethingElse = {
    foo: "bar",
};

test("An Individual", () => {
    expect(isIndividual(anIndividual)).toBeTruthy();
});
test("An Individual Without Type", () => {
    expect(isIndividual(anIndividualWithoutType)).toBeTruthy();
});
test("An Individual Without Name", () => {
    expect(isIndividual(anIndividualWithoutName)).toBeFalsy();
});
test("An Individual Without Age", () => {
    expect(isIndividual(anIndividualWithoutAge)).toBeFalsy();
});
test("Not An Individual", () => {
    expect(isIndividual(somethingElse)).toBeFalsy();
});
