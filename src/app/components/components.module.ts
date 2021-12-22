import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SlidesComponent } from './slides/slides.component';
import { FooterComponentComponent } from './footer-component/footer-component.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { HeaderComponent } from './header/header.component';
import { ViewAllButtonComponent } from './view-all-button/view-all-button.component';
import { DeviceBoxComponent } from './device-box/device-box.component';
import { ChannnelBoxComponent } from './channnel-box/channnel-box.component';
import { ImageContainerComponent } from './image-container/image-container.component';
import { ItemSlidingComponent } from './item-sliding/item-sliding.component';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DevicesInMyDeviceComponent } from './devices-in-my-device/devices-in-my-device.component';
import { MyBoxComponent } from './my-box/my-box.component';
import { UsersBoxComponent } from './users-box/users-box.component';
import { AccordionComponent } from './accordion/accordion.component';
import { CustomModalComponent } from './custom-modal/custom-modal.component';
import { AddDeviceModalComponent } from './add-device-modal/add-device-modal.component';
import { EditChannelModalComponent } from './edit-channel-modal/edit-channel-modal.component';
import { AddsceneAccordionComponent } from './addscene-accordion/addscene-accordion.component';
import { UserInfoEditModalComponent } from './user-info-edit-modal/user-info-edit-modal.component';
import { UserPasswordChangeComponent } from './user-password-change/user-password-change.component';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import { MembersBoxComponent } from './members-box/members-box.component';
import { ScenesBoxComponent } from './scenes-box/scenes-box.component';
import { EditDeviceModalComponent } from './edit-device-modal/edit-device-modal.component';
import { MySceneBoxComponent } from './my-scene-box/my-scene-box.component';
import { DeviceIconModalComponent } from './device-icon-modal/device-icon-modal.component';
@NgModule({
  declarations: [
    SlidesComponent,
    FooterComponentComponent,
    TitleBarComponent,
    HeaderComponent,
    ViewAllButtonComponent,
    DeviceBoxComponent,
    ChannnelBoxComponent,
    ImageContainerComponent,
    ItemSlidingComponent,
    PrimaryButtonComponent,
    DeviceListComponent,
    DevicesInMyDeviceComponent,
    MyBoxComponent,
    MySceneBoxComponent,
    CustomModalComponent,
    UsersBoxComponent,
    AccordionComponent,
    AddDeviceModalComponent,
    EditChannelModalComponent,
    AddsceneAccordionComponent,
    UserPasswordChangeComponent,
    LogoutModalComponent,
    MembersBoxComponent,
    ScenesBoxComponent,
    EditDeviceModalComponent,
    DeviceIconModalComponent
  ],
  exports: [
    SlidesComponent,
    FooterComponentComponent,
    TitleBarComponent,
    HeaderComponent,
    ViewAllButtonComponent,
    DeviceBoxComponent,
    ChannnelBoxComponent,
    ImageContainerComponent,
    ItemSlidingComponent,
    PrimaryButtonComponent,
    DeviceListComponent,
    DevicesInMyDeviceComponent,
    MyBoxComponent,
    MySceneBoxComponent,
    CustomModalComponent,
    UsersBoxComponent,
    AccordionComponent,
    AddDeviceModalComponent,
    EditChannelModalComponent,
    AddsceneAccordionComponent,
    UserPasswordChangeComponent,
    LogoutModalComponent,
    MembersBoxComponent,
    ScenesBoxComponent,
    EditDeviceModalComponent,
    DeviceIconModalComponent
  ],

  imports: [CommonModule, FontAwesomeModule, FormsModule, IonicModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
