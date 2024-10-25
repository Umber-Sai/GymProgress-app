import { Component, HostListener, OnInit } from '@angular/core';
import { ExerciseDescriptionType, ExerciseType, ExreciseNameIdType } from '../../type/exercise.type';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { DefaultResponceType } from '../../type/default-responce.type';
import { ExerciseCompareType } from '../../type/exercise-compare.type';
import { ExerciseHistoryType } from '../../type/exercise-history.type';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../shared/popup/popup.component';
import { DataManagerService } from '../../shared/services/data-manager.service';
import { AutoCompliterType } from '../../type/autocompleter.type';
import { TrainingHistoryType } from '../../type/train-history.type';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {


  newExerciseName: string = '';
  exercises: ExerciseType[] = [];
  private exercisesCompare: ExerciseCompareType = {}

  date = new Date();

  autoCompliterOptions: AutoCompliterType[] = this.dataManager.filterExercises('');


  constructor(
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private dataManager: DataManagerService,
    private dialog : MatDialog,
  ) {
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.sessionStorageService.saveExercises(this.exercises);
    this.sessionStorageService.saveExercisesCompare(this.exercisesCompare);
  }

  openDialog() :void {
    const dialogRef = this.dialog.open(PopupComponent, {data : 'Did you finish your train?'});

    dialogRef.afterClosed().subscribe(resp => {
      if(resp) {
        this.finishTrain()
      }
    })
  }

  ngOnInit(): void {
    this.exercises = this.sessionStorageService.getExercises();
    this.exercisesCompare = this.sessionStorageService.getExercisesCompare();
  }

  filterExercises(val: string): void {
    this.autoCompliterOptions = this.dataManager.filterExercises(val);
  }


  addExercise(): void {
    console.log(this.exercises)
    if (this.newExerciseName === '' || this.exercises.some(item => item.name === this.newExerciseName.toLowerCase())) return
    this.autoCompliterOptions = this.dataManager.filterExercises('');
    this.newExerciseName = this.newExerciseName.toLowerCase()

    let newExercise: ExerciseType = {
      id: '',
      name: this.newExerciseName,
      group : 'gr0000',
      description : {
        lastTrain: `${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getFullYear()}`,
        weight: '',
        repeats: '',
        comment: '',
      }
    }
    const requieredExercise : string | undefined = this.dataManager.exerciseIdByName[this.newExerciseName]
    if (requieredExercise) {

      newExercise.id = requieredExercise

      newExercise.group = this.dataManager.findGroup(requieredExercise)

      const exerciseDescription : ExerciseDescriptionType | DefaultResponceType = this.dataManager.collectExerciseDescriprion(requieredExercise);
      if ((exerciseDescription as DefaultResponceType).error) {
        alert((exerciseDescription as DefaultResponceType).message);
      } else {
        newExercise.description = exerciseDescription as ExerciseDescriptionType;
        this.exercisesCompare[requieredExercise] = structuredClone(exerciseDescription as ExerciseDescriptionType);
      }
    } else {
      newExercise.id = `ex${(this.dataManager.exerciseCount + this.exercises.length - Object.keys(this.exercisesCompare).length + 1).toString().padStart(4, '0')}`;
    }
    this.exercises.push(newExercise);
    this.sessionStorageService.saveExercises(this.exercises);
    this.sessionStorageService.saveExercisesCompare(this.exercisesCompare);
    this.newExerciseName = '';
  }

  deleteExercise(id: string) : void {
    const exercise = this.exercises.find(item => item.id === id);
    if(exercise) {
      this.exercises.splice(this.exercises.indexOf(exercise), 1);
      delete this.exercisesCompare[exercise.id];

      this.sessionStorageService.saveExercises(this.exercises);
      this.sessionStorageService.saveExercisesCompare(this.exercisesCompare);
    } else {
      alert('exercise not found in train');
    }
  }

  finishTrain(): void {
    const today = `${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getFullYear()}`
    let newTrainHistory: TrainingHistoryType = {
      date : today,
      exercises : []
    }
    this.exercises.forEach(exercise => {
      newTrainHistory.exercises.push(exercise.id);
      const newExerciseHistory: ExerciseHistoryType = { date: today};
      const compare = this.exercisesCompare[exercise.id]
      if (compare) {
        if (exercise.description.repeats !== compare.repeats) newExerciseHistory.repeats = exercise.description.repeats
        if (exercise.description.weight !== compare.weight) newExerciseHistory.weight = exercise.description.weight
        if (exercise.description.comment !== compare.comment) newExerciseHistory.comment = exercise.description.comment
      } else {
        newExerciseHistory.repeats = exercise.description.repeats
        newExerciseHistory.weight = exercise.description.weight
        newExerciseHistory.comment = exercise.description.comment
        this.localStorageService.updateAllExercises(exercise.id, exercise.name);
        this.localStorageService.updateExerciseGroups(exercise.group, exercise.id);
      }
      this.localStorageService.updateExerciseHistory(newExerciseHistory, exercise.id)
    });
    this.localStorageService.updateTrainingHistory(newTrainHistory);
    sessionStorage.clear();
    this.exercises = [];
    this.exercisesCompare = {}
  }
}
