import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ExerciseGroupsType } from '../../type/exercise-groups.type';
import { ExerciseDescriptionType, ExreciseNameIdType } from '../../type/exercise.type';
import { AutoCompliterType } from '../../type/autocompleter.type';
import { ExerciseHistoryType } from '../../type/exercise-history.type';
import { DefaultResponceType } from '../../type/default-responce.type';
import { Subject } from 'rxjs';
import { DataObjectType } from 'src/app/type/data-object.type';


@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  private exercisesIdName : DataObjectType = {}
  $exerciseNameById: Subject<DataObjectType> = new Subject<DataObjectType>() //????
  get exerciseNameById () {
    return this.exercisesIdName;
  }

  private exercisesNameId : DataObjectType = {}
  get exerciseIdByName () {
    return this.exercisesNameId;
  }

  constructor(
    private localStorageService : LocalStorageService
  ) {
    this.makeExerciseObjects(this.localStorageService.getAllExercises());
    this.localStorageService.$allExercises.subscribe(allExercises => this.makeExerciseObjects(allExercises));
  }

  private makeExerciseObjects (allExercises : ExreciseNameIdType[]) : void {
    this.exercisesIdName = {}
    this.exercisesNameId = {}
    allExercises.forEach(exercise => {
      this.exercisesIdName[exercise.id] = exercise.name;
      this.exercisesNameId[exercise.name] = exercise.id;
    });
    this.$exerciseNameById.next(this.exercisesIdName)
  }


  getAllExerciseNames () : string[] {
    return this.localStorageService.getAllExercises().map(item => item.name);
  }

  filterExercises (val: string) : AutoCompliterType[] {
    const exerciseGroupsId : ExerciseGroupsType = this.localStorageService.getExerciseGroups();
    const groupsIdName : DataObjectType = this.localStorageService.getGroups();
    let filteredExerciseData : AutoCompliterType[] = [];
    Object.keys(exerciseGroupsId).forEach(group => {
      if(groupsIdName[group].includes(val) && exerciseGroupsId[group].length > 0) {
        filteredExerciseData.unshift({
          group : groupsIdName[group],
          exercises : exerciseGroupsId[group].map(exerciseId => this.exerciseNameById[exerciseId])
        });
        return
      }

      const searchedExercises = exerciseGroupsId[group].map(item => this.exercisesIdName[item]).filter(exrcs => exrcs.includes(val));
      if(searchedExercises.length > 0) {
        filteredExerciseData.push({
          group : groupsIdName[group],
          exercises : searchedExercises
        })
      }
    })
    return filteredExerciseData
  }


  findGroup(exerciseId : string): string {
    const exerciseGroupsId : ExerciseGroupsType = this.localStorageService.getExerciseGroups();
    const groupsIdName : DataObjectType = this.localStorageService.getGroups();
    const group = Object.keys(groupsIdName).find(group => {
      return exerciseGroupsId[group].includes(exerciseId);
    });
    return group ? group : 'gr0000';
  }

  get exerciseCount () : number {
    return Object.keys(this.exercisesIdName).length
  }

  collectExerciseDescriprion(exerciseId: string, date: string | null = null): ExerciseDescriptionType | DefaultResponceType {
    let history = this.localStorageService.getExerciseHistory(exerciseId);
    if (date) {
      const lastRecord = history.find(item => item.date === date);
      if (!lastRecord) return { error: true, message: 'No records in this date' }
      const index = history.indexOf(lastRecord);
      history = history.slice(0, index + 1);  //splice or slice??
    }
    console.log(history)
    if(history.length === 0) {
      return { error: true, message: 'No history records' }
    }
    return this.takeHistorySlice(history)
  }

  unzipExerciseHistory(exerciseId: string): ExerciseDescriptionType[] {
    let history = this.localStorageService.getExerciseHistory(exerciseId);
    let unzipedHistory: ExerciseDescriptionType[] = []
    console.log(history)
    while (history.length > 0) {
      unzipedHistory.push(this.takeHistorySlice(history));
      history.shift();
    }

    return unzipedHistory
  }

  takeHistorySlice (history : ExerciseHistoryType[]): ExerciseDescriptionType {
    return {
      lastTrain: history[0]!.date,
      weight: history.filter(item => item.hasOwnProperty('weight'))[0]!.weight!,
      repeats: history.filter(item => item.hasOwnProperty('repeats'))[0]!.repeats!,
      comment: history.filter(item => item.hasOwnProperty('comment'))[0]!.comment!,
    }
  }

}


