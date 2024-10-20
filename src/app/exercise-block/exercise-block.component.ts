import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseType } from '../type/exercise.type';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../shared/popup/popup.component';

@Component({
  selector: 'exercise-block',
  templateUrl: './exercise-block.component.html',
  styleUrls: ['./exercise-block.component.scss']
})
export class ExerciseBlockComponent implements OnInit {

  @Input() structure: ExerciseType = {} as ExerciseType
  @Output() deleteExerciseEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog : MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openDialog() : void {
    const dialogRef = this.dialog.open(PopupComponent, {data : 'Delete this exercise?'});

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteExerciseEvent.next(this.structure.id)
      }
    });
  }



}
