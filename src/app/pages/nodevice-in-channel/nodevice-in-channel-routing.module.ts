import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NodeviceInChannelPage } from './nodevice-in-channel.page';

const routes: Routes = [
  {
    path: '',
    component: NodeviceInChannelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NodeviceInChannelPageRoutingModule {}
