import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { IssuesPageComponent } from './pages/issues-page/issues-page.component';
import { IssuePageComponent } from './pages/issue-page/issue-page.component';
import {
  DailyActivitiesPageActionsComponent
} from './pages/daily-activities-page/daily-activities-page-actions/daily-activities-page-actions.component';
import { IssuesPageActionsComponent } from './pages/issues-page/issues-page-actions/issues-page-actions.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DailyActivitiesPageComponent
      },
      {
        path: '',
        component: DailyActivitiesPageActionsComponent,
        outlet: 'page-actions'
      }
    ]
  },
  {
    path: 'issues',
    children: [{
      path: '',
      component: IssuesPageComponent
    }, {
      path: '',
      component: IssuesPageActionsComponent,
      outlet: 'page-actions'
    }]
  },
  { path: 'issues/:issueKey', component: IssuePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
