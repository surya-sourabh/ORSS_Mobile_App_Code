import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDeviceToChannelPage } from './add-device-to-channel.page';

const routes: Routes = [
  {
    path: '',
    component: AddDeviceToChannelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDeviceToChannelPageRoutingModule {}
