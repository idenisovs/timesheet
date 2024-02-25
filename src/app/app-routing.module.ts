import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { IssuesPagesComponent } from './pages/issues-pages/issues-pages.component';

const routes: Routes = [
  { path: '', component: DailyActivitiesPageComponent },
  { path: 'issues', component: IssuesPagesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
