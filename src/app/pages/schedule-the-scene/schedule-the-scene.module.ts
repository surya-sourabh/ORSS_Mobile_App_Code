import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ScheduleTheScenePageRoutingModule } from './schedule-the-scene-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { ScheduleTheScenePage } from './schedule-the-scene.page';
import { ListOfDevicesModalComponent } from '../../components/list-of-devices-modal/list-of-devices-modal.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    ScheduleTheScenePageRoutingModule
  ],
  declarations: [ScheduleTheScenePage, ListOfDevicesModalComponent]
})
export class ScheduleTheScenePageModule { }
