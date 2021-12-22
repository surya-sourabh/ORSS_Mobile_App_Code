import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserListingScreenPageRoutingModule } from './user-listing-screen-routing.module';

import { UserListingScreenPage } from './user-listing-screen.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    UserListingScreenPageRoutingModule
  ],
  declarations: [UserListingScreenPage]
})
export class UserListingScreenPageModule { }
