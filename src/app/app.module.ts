import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule } from '@angular/forms';

import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatInputModule, MatFormFieldModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppTableComponent } from './app.table.component';
import { AppReportConfigComponent } from './app.report-config.component';
import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import { AtmReportService } from './atm-report.service';

import { TimePickerModule } from '@syncfusion/ej2-ng-calendars';
import { IndexComponent } from './index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { MatrixComponent } from './matrix.component';

const routes = [
  { path: 'breakdown', component: AppComponent },
  { path: 'matrix', component: MatrixComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AppTableComponent,
    AppReportConfigComponent,
    IndexComponent,
    MatrixComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TimePickerModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AtmReportService],
  bootstrap: [IndexComponent]
})
export class AppModule { }
