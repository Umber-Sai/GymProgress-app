import { Injectable } from '@angular/core';
import { ExerciseType } from '../type/exercise.type';
import { ExerciseCompareType } from '../type/exercise-compare.type';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private exercisesKey: string = 'exercises';
  private exercisesCompareKey: string = 'exercisesCompare';

  constructor() { }

  saveExercises(exercises: ExerciseType[]) {
    sessionStorage.setItem(this.exercisesKey, JSON.stringify(exercises));
  }

  getExercises() : ExerciseType[] {
    const exercises = sessionStorage.getItem(this.exercisesKey);
    if(exercises) return JSON.parse(exercises);
    return []
  }

  saveExercisesCompare(exercisesCompare: ExerciseCompareType) : void {
    sessionStorage.setItem(this.exercisesCompareKey, JSON.stringify(exercisesCompare));
  }

  getExercisesCompare() : ExerciseCompareType {
    const exercisesCompare = sessionStorage.getItem(this.exercisesCompareKey);
    if(exercisesCompare) return JSON.parse(exercisesCompare);
    return {}
  }

 
}
