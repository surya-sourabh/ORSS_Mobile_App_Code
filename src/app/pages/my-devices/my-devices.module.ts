import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDevicesPageRoutingModule } from './my-devices-routing.module';

import { MyDevicesPage } from './my-devices.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    ComponentsModule,
    MyDevicesPageRoutingModule
  ],
  declarations: [MyDevicesPage]
})
export class MyDevicesPageModule { }
