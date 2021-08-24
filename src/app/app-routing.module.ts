import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivitiesPageComponent } from './pages/daily-activities-page/daily-activities-page.component';

const routes: Routes = [
  { path: '**', component: DailyActivitiesPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
