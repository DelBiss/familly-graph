import { Family } from "../index";
import { FamilyGraphStrictMode } from "../interface/familyGraph";
import { Individual } from "../interface/individual";

describe("Family Creation", () => {
    test("With name", () => {
        expect(new Family({ name: "Carl" }).name).toBe("Carl");
    });
    test("Without name", () => {
        expect(new Family().name).toBe("Unnamed Family");
    });
});

describe("Adding Individual", () => {
    let fam: Family;

    const individu: Individual[] = [
        { name: "Papa", age: 40 },
        { name: "Maman", age: 38 },
        { name: "Enfant", age: 15 },
    ];

    describe("No Duplication", () => {
        beforeEach(() => {
            fam = new Family();
        });

        test("One by One", () => {
            for (const i of individu) {
                const callReturn = fam.addIndividual(i);
                expect(callReturn).toEqual(i);
            }
            const allIndividu = fam.getAllIndividual();
            expect(allIndividu).toEqual(expect.arrayContaining(individu));
            expect(allIndividu).toEqual(individu);
            expect(allIndividu.length).toBe(individu.length);
        });

        test("Chain", () => {
            const callReturn = fam.addIndividual(...individu);
            expect(callReturn).toEqual(individu);

            const allIndividu = fam.getAllIndividual();
            expect(allIndividu).toEqual(expect.arrayContaining(individu));
            expect(allIndividu).toEqual(individu);
            expect(allIndividu.length).toBe(individu.length);
        });

        test("Array", () => {
            const callReturn = fam.addIndividual(individu);
            expect(callReturn).toEqual(individu);

            const allIndividu = fam.getAllIndividual();
            expect(allIndividu).toEqual(expect.arrayContaining(individu));
            expect(allIndividu).toEqual(individu);
            expect(allIndividu.length).toBe(individu.length);
        });
    });

    describe("With Duplication", () => {
        const unique_individu: Individual[] = [
            { name: "Tante", age: 40 },
            { name: "Oncle", age: 38 },
        ];

        const duplicated_individu: Individual[] = [{ name: "Papa", age: 40 }];

        const test_individu = Array.of(
            unique_individu,
            duplicated_individu,
        ).flat();
        const result_unique = Array.of(individu, unique_individu).flat();

        describe("Strict", () => {
            beforeEach(() => {
                fam = new Family({ StrictMode: FamilyGraphStrictMode.Strict });
                fam.addIndividual(individu);
            });

            test("One by One", () => {
                for (const i of duplicated_individu) {
                    expect(() => {
                        fam.addIndividual(i);
                    }).toThrow();
                }
                const r = fam.getAllIndividual();
                expect(r).toEqual(expect.arrayContaining(individu));
                expect(r).toEqual(individu);
                expect(r.length).toBe(individu.length);
            });

            test("Chain", () => {
                expect(() => {
                    const callReturn = fam.addIndividual(...test_individu);
                    expect(callReturn).toEqual(unique_individu);
                }).toThrow();

                const allIndividu = fam.getAllIndividual();
                expect(allIndividu).toEqual(expect.arrayContaining(individu));
                expect(allIndividu).toEqual(individu);
                expect(allIndividu.length).toBe(individu.length);
            });

            test("Array", () => {
                expect(() => {
                    const callReturn = fam.addIndividual(test_individu);
                    expect(callReturn).toEqual(unique_individu);
                }).toThrow();

                const allIndividu = fam.getAllIndividual();
                expect(allIndividu).toEqual(expect.arrayContaining(individu));
                expect(allIndividu).toEqual(individu);
                expect(allIndividu.length).toBe(individu.length);
            });
        });
        describe("Warn", () => {
            const logSpy = jest.spyOn(console, "warn");

            beforeEach(() => {
                fam = new Family({ StrictMode: FamilyGraphStrictMode.Warn });
                fam.addIndividual(individu);
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            test("One by One", () => {
                for (const i of duplicated_individu) {
                    fam.addIndividual(i);
                }
                expect(logSpy).toHaveBeenCalledTimes(
                    duplicated_individu.length,
                );
                const r = fam.getAllIndividual();
                expect(r).toEqual(expect.arrayContaining(individu));
                expect(r).toEqual(individu);
                expect(r.length).toBe(individu.length);
            });

            test("Chain", () => {
                const callReturn = fam.addIndividual(...test_individu);
                expect(logSpy).toHaveBeenCalledTimes(
                    duplicated_individu.length,
                );
                expect(callReturn).toEqual(unique_individu);

                const allIndividu = fam.getAllIndividual();
                expect(allIndividu).toEqual(
                    expect.arrayContaining(result_unique),
                );
                expect(allIndividu).toEqual(result_unique);
                expect(allIndividu.length).toBe(result_unique.length);
            });

            test("Array", () => {
                const callReturn = fam.addIndividual(test_individu);
                expect(logSpy).toHaveBeenCalledTimes(
                    duplicated_individu.length,
                );
                expect(callReturn).toEqual(unique_individu);

                const allIndividu = fam.getAllIndividual();
                expect(allIndividu).toEqual(
                    expect.arrayContaining(result_unique),
                );
                expect(allIndividu).toEqual(result_unique);
                expect(allIndividu.length).toBe(result_unique.length);
            });
        });
        describe("Not Strict", () => {
            const logSpy = jest.spyOn(console, "warn");

            beforeEach(() => {
                fam = new Family({
                    StrictMode: FamilyGraphStrictMode.NotScrict,
                });
                fam.addIndividual(individu);
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            test("One by One", () => {
                for (const i of duplicated_individu) {
                    fam.addIndividual(i);
                }
                expect(logSpy).toHaveBeenCalledTimes(0);
                const r = fam.getAllIndividual();
                expect(r).toEqual(expect.arrayContaining(individu));
                expect(r).toEqual(individu);
                expect(r.length).toBe(individu.length);
            });

            test("Chain", () => {
                const callReturn = fam.addIndividual(...test_individu);
                expect(logSpy).toHaveBeenCalledTimes(0);
                expect(callReturn).toEqual(unique_individu);

                const allIndividu = fam.getAllIndividual();
                expect(allIndividu).toEqual(
                    expect.arrayContaining(result_unique),
                );
                expect(allIndividu).toEqual(result_unique);
                expect(allIndividu.length).toBe(result_unique.length);
            });

            test("Array", () => {
                const callReturn = fam.addIndividual(test_individu);
                expect(logSpy).toHaveBeenCalledTimes(0);
                expect(callReturn).toEqual(unique_individu);

                const allIndividu = fam.getAllIndividual();
                expect(allIndividu).toEqual(
                    expect.arrayContaining(result_unique),
                );
                expect(allIndividu).toEqual(result_unique);
                expect(allIndividu.length).toBe(result_unique.length);
            });
        });
    });
});
