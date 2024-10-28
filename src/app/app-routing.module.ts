import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseHistoryComponent } from './view/exercise-history/exercise-history.component';
import { TrainingComponent } from './view/training/training.component';
import { ClearComponent } from './shared/clear/clear.component';

const routes: Routes = [
  {path : '', component: TrainingComponent},
  {path : 'exercise/:id', component : ExerciseHistoryComponent},
  {path : 'clear', component : ClearComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
