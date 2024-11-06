import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ExerciseDescriptionType, ExerciseType, ExreciseNameIdType } from '../../type/exercise.type';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { DefaultResponceType } from '../../type/default-responce.type';
import { ExerciseHistoryFirstItemType, ExerciseHistoryItemType, ExerciseHistorySetsType, ExerciseHistorySetType, ExerciseSetType } from '../../type/exercise-history.type';
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
export class TrainingComponent implements OnInit, OnDestroy {


  newExerciseName: string = '';
  exercises: ExerciseType[] = [];

  date = new Date();
  private today = `${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getFullYear()}`

  autoCompliterOptions: AutoCompliterType[] = this.dataManager.filterExercises('');


  constructor(
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private dataManager: DataManagerService,
    private dialog: MatDialog,
  ) {
    this.dataManager.generateExerciseId()
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.sessionStorageService.saveExercises(this.exercises);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupComponent, { data: 'Did you finish your train?' });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.finishTrain()
      }
    })
  }

  ngOnDestroy(): void {
    this.sessionStorageService.saveExercises(this.exercises);
  }

  ngOnInit(): void {
    this.exercises = this.sessionStorageService.getExercises();

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
      group: 'gr0000',
      description: {
        lastTrain: `${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getFullYear()}`,
        setsCount: 0,
        sets: [],
        comment: '',
      },
      sets: [{ w: '', r: '' }],
      comment: ''
    }
    const requieredExercise: string | undefined = this.dataManager.exerciseIdByName[this.newExerciseName]
    if (requieredExercise) {

      newExercise.id = requieredExercise

      newExercise.group = this.dataManager.findGroup(requieredExercise)

      const exerciseDescription: ExerciseDescriptionType | DefaultResponceType = this.dataManager.collectExerciseDescriprion(requieredExercise);
      if ((exerciseDescription as DefaultResponceType).error) {
        alert((exerciseDescription as DefaultResponceType).message);
      } else {
        newExercise.description = exerciseDescription as ExerciseDescriptionType;
        newExercise.comment = (exerciseDescription as ExerciseDescriptionType).comment;
        // newExercise.sets = (exerciseDescription as ExerciseDescriptionType).sets.map(item => {return {w : '', r : ''}})
      }

    } else {
      newExercise.id = this.dataManager.generateExerciseId();
      this.sessionStorageService.addNewExercisesId(newExercise.id)
    }
    this.exercises.push(newExercise);
    this.sessionStorageService.saveExercises(this.exercises);
    this.newExerciseName = '';
  }

  deleteExercise(id: string): void {
    const exercise = this.exercises.find(item => item.id === id);
    if (exercise) {
      this.exercises.splice(this.exercises.indexOf(exercise), 1);
      this.sessionStorageService.saveExercises(this.exercises);
      if (!this.dataManager.exerciseNameById[exercise.id]) {
        this.sessionStorageService.removeNewExercisesId(exercise.id)
      }

    } else {
      alert('exercise not found in train');
    }
  }

  finishTrain(): void {
    let newTrainHistory: TrainingHistoryType = {
      date: this.today,
      exercises: []
    }
    this.exercises.forEach(exercise => {
      newTrainHistory.exercises.push(exercise.id);
      let newExerciseHistory: ExerciseHistoryFirstItemType | ExerciseHistoryItemType;

      if (this.localStorageService.getExerciseHistory(exercise.id)) {
        newExerciseHistory = this.packageAsExistExercise(exercise);
      } else {
        newExerciseHistory = this.packageAsNewExercise(exercise);
        this.localStorageService.updateAllExercises(exercise.id, exercise.name);
        this.localStorageService.updateExerciseGroups(exercise.group, exercise.id);
      }
      this.localStorageService.updateExerciseHistory(newExerciseHistory, exercise.id)
    });
    this.localStorageService.updateTrainingHistory(newTrainHistory);
    sessionStorage.clear();
    this.exercises = [];
  }

  private packageAsExistExercise(exercise: ExerciseType): ExerciseHistoryItemType {
    let newExerciseHistory: ExerciseHistoryItemType = { lastTrain: this.today };
    if (exercise.description.comment != exercise.comment) newExerciseHistory.comment = exercise.comment;
    console.log(exercise)
    let sets: ExerciseHistorySetsType = {};
    let setsCount = 0;
    exercise.sets.filter((item, index) => { return item.w || item.r || exercise.description.sets[index] })
      .forEach((item: ExerciseSetType, index: number) => {
        setsCount++
        let newSet = {} as ExerciseHistorySetType
        const primeSet = exercise.description.sets[index];

        if (item.w) {
          if (!primeSet || item.w != primeSet.w) newSet.w = item.w;
        }
        if (item.r) {
          if (!primeSet || item.r != primeSet.r) newSet.r = item.r;
        }

        if (Object.keys(newSet).length > 0) {
          sets[index] = newSet
        }
      });
    newExerciseHistory.sets = sets;
    if (exercise.description.setsCount != setsCount) newExerciseHistory.setsCount = setsCount
    return newExerciseHistory;
  }

  private packageAsNewExercise(exercise: ExerciseType): ExerciseHistoryFirstItemType {
    let newExerciseHistory: ExerciseHistoryFirstItemType = {
      lastTrain: this.today,
      setsCount: exercise.sets.length,
      sets: {},
      comment: exercise.comment
    };

    exercise.sets.forEach((item, index) => {
      newExerciseHistory.sets[index] = item;
    })

    return newExerciseHistory
  }



}
