import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllScenesPage } from './view-all-scenes.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllScenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllScenesPageRoutingModule {}
