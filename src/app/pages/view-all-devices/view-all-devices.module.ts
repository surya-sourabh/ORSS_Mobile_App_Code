import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewAllDevicesPageRoutingModule } from './view-all-devices-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ViewAllDevicesPage } from './view-all-devices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    ViewAllDevicesPageRoutingModule
  ],
  declarations: [ViewAllDevicesPage]
})
export class ViewAllDevicesPageModule {}
