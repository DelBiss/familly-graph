import { Family } from "../index";
import { Individual } from "../interface/individual";
import { isRelationChildren, RelationChildren, RelationCouple, RelationDependent } from "../interface/relation";

let fam: Family;
// const individu: Individual[] = [
//     { name: "Papa", age: 40 },
//     { name: "Maman", age: 38 },
//     { name: "Enfant", age: 15 },
// ];

const AdulteA:Individual = {name:"Adulte A: Conjoint de B", age:30}
const AdulteB:Individual = {name:"Adulte B: Conjoint de A; Parent de V, W et X, Gardien de V et W", age:30}
const AdulteC:Individual = {name:"Adulte C: Conjoint de D; Parent de W, X et Y; Gardien de X", age:30}
const AdulteD:Individual = {name:"Adulte D: Conjoint de C; Parent de Y et Z; Gardien de Y", age:30}
const AdulteE:Individual = {name:"Adulte E: Parent de Z; Gardien de Z", age:30}
const EnfantV :Individual = {name:"Enfant W: Enfant de B; Sous responsabilité de B", age:30}
const EnfantW :Individual = {name:"Enfant W: Enfant de B et C; Sous responsabilité de B", age:30}
const EnfantX :Individual = {name:"Enfant X: Enfant de B et C; Sous responsabilité de C", age:30}
const EnfantY :Individual = {name:"Enfant Y: Enfant de C et D; Sous responsabilité de D", age:30}
const EnfantZ :Individual = {name:"Enfant Z: Enfant de D et E; Sous responsabilité de E", age:30}

const individu_test = [
    AdulteA,
    AdulteB,
    AdulteC,
    AdulteD,
    AdulteE,
    EnfantV,
    EnfantW,
    EnfantX,
    EnfantY,
    EnfantZ
]

const couple_test:[Individual,Individual][] = [
    [AdulteB,AdulteA],
    [AdulteC,AdulteD]
]

const children_test:[Individual[],[Individual]|[Individual,Individual]][] = [
    [[EnfantV],[AdulteB]],
    [[EnfantW,EnfantX],[AdulteB,AdulteC]],
    [[EnfantY],[AdulteC,AdulteD]],
    [[EnfantZ],[AdulteD,AdulteE]]
]

const dependent_test:[Individual,Individual[],number][] = [
    [AdulteB,[EnfantV,EnfantW],0.73],
    [AdulteC,[EnfantX],0.65],
    [AdulteD,[EnfantY],1],
    [AdulteE,[EnfantZ],0.85]
]

const createdCoupleRelation:RelationCouple[] = couple_test.map(
    (c) =>{
        return {
            relationType:"Couple",
            couple: c.map((v)=>v.name)
        }
    }
)

const createdChildrenRelation:RelationChildren[] = children_test.map(
    (rc):RelationChildren[]=>{
       return rc[0].map(
        (c):RelationChildren=>{
            return {
                relationType:"Children",
                child: c.name,
                parents: rc[1].map((v)=>v?.name)
            }
        }
       ) 
    }
).flat()

const createdDependentRelation:RelationDependent[] = dependent_test.map(
    (rd):RelationDependent[]=>{
       return rd[1].map(
        (c):RelationDependent=>{
            return {
                relationType:"Dependent",
                responsable:rd[0].name,
                dependent:c.name,
                time_pct:rd[2]
            }
        }
       ) 
    }
).flat()

describe("Couple Relation", () => {
    beforeEach(() => {
        fam = new Family();
        fam.addIndividual(individu_test);
    });

    test("should create Couple Relation chain", () => {
        
        for(const newCouple of couple_test){
            fam.linkCouple(newCouple[0], newCouple[1]);
        }
        
        const relationResult = fam.getCoupleRelation();
        expect(relationResult).toEqual(expect.arrayContaining(createdCoupleRelation));
    });
});

describe("Children Relation", () => {
    beforeEach(() => {
        fam = new Family();
        fam.addIndividual(individu_test);
    });

    test("should create Children Relation chain", () => {
        
        for(const newChildren of children_test){
            fam.linkChildren(newChildren[0], newChildren[1]);
        }
        
        const relationResult = fam.getChildrenRelation();
        expect(relationResult).toEqual(expect.arrayContaining(createdChildrenRelation));
    });
});

describe("Dependent Relation", () => {
    beforeEach(() => {
        fam = new Family();
        fam.addIndividual(individu_test);
    });

    test("should create Dependent Relation chain", () => {
        
        for(const newDependent of dependent_test){
            fam.linkDependent(newDependent[0],newDependent[1],newDependent[2])
        }
        
        const relationResult = fam.getDependentRelation();
        expect(relationResult).toEqual(expect.arrayContaining(createdDependentRelation));
    });
});
describe("JSON", () => {
    beforeEach(() => {
        fam = new Family();
        fam.addIndividual(individu_test);
    });

    test("should create Dependent Relation chain", () => {
        
        for(const newDependent of dependent_test){
            fam.linkDependent(newDependent[0],newDependent[1],newDependent[2])
        }
        for(const newChildren of children_test){
            fam.linkChildren(newChildren[0], newChildren[1]);
        }
        for(const newCouple of couple_test){
            fam.linkCouple(newCouple[0], newCouple[1]);
        }
        console.log(JSON.stringify(fam.getjson(),undefined, 4))
        // const relationResult = fam.getDependentRelation();
        // expect(relationResult).toEqual(expect.arrayContaining(createdDependentRelation));
    });
});
