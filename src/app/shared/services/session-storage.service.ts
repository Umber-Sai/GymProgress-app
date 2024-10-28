import { Injectable } from '@angular/core';
import { ExerciseCompareType } from 'src/app/type/exercise-compare.type';
import { ExerciseType } from 'src/app/type/exercise.type';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private exercisesKey: string = 'exercises';
  private newExerciseIdKey: string = 'newExerciseId';

  constructor() { }

  saveExercises(exercises: ExerciseType[]) {
    sessionStorage.setItem(this.exercisesKey, JSON.stringify(exercises));
  }

  getExercises() : ExerciseType[] {
    const exercises = sessionStorage.getItem(this.exercisesKey);
    if(exercises) return JSON.parse(exercises);
    return []
  }




  setNewExercisesId(newExerciseIdArray: string[]) : void {
    sessionStorage.setItem(this.newExerciseIdKey, JSON.stringify(newExerciseIdArray));
  }

  getNewExercisesId() : string[] {
    const idString = sessionStorage.getItem(this.newExerciseIdKey);
    if(idString) return JSON.parse(idString);
    return []
  }

  addNewExercisesId(newExerciseId : string) {
    const exerciseIdArray : string[] = this.getNewExercisesId();
    exerciseIdArray.push(newExerciseId);
    this.setNewExercisesId(exerciseIdArray);
  }

  removeNewExercisesId(exerciseId : string) {
    const exerciseIdArray : string[] = this.getNewExercisesId();
    const newArray = exerciseIdArray.filter(item => item != exerciseId);
    this.setNewExercisesId(newArray);
  }

 
}
