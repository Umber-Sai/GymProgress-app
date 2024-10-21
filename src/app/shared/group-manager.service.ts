import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ExerciseGroupsType } from '../type/exercise-groups.type';
import { ExreciseNameIdType } from '../type/exercise.type';
import { AutoCompliterType } from '../type/autocompleter.type';

@Injectable({
  providedIn: 'root'
})
export class GroupManagerService {


  groupsExerciseId : ExerciseGroupsType = this.localStorageService.getExerciseGroups();
  groups : string[] = Object.keys(this.groupsExerciseId)
  allExercises : ExreciseNameIdType[] = this.localStorageService.getAllExercises();

  exercisesData : {group : string, exercises : string[]}[] = [];


  constructor(
    private localStorageService : LocalStorageService
  ) {
    this.initExerciseData()
  }

  initExerciseData () {
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

}


