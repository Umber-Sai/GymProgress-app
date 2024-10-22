import { Injectable } from '@angular/core';
import { ExerciseCompareType } from 'src/app/type/exercise-compare.type';
import { ExerciseType } from 'src/app/type/exercise.type';

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
