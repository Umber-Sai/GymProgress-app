import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainingComponent } from './view/training/training.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import { ExerciseHistoryComponent } from './view/exercise-history/exercise-history.component';


@NgModule({
  declarations: [
    AppComponent,
    TrainingComponent,
    ExerciseHistoryComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MatDialogModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    DatePipe,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
