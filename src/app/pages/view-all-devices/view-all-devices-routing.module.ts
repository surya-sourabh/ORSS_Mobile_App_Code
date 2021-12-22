import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllDevicesPage } from './view-all-devices.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllDevicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllDevicesPageRoutingModule {}
