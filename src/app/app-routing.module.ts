import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { IssuesPageComponent } from './pages/issues-page/issues-page.component';

const routes: Routes = [
  { path: '', component: DailyActivitiesPageComponent },
  { path: 'issues', component: IssuesPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
