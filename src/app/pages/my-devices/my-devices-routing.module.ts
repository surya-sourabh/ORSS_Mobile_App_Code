import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyDevicesPage } from './my-devices.page';

const routes: Routes = [
  {
    path: '',
    component: MyDevicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDevicesPageRoutingModule {}
