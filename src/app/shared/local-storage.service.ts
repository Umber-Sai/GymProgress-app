import { Injectable } from '@angular/core';
import {ExerciseDescriptionType, ExerciseType, ExreciseNameIdType } from '../type/exercise.type';
import { DefaultResponceType } from '../type/default-responce.type';
import { ExerciseHistoryType } from '../type/exercise-history.type';
import { defaultAllExercises, defaultExerciseGroups } from './defaultValues';
import { ExerciseGroupsType } from '../type/exercise-groups.type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  private allExercisesKey: string = 'allExercises'
  private exerciseGroupsKey: string = 'exerciseGroups'
  constructor() {}

  getAllExercises(): ExreciseNameIdType[] {
    const string = localStorage.getItem(this.allExercisesKey);
    if (string) return JSON.parse(string);
    this.setAllExercises(defaultAllExercises);
    return defaultAllExercises
  }
 
  setAllExercises(allExercises: ExreciseNameIdType[]): void {
    localStorage.setItem(this.allExercisesKey, JSON.stringify(allExercises));
  }

  updateAllExercises(exerciseId : string, exerciseName: string): void {
    const allExercises = this.getAllExercises();
    allExercises.push({id : exerciseId, name: exerciseName});
    this.setAllExercises(allExercises);
  }

  getExerciseGroups(): ExerciseGroupsType {
    const string = localStorage.getItem(this.exerciseGroupsKey);
    if (string) return JSON.parse(string);
    this.setExerciseGroups(defaultExerciseGroups);
    return defaultExerciseGroups
  }

  setExerciseGroups (exerciseGroups: ExerciseGroupsType): void {
    localStorage.setItem(this.exerciseGroupsKey, JSON.stringify(exerciseGroups));
  }

  updateExerciseGroups(group: string, exerciseId : string): void {
    const exerciseGroups = this.getExerciseGroups();
    exerciseGroups[group].push(exerciseId);
    this.setExerciseGroups(exerciseGroups);
  }


  getExerciseHistory(exercise: ExreciseNameIdType): ExerciseHistoryType[] | DefaultResponceType {
    const string = localStorage.getItem(exercise.id);
    if (string) return JSON.parse(string);
    return { error: true, message: 'History of exercise "' + exercise.name + '" not found' }
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

 

  collectExerciseDescriprion(exercise: ExreciseNameIdType, date: string | null = null): ExerciseDescriptionType | DefaultResponceType {
    let history: ExerciseHistoryType[] | DefaultResponceType = this.getExerciseHistory(exercise);
    if ((history as DefaultResponceType).error) return history as DefaultResponceType;
    let storage = history as ExerciseHistoryType[];
    if (date) {
      const lastRecord = storage.find(item => item.date === date);
      if (!lastRecord) return { error: true, message: 'No records in this date' }
      const index = storage.indexOf(lastRecord);
      storage = storage.slice(0, index + 1);  //splice or slice??
    }
    return {
      lastTrain: storage.at(-1)!.date,
      weight: storage.filter(item => item.hasOwnProperty('weight')).at(-1)!.weight!,
      repeats: storage.filter(item => item.hasOwnProperty('repeats')).at(-1)!.repeats!,
      comment: storage.filter(item => item.hasOwnProperty('comment')).at(-1)!.comment!,
    }
  }
}


