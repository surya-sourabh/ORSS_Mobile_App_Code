import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FgMailPage } from './fg-mail.page';

const routes: Routes = [
  {
    path: '',
    component: FgMailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FgMailPageRoutingModule {}
