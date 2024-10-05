import { Component, HostListener, OnInit } from '@angular/core';
import { ExerciseType } from '../type/exercise.type';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../shared/storage.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

  
  newExercise = '';
  exercises = [
    {
      name: 'banchpress',
      sets : [
        {
          weight: '10',
          repeats: '12'
        },
        {
          weight: '10',
          repeats: '12'
        },
      ],
      comment: 'hello world!'
    }

  ];
  allExercises : string[] = this.storage.getAllExercises();
  filteredOptions: string[] = this.allExercises;

  constructor(
    private storage : StorageService,
  ) {
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.storage.savingExercises(this.exercises);
  }

  ngOnInit(): void {
    const data = sessionStorage.getItem('exercises');
    if(data) {
      this.exercises = JSON.parse(data)
    }
  }

  filterExercises(val:string) {
    this.filteredOptions = this.allExercises.filter(item => item.toLowerCase().includes(val.toLowerCase()));
    console.log(this.filteredOptions)
  }


  addExercise(): void {
    if(this.newExercise === '') return
    this.storage.savingExercises(this.exercises);
    this.exercises.push({
      name : this.newExercise,
      sets : [
        {
          weight: '',
          repeats: ''
        }
      ],
      comment : ''
    })
    this.newExercise = ''
  }
}
