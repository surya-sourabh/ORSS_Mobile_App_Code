import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleTheScenePage } from './schedule-the-scene.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleTheScenePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleTheScenePageRoutingModule {}
