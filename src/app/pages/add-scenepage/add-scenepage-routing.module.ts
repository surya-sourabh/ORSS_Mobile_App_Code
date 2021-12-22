import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddScenepagePage } from './add-scenepage.page';

const routes: Routes = [
  {
    path: '',
    component: AddScenepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddScenepagePageRoutingModule {}
