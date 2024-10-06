import { Component, Input, OnInit } from '@angular/core';
import { ExerciseType } from '../type/exercise.type';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'exercise-block',
  templateUrl: './exercise-block.component.html',
  styleUrls: ['./exercise-block.component.scss']
})
export class ExerciseBlockComponent implements OnInit {

  @Input() structure: ExerciseType = {} as ExerciseType

  constructor(
  ) { }

  ngOnInit(): void {
    console.log(this.structure)
  }


}
