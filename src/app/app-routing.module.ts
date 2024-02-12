import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';

const routes: Routes = [
  { path: '', component: DailyActivitiesPageComponent },
  { path: 'tasks', component: TasksPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
