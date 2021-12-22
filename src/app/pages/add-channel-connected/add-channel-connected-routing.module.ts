import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddChannelConnectedPage } from './add-channel-connected.page';

const routes: Routes = [
  {
    path: '',
    component: AddChannelConnectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddChannelConnectedPageRoutingModule {}
