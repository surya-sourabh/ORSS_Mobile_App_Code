import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WifiScanListPageRoutingModule } from './wifi-scan-list-routing.module';

import { WifiScanListPage } from './wifi-scan-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    WifiScanListPageRoutingModule
  ],
  declarations: [WifiScanListPage]
})
export class WifiScanListPageModule {}
