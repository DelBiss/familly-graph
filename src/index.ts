import { FamilyGraph } from "./interface/familyGraph";
import { Individual } from "./interface/individual";
import { Graph } from "graphlib";

export class Family implements FamilyGraph {
  private _graph: Graph;
  name: string | undefined;
  addIndiviual(i: Individual): Individual {
    throw new Error("Method not implemented.");
  }

  linkCouple(chef: Individual, other: Individual): void;
  linkCouple(i: [Individual, Individual]): void;
  linkCouple(chef: unknown, other?: unknown): void {
    throw new Error("Method not implemented.");
  }

  linkDependent(
    responsable: Individual,
    dependent: Individual | Individual[],
    dependentTime: number
  ): void {
    throw new Error("Method not implemented.");
  }

  constructor(name?: string) {
    this._graph = new Graph({ multigraph: true });
    this.name = name;
  }

  linkChildren(
    child: Individual | Individual[],
    parents0: Individual,
    parents1?: Individual | undefined
  ): void;
  linkChildren(
    child: Individual | Individual[],
    parents: [Individual, (Individual | undefined)?]
  ): void;
  linkChildren(child: unknown, parents?: unknown, ...rest: Individual[]): void {
    throw new Error("Method not implemented.");
  }
}
