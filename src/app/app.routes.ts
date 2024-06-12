import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent: () => import('@views/schedule/schedule.component').then(c => c.ScheduleComponent)}
];
