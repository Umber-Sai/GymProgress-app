import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataManagerService } from 'src/app/shared/services/data-manager.service';
import { defaultHistory } from 'src/app/shared/services/defaultValues';
import { ExerciseDescriptionType, ExerciseType } from 'src/app/type/exercise.type';

@Component({
  selector: 'app-exercise-history',
  templateUrl: './exercise-history.component.html',
  styleUrls: ['./exercise-history.component.scss']
})
export class ExerciseHistoryComponent implements OnInit {

  history : ExerciseType[] = [];
  exerciseName : string = ''

  constructor(
    private route : ActivatedRoute,
    private dataManagerService : DataManagerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const exerciseId = params['id']
      // localStorage.setItem(exerciseId, JSON.stringify(defaultHistory));

      this.exerciseName = this.dataManagerService.exerciseNameById[exerciseId];
      if(!this.exerciseName) return
      const exerciseGtoup = this.dataManagerService.findGroup(exerciseId)
      this.dataManagerService.unzipExerciseHistory(exerciseId).forEach((item : ExerciseDescriptionType) => {
        this.history.push({
          id : exerciseId,
          name : this.exerciseName,
          group : exerciseGtoup,
          description : item
        })
      })

  })
  }


}
