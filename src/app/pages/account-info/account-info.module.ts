import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountInfoPageRoutingModule } from './account-info-routing.module';

import { AccountInfoPage } from './account-info.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddNewUserPage } from '../add-new-user/add-new-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    AccountInfoPageRoutingModule,
  ],
  declarations: [AccountInfoPage, AddNewUserPage]
})
export class AccountInfoPageModule { }
