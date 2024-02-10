import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';

const routes: Routes = [
  { path: '', component: DailyActivitiesPageComponent },
  { path: 'projects', component: ProjectsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
