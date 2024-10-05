import { Injectable } from '@angular/core';
import { ExerciseType } from '../type/exercise.type';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private exercisesKey : string = 'exercises'
  private allExercisesKey: string = 'allExercises'
  constructor() { 
    const minExrcsCollection : string[] = ['chest press', 'leg curl', 'arm curls', 'shoulder press'];
    this.setAllExercises(minExrcsCollection)
  }

  savingExercises (exercises : ExerciseType[]) {
    sessionStorage.setItem(this.exercisesKey, JSON.stringify(exercises));
  }

  getAllExercises () : string[]{
    const string = localStorage.getItem(this.allExercisesKey);
    if(string) return JSON.parse(string)
    return []
  }

  setAllExercises (allExercises : string[]) {
    localStorage.setItem(this.allExercisesKey, JSON.stringify(allExercises));
  }
}


