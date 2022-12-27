import {
    FamilyGraph,
    FamilyGraphParameter,
    FamilyGraphStrictMode,
} from "./interface/familyGraph";
import { Individual, isIndividual } from "./interface/individual";
import { Graph, json as GraphJson } from "graphlib";
import { array } from "yargs";
import assert = require("assert");
import {
    isRelation,
    isRelationChildren,
    isRelationCouple,
    isRelationDependent,
    Relation,
    RelationChildren,
    RelationCouple,
    RelationDependent,
} from "./interface/relation";

export class Family implements FamilyGraph {
    name: string;
    StrictMode: FamilyGraphStrictMode;
    private _graph: Graph;
    constructor(params?: Partial<FamilyGraphParameter>) {
        this._graph = new Graph({ multigraph: true });

        this.name = params?.name || "Unnamed Family";
        this.StrictMode = FamilyGraphStrictMode.Strict;
        if (params?.StrictMode !== undefined) {
            this.StrictMode = params.StrictMode;
        }
    }

    validateIndividualExist(individualsToCheck: Individual[]) {
        for (const individu of individualsToCheck) {
            if (!this.existInFamily(individu)) {
                switch (this.StrictMode) {
                    case FamilyGraphStrictMode.Strict:
                        throw new Error(
                            `Family member '${individu.name}' doesn't exist`,
                        );
                        break;

                    case FamilyGraphStrictMode.Warn:
                        console.warn(
                            `Family member '${individu.name}' doesn't exist. Adding it to the family`,
                        );

                    case FamilyGraphStrictMode.NotScrict:
                        break;

                    default:
                        throw new Error("Case not implemented.");
                        break;
                }
                this._graph.setNode(individu.name, individu);
            }
        }
    }

    linkCouple(individu1: Individual, individu2: Individual): void;
    linkCouple(individus: [Individual, Individual]): void;
    linkCouple(
        individu: Individual | [Individual, Individual],
        ...rest: Individual[]
    ): void {
        const couple = Array.of(individu).flat();
        couple.push(...rest);
        if (couple.length != 2) {
            throw new Error("To link couple, 2 unique individual are required");
        }

        this.validateIndividualExist(couple);
        const thisRelation: RelationCouple = {
            relationType: "Couple",
            couple: couple.map((v) => v.name),
        };
        this.setRelation(couple, thisRelation);
    }

    linkDependent(
        responsable: Individual,
        dependent: Individual | Individual[],
        dependentTime: number,
    ): void {
        const dependentArray = Array.of(dependent).flat();
        this.validateIndividualExist(Array.of(responsable, dependent).flat());

        dependentArray.forEach((dependentIndividual) => {
            const thisRelation: RelationDependent = {
                relationType: "Dependent",
                responsable: responsable.name,
                dependent: dependentIndividual.name,
                time_pct: dependentTime,
            };

            this.setRelation(responsable, dependentIndividual, thisRelation);
        });
    }

    setRelation(individus: Individual[], relation: Relation): void;
    setRelation(
        source: Individual,
        target: Individual,
        relation: Relation,
    ): void;
    setRelation(
        param1: Individual | Individual[],
        param2: Individual | Relation,
        param3?: Relation,
    ): void {
        if (
            isIndividual(param1) &&
            isIndividual(param2) &&
            isRelation(param3)
        ) {
            this._graph.setEdge(param1.name, param2.name, param3, param3.relationType);
            return;
        } else if (Array.isArray(param1) && isRelation(param2)) {
            if (param1.length == 2) {
                this._graph.setEdge(
                    param1[0].name,
                    param1[1].name,
                    param2,
                    param2.relationType,
                );
                return;
            }
            throw new Error(
                "It is required to have only 2 individual for a relation",
            );
        }

        throw new Error("Parameter mix not handled");
    }

    getRelation<T>(fn:(obj:any)=>obj is T):T[]{
        return this._graph
            .edges()
            .map((e) => this._graph.edge(e))
            .filter(fn);
    
    }

    getCoupleRelation(): RelationCouple[] {
        return this.getRelation(isRelationCouple)
    }
    getChildrenRelation(): RelationChildren[] {
        return this.getRelation(isRelationChildren)
    }
    getDependentRelation(): RelationDependent[] {
        return this.getRelation(isRelationDependent)
    }

    existInFamily(individuals: Individual | Individual[]): boolean {
        const individualsName = this.getAllIndividual().map((i) => {
            return i.name;
        });
        const individualToTest = Array.of(individuals).flat();

        return individualToTest.some((individu) => {
            return individualsName.includes(individu.name);
        });
    }

    addIndividual(individuals: Individual): Individual;
    addIndividual(...individuals: Individual[]): Individual[];
    addIndividual(individuals: Individual[]): Individual[];
    addIndividual(
        individuals: Individual | Individual[],
        ...rest: Individual[]
    ): Individual | Individual[] {
        const individualToAdd = Array.of(individuals).flat();
        individualToAdd.push(...rest);
        let filteredIndividual: Individual[];

        if (
            this.StrictMode === FamilyGraphStrictMode.Strict &&
            this.existInFamily(individualToAdd)
        ) {
            throw new Error("An individual already exist");
        }

        filteredIndividual = individualToAdd.filter((individu) => {
            if (this.existInFamily(individu)) {
                if (this.StrictMode === FamilyGraphStrictMode.Warn) {
                    console.warn(
                        `Family member with name ${individu.name} already exist and will be skip`,
                    );
                }
                return false;
            }
            return true;
        });

        filteredIndividual.forEach((individu) => {
            this._graph.setNode(individu.name, individu);
        });

        if (filteredIndividual.length == 1) {
            return individualToAdd[0];
        }
        return filteredIndividual;
    }

    getAllIndividual(): Individual[] {
        return this._graph.nodes().map((name) => {
            return this._graph.node(name) as Individual;
        });
    }

    linkChildren(
        child: Individual | Individual[],
        parent1: Individual,
        parent2?: Individual,
    ): void;
    linkChildren(
        child: Individual | Individual[],
        parents: [Individual]|[Individual, Individual],
    ): void;
    linkChildren(
        child: Individual | Individual[],
        parent1: Individual | [Individual]|[Individual, Individual],
        parent2?: Individual | undefined,
    ): void {
        const children = Array.of(child).flat();
        const parents = Array.of(parent1, parent2).flat().filter(isIndividual);

        for (const c of children) {
            const relationParent: RelationChildren = {
                relationType: "Children",
                parents: parents.map((v) => v.name),
                child: c.name,
            };
            for (const p of parents) {
                this.setRelation(p, c, relationParent);
            }
        }
    }

    getjson() {
        return GraphJson.write(this._graph);
    }
}
