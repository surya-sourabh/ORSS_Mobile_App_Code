import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FgMailPageRoutingModule } from './fg-mail-routing.module';

import { FgMailPage } from './fg-mail.page';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FgMailPageRoutingModule
  ],
  declarations: [FgMailPage]
})
export class FgMailPageModule { }
