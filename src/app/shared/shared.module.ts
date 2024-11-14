import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';
import { MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ExerciseBlockComponent } from './exercise-block/exercise-block.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormPopupComponent } from './form-popup/form-popup.component';
import { SetBlockComponent } from './set-block/set-block.component';
import { ClearComponent } from './clear/clear.component';
import { GroupNamePipe } from './pipes/group-name.pipe';



@NgModule({
  declarations: [
    PopupComponent,
    ExerciseBlockComponent,
    FormPopupComponent,
    SetBlockComponent,
    ClearComponent,
    GroupNamePipe
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  exports: [
    PopupComponent,
    ExerciseBlockComponent
  ]
})
export class SharedModule { }
