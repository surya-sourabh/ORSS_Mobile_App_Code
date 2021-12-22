import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NodeviceInChannelPageRoutingModule } from './nodevice-in-channel-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { NodeviceInChannelPage } from './nodevice-in-channel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    NodeviceInChannelPageRoutingModule
  ],
  declarations: [NodeviceInChannelPage]
})
export class NodeviceInChannelPageModule {}
