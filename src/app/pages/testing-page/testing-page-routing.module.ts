import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestingPagePage } from './testing-page.page';

const routes: Routes = [
  {
    path: '',
    component: TestingPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestingPagePageRoutingModule {}
