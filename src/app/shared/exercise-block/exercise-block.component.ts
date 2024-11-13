import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseDescriptionType, ExerciseType } from 'src/app/type/exercise.type';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { FormPopupComponent } from '../form-popup/form-popup.component';
import { DataObjectType } from 'src/app/type/data-object.type';
import { ExerciseSetType } from 'src/app/type/exercise-history.type';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'exercise-block',
  templateUrl: './exercise-block.component.html',
  styleUrls: ['./exercise-block.component.scss'],
  animations : [
    trigger('setBehavior', [
      transition(':leave', animate(
        '500ms',
        keyframes([
          style({height : '*', opacity : '*'}),
          style({height : '*', opacity : '0'}),
          style({height : '0', opacity : '0'}),
        ])
      ))
    ])
  ]
})
export class ExerciseBlockComponent implements OnInit {

  @Input() exercise: ExerciseType | null = null;
  @Input() exerciseDescription: ExerciseDescriptionType | null = null;

  @Output() deleteExerciseEvent: EventEmitter<string> = new EventEmitter<string>();
  groups : DataObjectType = this.localStorageService.getGroups();
  setIndexes : Array<number> = [];
  deleted : boolean = false
  constructor(
    private dialog : MatDialog,
    private router : Router,
    private localStorageService : LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.localStorageService.$groups.subscribe(groups => this.groups = groups);
    this.setIndexes = this.setIndexesUpdate();
  }

  setIndexesUpdate() : Array<number> {
    if(!this.exercise) return []
    const currentValLeng = this.exercise?.sets.length;
    const prevValLeng = this.exercise?.description.sets.length;
    const result = [];
    const count = currentValLeng > prevValLeng? currentValLeng : prevValLeng;
    for (let i = 0; i < count; i++) {
      result.push(i)
    }
    
    return result 
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
    if(!this.exercise!.sets.at(-1)!.r && !this.exercise!.sets.at(-1)!.w) return
    let newSet = {r: '', w: ''};
    if(this.exercise!.sets.length >= this.exercise!.description.sets.length) {
      newSet.r = this.exercise!.sets.at(-1)?.r || this.exercise!.description.sets.at(-1)?.r || '';
      newSet.w = this.exercise!.sets.at(-1)?.w || this.exercise!.description.sets.at(-1)?.w || '';
    } 
    
    this.exercise?.sets.push(newSet);

    if(this.setIndexes.length < this.exercise!.sets.length) {
      this.setIndexes.push(this.setIndexes.at(-1)! + 1)
    }
  }

  deleteSet( index : number): void {
    if(this.exercise!.sets.length < 2) return
    this.setIndexes.splice(index, 1);
    this.exercise?.sets.splice(index, 1);
    this.deleted = true
  }

  onAnimationDone(index: number): void {
    if (this.deleted && this.exercise!.description.sets.length > this.setIndexes.length) {
      this.setIndexes.push(this.setIndexes.at(-1)! + 1)
    }
    this.deleted = false
  }


}
