import { Individual } from "./individual";

export interface FamilyGraph {
    name?: string;
    addIndividual(i: Individual): Individual;
    addIndividual(...i: Individual[]): Individual[];
    addIndividual(i: Individual[]): Individual[];
    getAllIndividual():Individual[];
    /////////////
    linkCouple(chef: Individual, other: Individual): void;
    linkCouple(i: [Individual, Individual]): void;

    /////////////
    linkChildren(child: Individual | Individual[], ...parents: [Individual, Individual?]): void;

    linkChildren(child: Individual | Individual[], parents: [Individual, Individual?]): void;

    /////////////
    linkDependent(responsable: Individual | Individual[], dependent: Individual, dependentTime: number): void;
}
