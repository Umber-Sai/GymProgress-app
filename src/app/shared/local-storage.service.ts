import { Injectable } from '@angular/core';
import {ExerciseType, ExreciseNameIdType } from '../type/exercise.type';
import { DefaultResponceType } from '../type/default-responce.type';
import { ExerciseHistoryType } from '../type/exercise-history.type';

@Injectable({
  providedIn: 'root'
})
export class LockalStorageService {
  
  private allExercisesKey: string = 'allExercises'
  constructor() {}

  getAllExercises(): ExreciseNameIdType[] {
    const string = localStorage.getItem(this.allExercisesKey);
    if (string) return JSON.parse(string)
    this.setAllExercises([]);
    return []
  }
 
  setAllExercises(allExercises: ExreciseNameIdType[]): void {
    localStorage.setItem(this.allExercisesKey, JSON.stringify(allExercises));
  }

  getExerciseHistory(exercise: ExreciseNameIdType): ExerciseHistoryType[] | DefaultResponceType {
    const string = localStorage.getItem(exercise.id);
    if (string) return JSON.parse(string);
    return { error: true, message: 'exercise "' + exercise.name + '" not found' }
  }

  setExerciseHistory(id: string, history: ExerciseHistoryType[]): void {
    localStorage.setItem(id, JSON.stringify(history));
  }

  updateExerciseHistory(newHistory : ExerciseHistoryType, exercise : ExreciseNameIdType) : void {
    const history = this.getExerciseHistory(exercise);
    if((history as DefaultResponceType).error) {
      alert('create new history record');
      this.setExerciseHistory(exercise.id, [newHistory]);
      return
    }
    (history as ExerciseHistoryType[]).push(newHistory);
    this.setExerciseHistory(exercise.id, history as ExerciseHistoryType[])
  }

  updateAllExercises(exercise : ExreciseNameIdType): void {
    const allExercises = this.getAllExercises();
    allExercises.push(exercise);
    this.setAllExercises(allExercises);
  }

  collectExerciseDescriprion(exercise: ExreciseNameIdType, date: string | null = null): ExerciseType | DefaultResponceType {
    let history: ExerciseHistoryType[] | DefaultResponceType = this.getExerciseHistory(exercise);
    if ((history as DefaultResponceType).error) return history as DefaultResponceType;
    let storage = history as ExerciseHistoryType[];
    if (date) {
      const lastRecord = storage.find(item => item.date === date);
      if (!lastRecord) return { error: true, message: 'No records in this date' }
      const index = storage.indexOf(lastRecord);
      storage = storage.splice(0, index + 1);
    }
    return {
      id: exercise.id,
      name: exercise.name,
      weight: storage.filter(item => item.hasOwnProperty('weight')).at(-1)!.weight!,
      repeats: storage.filter(item => item.hasOwnProperty('repeats')).at(-1)!.repeats!,
      comment: storage.filter(item => item.hasOwnProperty('comment')).at(-1)!.comment!,
    }
  }
}


