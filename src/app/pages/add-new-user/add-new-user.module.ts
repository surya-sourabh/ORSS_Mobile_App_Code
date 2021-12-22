import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewUserPageRoutingModule } from './add-new-user-routing.module';

import { AddNewUserPage } from './add-new-user.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from 'src/app/components/modal/modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    AddNewUserPageRoutingModule
  ],
  declarations: [ModalComponent,AddNewUserPage]
})
export class AddNewUserPageModule { }
