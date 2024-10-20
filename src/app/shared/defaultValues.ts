

import { ExercisesGroupsType } from "../type/exercise-groups.type"
import { ExreciseNameIdType } from "../type/exercise.type"

export const defaultExerciseGroups: ExercisesGroupsType = {
    chest : [
        'ex0001'
    ],
    arms : [
        'ex0002'
    ],
    legs : [
        'ex0003'
    ],
    shoulders : [
        'ex0004'
    ],
    back : [
        'ex0005'
    ],
    other : []

}

export const defaultAllExercises: ExreciseNameIdType[] = [
    {
        id: 'ex0001',
        name: 'bench press'
    },
    {
        id: 'ex0002',
        name: 'ez-bar curl'
    },
    {
        id: 'ex0003',
        name: 'barbell squat'
    },
    {
        id: 'ex0004',
        name: 'dumbbell side raise'
    },
    {
        id: 'ex0005',
        name : 'lat pulldown'
    },
    {
        id: 'ex0006',
        name : 'back Extension'
    }
]