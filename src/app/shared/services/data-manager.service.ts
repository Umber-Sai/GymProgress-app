import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ExerciseGroupsType } from '../../type/exercise-groups.type';
import { ExerciseDescriptionType, ExreciseNameIdType } from '../../type/exercise.type';
import { AutoCompliterType } from '../../type/autocompleter.type';
import { ExerciseHistoryType } from '../../type/exercise-history.type';
import { DefaultResponceType } from '../../type/default-responce.type';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {


  private groupsExerciseId : ExerciseGroupsType = this.localStorageService.getExerciseGroups();
  private groups : string[] = Object.keys(this.groupsExerciseId)
  private allExercises : ExreciseNameIdType[] = this.localStorageService.getAllExercises();

  exercisesData : {group : string, exercises : string[]}[] = [];


  constructor(
    private localStorageService : LocalStorageService
  ) {
    this.initExerciseData()
  }

  private initExerciseData () {
    this.groups.forEach(group => {
      let exercises : string[] = []
      this.groupsExerciseId[group].forEach(exerciseId => {
        const name = this.allExercises.find(item => item.id === exerciseId)!.name;
        if(!name) {
          console.log('Name of ' + exerciseId + 'not found');
          return
        }
        exercises.push(name)
      })
      this.exercisesData.push({
        group : group,
        exercises : exercises
      })
    });
    console.log(this.exercisesData)
  }


  filterExercises (val: string) : AutoCompliterType {
    let filteredExercises : AutoCompliterType = [];
    const suitableGroup = this.groups.filter(group => group.includes(val.toLowerCase()));
    if(suitableGroup) {
      suitableGroup.forEach(group => {
        const exercises = this.exercisesData.find(groups => groups.group === group)?.exercises;
        if(!exercises) return
        filteredExercises.push({
          group : group,
          exercises : exercises
        })
      });
    }
    return filteredExercises;
  }

  findGroup(exerciseId : string): string | undefined {
    return this.groups.find(group => {
      return this.groupsExerciseId[group].includes(exerciseId);
    });
  }

  findExerciseByName (name : string) : ExreciseNameIdType | undefined {
    return this.allExercises.find((item : ExreciseNameIdType) => item.name === name);
  }

  get exerciseLength () : number {
    return this.allExercises.length
  }

  collectExerciseDescriprion(exercise: ExreciseNameIdType, date: string | null = null): ExerciseDescriptionType | DefaultResponceType {
    let history: ExerciseHistoryType[] | DefaultResponceType = this.localStorageService.getExerciseHistory(exercise);
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


