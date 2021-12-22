import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddChannelConnectedPageRoutingModule } from './add-channel-connected-routing.module';

import { AddChannelConnectedPage } from './add-channel-connected.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AddChannelConnectedPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [AddChannelConnectedPage]
})
export class AddChannelConnectedPageModule { }
