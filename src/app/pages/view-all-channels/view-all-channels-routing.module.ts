import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllChannelsPage } from './view-all-channels.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllChannelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllChannelsPageRoutingModule {}
