import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddChannelOnePage } from './add-channel-one.page';

const routes: Routes = [
  {
    path: '',
    component: AddChannelOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddChannelOnePageRoutingModule {}
