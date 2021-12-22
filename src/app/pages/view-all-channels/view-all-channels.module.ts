import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewAllChannelsPageRoutingModule } from './view-all-channels-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { ViewAllChannelsPage } from './view-all-channels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    ViewAllChannelsPageRoutingModule
  ],
  declarations: [ViewAllChannelsPage]
})
export class ViewAllChannelsPageModule {}
