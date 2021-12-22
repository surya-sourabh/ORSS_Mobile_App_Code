import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ViewAllScenesPageRoutingModule } from './view-all-scenes-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { ViewAllScenesPage } from './view-all-scenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    ViewAllScenesPageRoutingModule
  ],
  declarations: [ViewAllScenesPage]
})
export class ViewAllScenesPageModule {}
