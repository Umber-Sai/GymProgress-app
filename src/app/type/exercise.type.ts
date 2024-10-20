

// export type ExerciseType = {
//     id : string,
//     lastTrain : string,
//     type : string,
//     name: string,
//     weight: string,
//     repeats: string,
//     comment: string,
// }

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