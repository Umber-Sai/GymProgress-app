import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseHistoryComponent } from './view/exercise-history/exercise-history.component';
import { TrainingComponent } from './view/training/training.component';

const routes: Routes = [
  {path : '', component: TrainingComponent},
  {path : 'exercise/:id', component : ExerciseHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
