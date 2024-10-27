import { Injectable } from '@angular/core';
import { ExerciseCompareType } from 'src/app/type/exercise-compare.type';
import { ExerciseType } from 'src/app/type/exercise.type';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private exercisesKey: string = 'exercises';
  private newExerciseCountKey: string = 'newExerciseCount';

  constructor() { }

  saveExercises(exercises: ExerciseType[]) {
    sessionStorage.setItem(this.exercisesKey, JSON.stringify(exercises));
  }

  getExercises() : ExerciseType[] {
    const exercises = sessionStorage.getItem(this.exercisesKey);
    if(exercises) return JSON.parse(exercises);
    return []
  }

  saveNewExerciseCount(newExerciseCount: number) : void {
    sessionStorage.setItem(this.newExerciseCountKey, JSON.stringify(newExerciseCount));
  }

  getNewExerciseCount() : number {
    const newExerciseCount = sessionStorage.getItem(this.newExerciseCountKey);
    if(newExerciseCount) return JSON.parse(newExerciseCount);
    return 0
  }

 
}
