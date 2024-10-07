import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseType } from '../type/exercise.type';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'exercise-block',
  templateUrl: './exercise-block.component.html',
  styleUrls: ['./exercise-block.component.scss']
})
export class ExerciseBlockComponent implements OnInit {

  @Input() structure: ExerciseType = {} as ExerciseType
  @Output() deleteExerciseEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit(): void {
    console.log(this.structure)
  }

  deleteExercise(): void {
    this.deleteExerciseEvent.next(this.structure.id)
  }


}
