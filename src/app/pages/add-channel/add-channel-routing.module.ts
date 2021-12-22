import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddChannelPage } from './add-channel.page';

const routes: Routes = [
  {
    path: '',
    component: AddChannelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddChannelPageRoutingModule {}
