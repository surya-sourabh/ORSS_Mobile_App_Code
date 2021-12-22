import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentsModule } from 'src/app/components/components.module';

import { AddScenepagePageRoutingModule } from './add-scenepage-routing.module';

import { AddScenepagePage } from './add-scenepage.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AddScenepagePageRoutingModule,
    ComponentsModule,
    FontAwesomeModule,
  ],
  declarations: [AddScenepagePage]
})
export class AddScenepagePageModule {}
