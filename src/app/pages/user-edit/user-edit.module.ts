import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserEditPageRoutingModule } from './user-edit-routing.module';

import { UserEditPage } from './user-edit.page';
import { ExsistingUserModalComponent } from 'src/app/components/exsisting-user-modal/exsisting-user-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserInfoEditModalComponent } from 'src/app/components/user-info-edit-modal/user-info-edit-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    UserEditPageRoutingModule,
  ],
  declarations: [UserEditPage, UserInfoEditModalComponent, ExsistingUserModalComponent
  ]
})
export class UserEditPageModule { }
