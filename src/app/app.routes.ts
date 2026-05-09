import { DailyActivitiesViewComponent } from './views/daily-activities-view/daily-activities-view.component';
import { Routes } from '@angular/router';
import {
	DailyActivitiesViewActionsComponent
} from './views/daily-activities-view/daily-activities-view-actions/daily-activities-view-actions.component';
import { IssuesViewComponent } from './views/issues-view/issues-view.component';
import { IssuesViewActionsComponent } from './views/issues-view/issues-view-actions/issues-view-actions.component';
import { IssueViewComponent } from './views/issue-view/issue-view.component';
import { ProjectsViewComponent } from './views/projects-view/projects-view.component';
import {
	ProjectsViewActionsComponent
} from './views/projects-view/projects-view-actions/projects-view-actions.component';
import { ProjectViewComponent } from './views/project-view/project-view.component';
import { projectResolver } from './resolvers';
import { ImportViewComponent } from './views/import-view/import-view.component';
import { SettingsViewComponent } from './views/settings-view/settings-view.component';

export const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: DailyActivitiesViewComponent
			},
			{
				path: '',
				component: DailyActivitiesViewActionsComponent,
				outlet: 'page-actions'
			}
		]
	},
	{
		path: 'issues',
		children: [{
			path: '',
			component: IssuesViewComponent
		}, {
			path: '',
			component: IssuesViewActionsComponent,
			outlet: 'page-actions'
		}]
	},
	{
		path: 'issues/:issueKey',
		component: IssueViewComponent
	},
	{
		path: 'projects',
		children: [
			{
				path: '',
				component: ProjectsViewComponent
			},
			{
				path: '',
				component: ProjectsViewActionsComponent,
				outlet: 'page-actions'
			}
		]
	},
	{
		path: 'projects/:projectId',
		component: ProjectViewComponent,
		resolve: {
			project: projectResolver
		}
	},
	{
		path: 'import',
		component: ImportViewComponent
	},
	{
		path: 'settings',
		component: SettingsViewComponent
	}
];
