import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseType } from 'src/app/type/exercise.type';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';

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
    private router : Router
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

  moveToHistory() {
    this.router.navigate(['/exercise/' + this.structure.id])
  }



}
