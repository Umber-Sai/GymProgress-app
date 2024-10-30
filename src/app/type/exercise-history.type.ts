import { ExerciseDescriptionType } from "./exercise.type"

export type ExerciseHistoryType = [
    ...ExerciseHistoryItemType[],
    ExerciseHistoryFirstItemType,
]


export type ExerciseHistoryItemType = {
    lastTrain : string,
    setsCount? : number,
    sets? : ExerciseHistorySetsType,
    comment? : string
}

export type ExerciseHistoryFirstItemType = {
    lastTrain : string,
    setsCount : number,
    sets : ExerciseSetsType,
    comment : string
}



export type ExerciseSetsType = {[key : string] : ExerciseSetType}
export type ExerciseHistorySetsType = {[key : string] : ExerciseHistorySetType}


export type ExerciseSetType = {'w' : string, 'r' : string}
export type ExerciseHistorySetType = {w? : string, r? : string}
