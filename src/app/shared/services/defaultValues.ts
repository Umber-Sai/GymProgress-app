

import { DataObjectType } from "src/app/type/data-object.type"
import { ExerciseGroupsType } from "src/app/type/exercise-groups.type"
import { ExerciseHistoryType } from "src/app/type/exercise-history.type"
import { ExreciseNameIdType } from "src/app/type/exercise.type"



export const defaultExerciseGroups: ExerciseGroupsType = {
    gr0001 : [
        'ex0001'
    ],
    gr0002 : [
        'ex0002'
    ],
    gr0003 : [
        'ex0003'
    ],
    gr0004 : [
        'ex0004'
    ],
    gr0005 : [
        'ex0005'
    ],
    gr0000 : []

}

export const defaultGroups : DataObjectType = {
    'gr0001' : 'chest',
    'gr0002' : 'arms',
    'gr0003' : 'legs',
    'gr0004' : 'shoulders',
    'gr0005' : 'back',
    'gr0000' : 'other',
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

//test
export const defaultHistory  : ExerciseHistoryType = [ 
   
    {
        lastTrain : '10.15.2024',
        comment : 'second comment',
        sets : undefined
    },
    {
        lastTrain : '10.10.2024',
        setsCount : 4,
        sets : {
            '3' : {r : "10", w : "20"},
        },
    },
    {
        lastTrain : '10.06.2024',
    },
    {
        lastTrain : '10.05.2024',
        setsCount : 2,
        sets : {
            2 : {r : "10", w : "25"},
        },
    },
    {
        lastTrain : '11.01.2024',
        comment : 'first comment'
    },
    {
        lastTrain : '10.01.2024',
        setsCount : 3,
        sets : {
            '0' : {r : "10", w : "20"},
            '1' : {r : "10", w : "20"},
            '2' : {r : "10", w : "20"},
        },
        comment : 'first comment'
    },
    
        
]