import { Component, HostListener, OnInit } from '@angular/core';
import { ExerciseDescriptionType, ExerciseType, ExreciseNameIdType } from '../type/exercise.type';
import { LockalStorageService } from '../shared/local-storage.service';
import { DefaultResponceType } from '../type/default-responce.type';
import { SessionStorageService } from '../shared/session-storage.service';
import { ExerciseCompareType } from '../type/exercise-compare.type';
import { ExerciseHistoryType } from '../type/exercise-history.type';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../shared/popup/popup.component';
import { ExercisesGroupsType } from '../type/exercise-groups.type';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {


  newExerciseName: string = '';
  exercises: ExerciseType[] = [];
  exercisesCompare: ExerciseCompareType = {}

  date = new Date();

  allExercises: ExreciseNameIdType[] = this.localStorageService.getAllExercises();
  exerciseGroups: ExercisesGroupsType = this.localStorageService.getExerciseGroups();
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
    if (this.newExerciseName === '' || this.exercises.some(item => item.name === this.newExerciseName.toLowerCase())) return
    let newExercise: ExerciseType = {} as ExerciseType;
    this.newExerciseName = this.newExerciseName.toLowerCase()


    newExercise = {
      id: '',
      name: this.newExerciseName,
      group : 'other',
      description : {
        lastTrain: `${this.date.getMonth()}.${this.date.getDate()}.${this.date.getFullYear()}`,
        weight: '',
        repeats: '',
        comment: '',
      }
    }
    

    const requieredExercise = this.allExercises.find((item : ExreciseNameIdType) => item.name === this.newExerciseName);
    if (requieredExercise) {

      newExercise.id = requieredExercise.id

      let exerciseGroup = Object.keys(this.exerciseGroups).find(group => {
        return this.exerciseGroups[group].includes(requieredExercise.id)
      });
      if(exerciseGroup) newExercise.group = exerciseGroup

      const exerciseDescription = this.localStorageService.collectExerciseDescriprion(requieredExercise);
      if ((exerciseDescription as DefaultResponceType).error) {
        alert((exerciseDescription as DefaultResponceType).message);
      } else {
        newExercise.description = exerciseDescription as ExerciseDescriptionType
      }

      this.exercisesCompare[requieredExercise.id] = exerciseDescription as ExerciseDescriptionType
    } else {

      newExercise.id = `ex${(this.allExercises.length + this.exercises.length - Object.keys(this.exercisesCompare).length + 1).toString().padStart(4, '0')}`;
      
    }

   

    console.log(newExercise)
    this.sessionStorageService.saveExercises(this.exercises);
    this.exercises.push(newExercise);
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
    this.exercises.forEach(exercise => {
      const newHistory: ExerciseHistoryType = { date:  `${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getFullYear()}` };
      const compare = this.exercisesCompare[exercise.id]
      if (compare) {
        if (exercise.description.repeats !== compare.repeats) newHistory.repeats = exercise.description.repeats
        if (exercise.description.weight !== compare.weight) newHistory.weight = exercise.description.weight
        if (exercise.description.comment !== compare.comment) newHistory.comment = exercise.description.comment
      } else {
        newHistory.repeats = exercise.description.repeats
        newHistory.weight = exercise.description.weight
        newHistory.comment = exercise.description.comment
        this.localStorageService.updateAllExercises(exercise.id, exercise.name);
        this.localStorageService.updateExerciseGroups(exercise.group, exercise.id);
      }
      console.log(newHistory)
      if (newHistory.repeats || newHistory.comment || newHistory.weight || !compare) {
        this.localStorageService.updateExerciseHistory(newHistory, { id: exercise.id, name: exercise.name })
      }
    })
    sessionStorage.clear();
    this.exercises = [];
    this.exercisesCompare = {}
  }
}
