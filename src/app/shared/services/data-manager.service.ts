import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ExerciseGroupsType } from '../../type/exercise-groups.type';
import { ExerciseDescriptionType, ExreciseNameIdType } from '../../type/exercise.type';
import { AutoCompliterType } from '../../type/autocompleter.type';
import { ExerciseHistoryType, ExerciseSetsType, ExerciseSetType } from '../../type/exercise-history.type';
import { DefaultResponceType } from '../../type/default-responce.type';
import { Subject } from 'rxjs';
import { DataObjectType } from 'src/app/type/data-object.type';
import { SessionStorageService } from './session-storage.service';


@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  private exercisesIdName: DataObjectType = {}
  $exerciseNameById: Subject<DataObjectType> = new Subject<DataObjectType>() //????
  get exerciseNameById() {
    return this.exercisesIdName;
  }

  private exercisesNameId: DataObjectType = {}
  get exerciseIdByName() {
    return this.exercisesNameId;
  }

  constructor(
    private localStorageService: LocalStorageService,
    private sessionStorageService : SessionStorageService
  ) {
    this.makeExerciseObjects(this.localStorageService.getAllExercises());
    this.localStorageService.$allExercises.subscribe(allExercises => this.makeExerciseObjects(allExercises));
  }

  private makeExerciseObjects(allExercises: ExreciseNameIdType[]): void {
    this.exercisesIdName = {}
    this.exercisesNameId = {}
    allExercises.forEach(exercise => {
      this.exercisesIdName[exercise.id] = exercise.name;
      this.exercisesNameId[exercise.name] = exercise.id;
    });
    this.$exerciseNameById.next(this.exercisesIdName)
  }


  getAllExerciseNames(): string[] {
    return this.localStorageService.getAllExercises().map(item => item.name);
  }

  filterExercises(val: string): AutoCompliterType[] {
    const exerciseGroupsId: ExerciseGroupsType = this.localStorageService.getExerciseGroups();
    const groupsIdName: DataObjectType = this.localStorageService.getGroups();
    let filteredExerciseData: AutoCompliterType[] = [];
    Object.keys(exerciseGroupsId).forEach(group => {
      if (groupsIdName[group].includes(val) && exerciseGroupsId[group].length > 0) {
        filteredExerciseData.unshift({
          group: groupsIdName[group],
          exercises: exerciseGroupsId[group].map(exerciseId => this.exerciseNameById[exerciseId])
        });
        return
      }

      const searchedExercises = exerciseGroupsId[group].map(item => this.exercisesIdName[item]).filter(exrcs => exrcs.includes(val));
      if (searchedExercises.length > 0) {
        filteredExerciseData.push({
          group: groupsIdName[group],
          exercises: searchedExercises
        })
      }
    })
    return filteredExerciseData
  }


  findGroup(exerciseId: string): string {
    const exerciseGroupsId: ExerciseGroupsType = this.localStorageService.getExerciseGroups();
    const groupsIdName: DataObjectType = this.localStorageService.getGroups();
    const group = Object.keys(groupsIdName).find(group => {
      return exerciseGroupsId[group].includes(exerciseId);
    });
    return group ? group : 'gr0000';
  }

  get exerciseCount(): number {
    return Object.keys(this.exercisesIdName).length
  }

  generateExerciseId(): string {
    const sessionId : number[] = this.sessionStorageService.getNewExercisesId().map(item => +item.replace('ex', ''));
    const allExerciseId = this.localStorageService.getAllExercises().map(item => +item.id.replace('ex', ''))
      .concat(sessionId)
      .sort((a, b) => {
      return a - b;
    });
    let newId: number = allExerciseId[0] > 1 ?
      allExerciseId[0] - 1
      : allExerciseId.find((item, index) => { return item + 1 != allExerciseId[index + 1] })! + 1;
    return `ex${newId.toString().padStart(4, '0')}`;
  }

  collectExerciseDescriprion(exerciseId: string, date: string | null = null): ExerciseDescriptionType | DefaultResponceType {
    let history = this.localStorageService.getExerciseHistory(exerciseId);
    if (!history) return { error: true, message: 'No history data' }
    if (date) {
      const lastRecord = history.findIndex(item => item.lastTrain === date);
      if (lastRecord === -1) return { error: true, message: 'No records in this date' }
      // history = history.slice(lastRecord + 1, history.length);  //splice or slice??
    }
    return this.takeHistorySlice(history)
  }

  unzipExerciseHistory(exerciseId: string): ExerciseDescriptionType[] {
    let history = this.localStorageService.getExerciseHistory(exerciseId);
    if (!history) return []
    let unzipedHistory: ExerciseDescriptionType[] = []
    while (history.length > 0) {
      unzipedHistory.push(this.takeHistorySlice(history));
      history.shift();
    }

    return unzipedHistory
  }

  takeHistorySlice(history: ExerciseHistoryType): ExerciseDescriptionType {

    const setsCount = history.filter(item => item.hasOwnProperty('setsCount'))[0].setsCount!;
    const setsList: ExerciseSetsType[] = history.filter(item => item.hasOwnProperty('sets')).map(item => item.sets) as ExerciseSetsType[];
    let sets: ExerciseSetType[] = [];
    for (let i = 0; i < setsCount; i++) {
      const setsByIndex = setsList.filter(item => item[i]).map(item => item[i]); //{w? : '', r? : ''}[]
      sets.push({
        w: setsByIndex.find(item => item.w)!.w,
        r: setsByIndex.find(item => item.r)!.r
      })
    }

    return {
      lastTrain: history[0].lastTrain,
      setsCount: history.filter(item => item.hasOwnProperty('setsCount'))[0].setsCount!,
      sets: sets,
      comment: history.filter(item => item.hasOwnProperty('comment'))[0].comment!,
    }
  }

}


