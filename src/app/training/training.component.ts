import { Component, HostListener, OnInit } from '@angular/core';
import { ExerciseType, ExreciseNameIdType } from '../type/exercise.type';
import { LockalStorageService } from '../shared/local-storage.service';
import { DefaultResponceType } from '../type/default-responce.type';
import { SessionStorageService } from '../shared/session-storage.service';
import { ExerciseCompareType } from '../type/exercise-compare.type';
import { ExerciseHistoryType } from '../type/exercise-history.type';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../shared/popup/popup.component';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {


  newExerciseName: string = '';
  exercises: ExerciseType[] = [];
  exercisesCompare: ExerciseCompareType[] = []

  date = new Date();

  allExercises: ExreciseNameIdType[] = this.localStorageService.getAllExercises();
  filteredOptions: ExreciseNameIdType[] = this.allExercises;

  constructor(
    private localStorageService: LockalStorageService,
    private sessionStorageService: SessionStorageService,
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
    this.filteredOptions = this.allExercises.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
  }


  addExercise(): void {
    if (this.newExerciseName === '' || this.exercises.some(item => item.name === this.newExerciseName)) return
    let newExercise: ExerciseType = {} as ExerciseType;

    const exrcsInList = this.allExercises.find(item => item.name === this.newExerciseName);
    if (exrcsInList) {
      const description = this.localStorageService.collectExerciseDescriprion(exrcsInList);
      if ((description as DefaultResponceType).error) {
        alert((description as DefaultResponceType).message);
        return
      }
      newExercise = description as ExerciseType;
      this.exercisesCompare.push({
        id: newExercise.id,
        repeats: newExercise.repeats,
        weight: newExercise.weight,
        comment: newExercise.comment,
      })
    } else {
      newExercise = {
        id: `ex${(this.allExercises.length + this.exercises.length - this.exercisesCompare.length + 1).toString().padStart(4, '0')}`,
        lastTrain: `${this.date.getMonth()}.${this.date.getDate()}.${this.date.getFullYear()}`,
        name: this.newExerciseName,
        weight: '',
        repeats: '',
        comment: '',
      }
    }

    this.sessionStorageService.saveExercises(this.exercises);
    this.exercises.push(newExercise);
    this.newExerciseName = '';
  }

  deleteExercise(id: string) : void {
    const exercise = this.exercises.find(item => item.id === id);
    if(exercise) {
      this.exercises.splice(this.exercises.indexOf(exercise), 1);
      const compIndex = this.exercisesCompare.indexOf(exercise);
      if(compIndex > -1) this.exercisesCompare.splice(compIndex, 1)

      this.sessionStorageService.saveExercises(this.exercises);
      this.sessionStorageService.saveExercisesCompare(this.exercisesCompare);
    } else {
      alert('exercise not found in train');
    }
  }

  finishTrain(): void {
    this.exercises.forEach(exercise => {
      const newHistory: ExerciseHistoryType = { date:  `${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getFullYear()}` };
      const compare = this.exercisesCompare.find(compare => compare.id === exercise.id);
      if (compare) {
        if (exercise.repeats !== compare.repeats) newHistory.repeats = exercise.repeats
        if (exercise.weight !== compare.weight) newHistory.weight = exercise.weight
        if (exercise.comment !== compare.comment) newHistory.comment = exercise.comment
      } else {
        newHistory.repeats = exercise.repeats
        newHistory.weight = exercise.weight
        newHistory.comment = exercise.comment
        this.localStorageService.updateAllExercises({ id: exercise.id, name: exercise.name });
      }
      if (newHistory.repeats || newHistory.comment || newHistory.weight || !compare) {
        this.localStorageService.updateExerciseHistory(newHistory, { id: exercise.id, name: exercise.name })
      }
    })
    sessionStorage.clear();
    this.exercises = [];
    this.exercisesCompare = []
  }
}
