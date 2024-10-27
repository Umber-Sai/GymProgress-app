import { ExerciseSetsType, ExerciseSetType } from "./exercise-history.type"


export type ExerciseType = {
    id : string,
    group : string,
    name: string,
    description : ExerciseDescriptionType,
    sets : ExerciseSetType[],
    comment : string
}

export type ExerciseDescriptionType = {
    lastTrain : string,
    setsCount : number,
    sets : ExerciseSetType[],
    comment: string,
}

export type ExreciseNameIdType = {
    name: string,
    id: string
}