import { FamilyGraph } from "./interface/familyGraph";
import { Individual } from "./interface/individual";
import { Graph } from "graphlib";
import { array } from "yargs";

export class Family implements FamilyGraph {
    private _graph: Graph;
    name: string | undefined;

    linkCouple(chef: Individual, other: Individual): void;
    linkCouple(i: [Individual, Individual]): void;
    linkCouple(chef: Individual | [Individual, Individual], other?: Individual): void {
        let _chef: Individual;
        let _other: Individual;

        if ("name" in chef) {
            _chef = chef;
            _other = other!;
        } else {
            _chef = chef[0];
            _other = chef[1];
        }
        throw new Error("Method not implemented.");
    }

    linkDependent(responsable: Individual, dependent: Individual | Individual[], dependentTime: number): void {
        throw new Error("Method not implemented.");
    }

    constructor(name?: string) {
        this._graph = new Graph({ multigraph: true });
        this.name = name;
    }
    addIndividual(i: Individual): Individual;
    addIndividual(...i: Individual[]): Individual[];
    addIndividual(i: Individual[]): Individual[];
    addIndividual(i: Individual | Individual[], ...rest: Individual[]): Individual | Individual[] {
        if (!("name" in i) || rest.length > 0) {
            if ("name" in i) {
                rest.unshift(i);
            } else {
                rest.unshift(...i);
            }
            rest.forEach((v) => {
                this.addIndividual(v);
            });
            return rest;
        }
        this._graph.setNode(i.name, i);
        return i;
        throw new Error("Method not implemented.");
    }
    getAllIndividual(): Individual[] {
        return this._graph.nodes().map((name) => {
            return this._graph.node(name) as Individual;
        });
    }

    linkChildren(child: Individual | Individual[], parents0: Individual, parents1?: Individual | undefined): void;
    linkChildren(child: Individual | Individual[], parents: [Individual, (Individual | undefined)?]): void;
    linkChildren(child: unknown, parents?: unknown, ...rest: Individual[]): void {
        throw new Error("Method not implemented.");
    }
}
