import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewUserPage } from './add-new-user.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewUserPageRoutingModule {}
