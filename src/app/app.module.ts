import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DailyActivitiesComponent } from './components/daily-activities/daily-activities.component';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { ImportModalComponent } from './components/import-modal/import-modal.component';
import { DailyActivitiesWeekComponent } from './components/daily-activities-week/daily-activities-week.component';
import { DailyActivitiesWeekHeaderComponent } from './components/daily-activities-week/daily-activities-week-header/daily-activities-week-header.component';
import { MissingDailyActivityComponent } from './components/missing-daily-activity/missing-daily-activity.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {
	DailyActivitiesWeekDayComponent
} from './components/daily-activities-week-day/daily-activities-week-day.component';
import {
	DailyActivitiesWeekDayMissingComponent
} from './components/daily-activities-week-day-missing/daily-activities-week-day-missing.component';

@NgModule({
  declarations: [
    AppComponent,
    DailyActivitiesComponent,
    DailyActivitiesPageComponent,
    ImportModalComponent,
    DailyActivitiesWeekComponent,
    DailyActivitiesWeekHeaderComponent,
    MissingDailyActivityComponent
  ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		RouterOutlet,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NavbarComponent,
		DailyActivitiesWeekDayComponent,
		DailyActivitiesWeekDayMissingComponent,
	],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
