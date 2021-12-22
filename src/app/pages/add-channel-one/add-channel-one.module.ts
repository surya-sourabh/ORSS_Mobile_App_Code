import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddChannelOnePageRoutingModule } from './add-channel-one-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddChannelOnePage } from './add-channel-one.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    AddChannelOnePageRoutingModule,
    HttpClientModule
  ],
  declarations: [AddChannelOnePage]
})
export class AddChannelOnePageModule { }
