import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexPage } from './index.page';
import { IndexRouter } from './index.router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IndexRouter
  ],
  declarations: [IndexPage]
})
export class IndexPageModule { }
