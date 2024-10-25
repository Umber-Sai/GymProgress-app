import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseType } from 'src/app/type/exercise.type';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { FormPopupComponent } from '../form-popup/form-popup.component';
import { DataObjectType } from 'src/app/type/data-object.type';
import { DataManagerService } from '../services/data-manager.service';


@Component({
  selector: 'exercise-block',
  templateUrl: './exercise-block.component.html',
  styleUrls: ['./exercise-block.component.scss']
})
export class ExerciseBlockComponent implements OnInit {

  @Input() structure: ExerciseType = {} as ExerciseType
  @Output() deleteExerciseEvent: EventEmitter<string> = new EventEmitter<string>();
  groups : DataObjectType = this.localStorageService.getGroups();

  constructor(
    private dialog : MatDialog,
    private router : Router,
    private localStorageService : LocalStorageService,
    private dataManagerService : DataManagerService,
  ) { }

  ngOnInit(): void {
    this.localStorageService.$groups.subscribe(groups => this.groups = groups);
  }

  openDialog() : void {
    const dialogRef = this.dialog.open(PopupComponent, {data : 'Delete this exercise?'});

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteExerciseEvent.next(this.structure.id)
      }
    });
  }

  moveToHistory(): void {
    this.router.navigate(['/exercise/' + this.structure.id])
  }

  changeInfo(): void {
    const dialogRef = this.dialog.open(FormPopupComponent, {data : this.structure}); 
  }



}
