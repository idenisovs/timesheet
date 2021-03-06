import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DailyActivitiesComponent } from './components/daily-activities/daily-activities.component';
import { DailyActivityItemComponent } from './components/daily-activity-item/daily-activity-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { ImportModalComponent } from './components/import-modal/import-modal.component';
import { DailyActivitiesWeekComponent } from './components/daily-activities-week/daily-activities-week.component';
import { DailyActivitiesWeekHeaderComponent } from './components/daily-activities-week/daily-activities-week-header/daily-activities-week-header.component';

@NgModule({
  declarations: [
    AppComponent,
    DailyActivitiesComponent,
    DailyActivityItemComponent,
    DailyActivitiesPageComponent,
    ImportModalComponent,
    DailyActivitiesWeekComponent,
    DailyActivitiesWeekHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
