import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { DailyActivitiesWeekComponent } from './components/daily-activities-week/daily-activities-week.component';
import { DailyActivitiesWeekHeaderComponent } from './components/daily-activities-week/daily-activities-week-header/daily-activities-week-header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {
	DailyActivitiesWeekDayComponent
} from './components/daily-activities-week-day/daily-activities-week-day.component';
import {
	DailyActivitiesWeekDayMissingComponent
} from './components/daily-activities-week-day-missing/daily-activities-week-day-missing.component';
import { DisplayModeComponent } from './components/display-mode/display-mode.component';

@NgModule({
  declarations: [
    AppComponent,
    DailyActivitiesPageComponent,
    DailyActivitiesWeekComponent,
    DailyActivitiesWeekHeaderComponent,
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
    InfiniteScrollDirective,
    DisplayModeComponent
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
