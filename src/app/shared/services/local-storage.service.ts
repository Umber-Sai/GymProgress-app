import { Injectable } from '@angular/core';
import { ExreciseNameIdType } from '../../type/exercise.type';
import { DefaultResponceType } from '../../type/default-responce.type';
import { ExerciseHistoryType } from '../../type/exercise-history.type';
import { defaultAllExercises, defaultExerciseGroups } from './defaultValues';
import { ExerciseGroupsType } from '../../type/exercise-groups.type';
import { TrainingHistoryType } from '../../type/train-history.type';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  private allExercisesKey: string = 'allExercises'
  private exerciseGroupsKey: string = 'exerciseGroups'
  private trainingHistoryKey: string = 'trainingHistory'
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

  getTrainingHistory () : TrainingHistoryType[] {
    const trainingHistory = localStorage.getItem(this.trainingHistoryKey);
    if(trainingHistory) return JSON.parse(trainingHistory);
    this.setTrainingHistory([]);
    return []
  }

  setTrainingHistory (trainingHistory : TrainingHistoryType[]) {
    localStorage.setItem(this.trainingHistoryKey, JSON.stringify(trainingHistory));
  }

  updateTrainingHistory (newTrainHistory : TrainingHistoryType) {
    const trainingHistory : TrainingHistoryType[] = this.getTrainingHistory();
    trainingHistory.unshift(newTrainHistory);
    this.setTrainingHistory(trainingHistory);
  }
}


