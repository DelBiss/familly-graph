export type Individual = {
    name: string;
    age: number;
    income?: number;
    charge?: number;
};

export function isIndividual(params: Individual | any): params is Individual {
    if (params && "name" in params && "age" in params) {
        return true;
    }
    return false;
}
