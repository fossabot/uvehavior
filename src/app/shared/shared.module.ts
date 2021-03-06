import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent, HeaderComponent, PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularModule } from '../nebular.module';
import { ExperimentDialogComponent } from './components/dialogs/experiment-dialog/experiment-dialog.component';
import { TestDialogComponent } from './components/dialogs/test-dialog/test-dialog.component';
import { GroupDialogComponent } from './components/dialogs/group-dialog/group-dialog.component';
import { SubjectDialogComponent } from './components/dialogs/subject-dialog/subject-dialog.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SmartTableKeyInputComponent } from './components/dialogs/test-dialog/smart-table-key-input.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    FooterComponent,
    HeaderComponent,
    ExperimentDialogComponent,
    TestDialogComponent,
    GroupDialogComponent,
    SubjectDialogComponent,
    ConfirmationDialogComponent,
    SmartTableKeyInputComponent,
  ],
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, NebularModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, FooterComponent, HeaderComponent],
})
export class SharedModule {}
