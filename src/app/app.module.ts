import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DailyActivitiesComponent } from './components/daily-activities/daily-activities.component';
import { DailyActivityItemComponent } from './components/daily-activity-item/daily-activity-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DailyActivitiesComponent,
    DailyActivityItemComponent,
    DailyActivitiesPageComponent
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
