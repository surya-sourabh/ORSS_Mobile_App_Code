import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddChannelPageRoutingModule } from './add-channel-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AddChannelPage } from './add-channel.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    AddChannelPageRoutingModule
  ],
  declarations: [AddChannelPage]
})
export class AddChannelPageModule { }
