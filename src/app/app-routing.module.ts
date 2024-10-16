import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { IssuesPageComponent } from './pages/issues-page/issues-page.component';
import { IssuePageComponent } from './pages/issue-page/issue-page.component';
import {
  DailyActivitiesPageActionsComponent
} from './pages/daily-activities-page/daily-activities-page-actions/daily-activities-page-actions.component';
import { IssuesPageActionsComponent } from './pages/issues-page/issues-page-actions/issues-page-actions.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import {
  ProjectsPageActionsComponent
} from './pages/projects-page/projects-page-actions/projects-page-actions.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { projectResolver } from './resolvers';
import { ImportPageComponent } from './pages/import-page/import-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';

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
  {
    path: 'issues/:issueKey',
    component: IssuePageComponent
  },
  {
    path: 'projects',
    children: [
      {
        path: '',
        component: ProjectsPageComponent
      },
      {
        path: '',
        component: ProjectsPageActionsComponent,
        outlet: 'page-actions'
      }
    ]
  },
  {
    path: 'projects/:projectId',
    component: ProjectPageComponent,
    resolve: {
      project: projectResolver
    }
  },
  {
    path: 'import',
    component: ImportPageComponent
  },
  {
    path: 'analytics',
    component: AnalyticsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
