import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '../services/local-storage.service';
import { ExerciseType } from 'src/app/type/exercise.type';
import { DataManagerService } from '../services/data-manager.service';

@Component({
  selector: 'form-popup',
  templateUrl: './form-popup.component.html',
  styleUrls: ['./form-popup.component.scss']
})
export class FormPopupComponent implements OnInit {

  readonly data = inject<ExerciseType>(MAT_DIALOG_DATA);
  readonly groups = this.localStorageService.getGroups();
  readonly groupsId = Object.keys(this.groups);

  exerciseName = this.data.name
  exerciseGroupId = this.data.group

  constructor(
    private localStorageService : LocalStorageService,
    private dataManagerService : DataManagerService
  ) { }

  ngOnInit(): void {
  }

  addChanges() : void {
    const exerciseNames : string [] = this.dataManagerService.getAllExerciseNames()
    if(this.data.name != this.exerciseName) {
      if(exerciseNames.includes(this.exerciseName)) {
        alert('this name is in use');
        return
      }
      this.data.name = this.exerciseName;
      if(this.dataManagerService.exerciseNameById[this.data.id]) { //repeats!
        this.localStorageService.updateAllExercises(this.data.id, this.exerciseName)
      }
    }
    if(this.data.group != this.exerciseGroupId) {
      this.data.group = this.exerciseGroupId;
      if(this.dataManagerService.exerciseNameById[this.data.id]) { //repeats!
        this.localStorageService.updateExerciseGroups(this.exerciseGroupId, this.data.id);
      }
    }

  } 

}
