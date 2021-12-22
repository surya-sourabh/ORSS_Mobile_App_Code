import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddDeviceToChannelPageRoutingModule } from './add-device-to-channel-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddDeviceToChannelPage } from './add-device-to-channel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,

    AddDeviceToChannelPageRoutingModule
  ],
  declarations: [AddDeviceToChannelPage]
})
export class AddDeviceToChannelPageModule { }
