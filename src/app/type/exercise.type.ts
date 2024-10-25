

export type ExerciseType = {
    id : string,
    group : string,
    name: string,
    description : ExerciseDescriptionType
   
}

export type ExerciseDescriptionType = {
    lastTrain : string,
    weight: string,
    repeats: string,
    comment: string,
}

export type ExreciseNameIdType = {
    name: string,
    id: string
}