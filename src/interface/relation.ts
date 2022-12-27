export type RelationCouple = {
    relationType: "Couple";
    couple: string[];
};

export type RelationChildren = {
    relationType: "Children";
    parents: string[];
    child: string;
};

export type RelationDependent = {
    relationType: "Dependent";
    responsable: string;
    dependent: string;
    time_pct: number;
};

export type Relation = RelationChildren | RelationCouple | RelationDependent;

export function isRelation(obj: any): obj is Relation {
    return (
        isRelationChildren(obj) ||
        isRelationCouple(obj) ||
        isRelationDependent(obj)
    );
}

export function isRelationCouple(obj: any): obj is RelationCouple {
    return "relationType" in obj && obj.relationType == "Couple" && "couple" in obj;
}

export function isRelationDependent(obj: any): obj is RelationDependent {
    return (
        "relationType" in obj &&
        obj.relationType == "Dependent" &&
        "responsable" in obj &&
        "dependent" in obj &&
        "time_pct" in obj
    );
}

export function isRelationChildren(obj: any): obj is RelationChildren {
    return (
        "relationType" in obj &&
        obj.relationType == "Children" &&
        "parents" in obj
    );
}
