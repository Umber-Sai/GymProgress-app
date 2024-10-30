import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseDescriptionType, ExerciseType } from 'src/app/type/exercise.type';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { FormPopupComponent } from '../form-popup/form-popup.component';
import { DataObjectType } from 'src/app/type/data-object.type';
import { ExerciseSetType } from 'src/app/type/exercise-history.type';


@Component({
  selector: 'exercise-block',
  templateUrl: './exercise-block.component.html',
  styleUrls: ['./exercise-block.component.scss']
})
export class ExerciseBlockComponent implements OnInit {

  @Input() exercise: ExerciseType | null = null;
  @Input() exerciseDescription: ExerciseDescriptionType | null = null;

  @Output() deleteExerciseEvent: EventEmitter<string> = new EventEmitter<string>();
  groups : DataObjectType = this.localStorageService.getGroups();

  constructor(
    private dialog : MatDialog,
    private router : Router,
    private localStorageService : LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.localStorageService.$groups.subscribe(groups => this.groups = groups);
  }

  openDialog() : void {
    if(!this.exercise) return
    const dialogRef = this.dialog.open(PopupComponent, {data : 'Delete this exercise?'});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteExerciseEvent.next(this.exercise!.id)
      }
    });
  }

  moveToHistory(): void {
    if(!this.exercise) return
    this.router.navigate(['/exercise/' + this.exercise.id])
  }

  changeInfo(): void {
    const dialogRef = this.dialog.open(FormPopupComponent, {data : this.exercise}); 
  }

  addSet() : void {
    if(!this.exercise) return
    if(this.exercise.description.sets.length > this.exercise.sets.length || this.exercise.sets.length === 0) {
      this.exercise.sets.push({w : '', r : ''});
    } else if (this.exercise.description.sets.length === this.exercise.sets.length) {
      let set = this.exercise.description.sets.at(-1)!;
      if(this.exercise.sets.at(-1)!.r) set.r = this.exercise.sets.at(-1)!.r;
      if(this.exercise.sets.at(-1)!.w) set.w = this.exercise.sets.at(-1)!.w;
      this.exercise.sets.push(structuredClone(set));
    } else {
      if(!this.exercise.sets.at(-1)!.r && !this.exercise.sets.at(-1)!.w) return
      this.exercise.sets.push(structuredClone(this.exercise.sets.at(-1)!));
    }
  }

  deleteSet(index : number): void {
    this.exercise?.sets.splice(index, 1)
  }


}
