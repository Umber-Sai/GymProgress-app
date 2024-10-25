import { Injectable, Injector } from '@angular/core';
import { ExreciseNameIdType } from '../../type/exercise.type';
import { ExerciseHistoryType } from '../../type/exercise-history.type';
import { defaultAllExercises, defaultExerciseGroups, defaultGroups } from './defaultValues';
import { TrainingHistoryType } from '../../type/train-history.type';
import { Subject } from 'rxjs';
import { ExerciseGroupsType } from 'src/app/type/exercise-groups.type';
import { DataObjectType } from 'src/app/type/data-object.type';
import { DataManagerService } from './data-manager.service';




@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  private allExercisesKey: string = 'allExercises'
  private exerciseGroupsKey: string = 'exerciseGroups'
  private groupsKey: string = 'groups'
  private trainingHistoryKey: string = 'trainingHistory'

  public $groups : Subject<DataObjectType> = new Subject<DataObjectType>();
  public $allExercises : Subject<ExreciseNameIdType[]> = new Subject<ExreciseNameIdType[]>();
  constructor(
    private injector: Injector
  ) {}

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
    const exerciseExist = allExercises.findIndex(item => item.id === exerciseId);
    if(exerciseExist > -1) {
      console.log(exerciseExist)
      console.log(allExercises)
      allExercises[exerciseExist].name = exerciseName;
      console.log(allExercises)
    } else {
      allExercises.push({id : exerciseId, name: exerciseName});
    }
    this.setAllExercises(allExercises);
    this.$allExercises.next(allExercises);
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

  updateExerciseGroups(groupId: string, exerciseId : string): void {
    const exerciseGroups = this.getExerciseGroups();
    const dataManagerService = this.injector.get(DataManagerService);
    const currentGroup : string = dataManagerService.findGroup(exerciseId);
    if(currentGroup) {
      console.log(currentGroup)
      console.log(exerciseGroups[currentGroup])
      exerciseGroups[currentGroup] = exerciseGroups[currentGroup].filter(item => item != exerciseId);
    }
    console.log(exerciseGroups)

    exerciseGroups[groupId].push(exerciseId);
    this.setExerciseGroups(exerciseGroups);
  }




  getGroups () : DataObjectType {
    const string = localStorage.getItem(this.groupsKey);
    if (string) return JSON.parse(string);
    this.setGroups(defaultGroups);
    return defaultGroups;
  }

  setGroups (groups: DataObjectType): void {
    localStorage.setItem(this.groupsKey, JSON.stringify(groups));
  }

  updateGroups(groupName: string, groupId : string): void {
    const groups = this.getGroups();
    groups[groupId] = groupName;
    this.setGroups(groups);
    this.$groups.next(groups);
  }





  getExerciseHistory(exerciseId: string): ExerciseHistoryType[] {
    const string = localStorage.getItem(exerciseId);
    if (string) return JSON.parse(string);
    return []
  }

  setExerciseHistory(id: string, history: ExerciseHistoryType[]): void {
    localStorage.setItem(id, JSON.stringify(history));
  }

  updateExerciseHistory(newHistory : ExerciseHistoryType, exerciseId : string) : void {
    const history : ExerciseHistoryType[] = this.getExerciseHistory(exerciseId);
    history.unshift(newHistory);
    this.setExerciseHistory(exerciseId, history)
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


