import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WifiScanListPage } from './wifi-scan-list.page';

const routes: Routes = [
  {
    path: '',
    component: WifiScanListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WifiScanListPageRoutingModule {}
