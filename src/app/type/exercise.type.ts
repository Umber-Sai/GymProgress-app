

export type ExerciseType = {
    name: string,
    sets: {
        weight: string,
        repeats: string
    }[],
    comment?: string
}