import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddDeviceModalComponent } from 'src/app/components/add-device-modal/add-device-modal.component';
import { EditChannelModalComponent } from 'src/app/components/edit-channel-modal/edit-channel-modal.component';


@Component({
  selector: 'app-nodevice-in-channel',
  templateUrl: './nodevice-in-channel.page.html',
  styleUrls: ['./nodevice-in-channel.page.scss'],
})
export class NodeviceInChannelPage implements OnInit {

  constructor(private router: Router,private actionSheetController: ActionSheetController,private modalController: ModalController) {}


  ngOnInit() {
  }
  titlebarLTiText = 'Good Morning!';
  titlebarRTiText = 'Total Devices';
  titlebarLSubTiText = 'Nitin';
  titlebarRSubTiText = '0/4';
  viewLText = 'Devices in Migro_CH1';
  viewRText = 'Manage';
  viewLIcon = 'plug';
  viewRIcon = 'cogs';

  gobackhome() {
    this.router.navigate(['home']);
  }

  fromModal: any;
  async opendeviceModal() {
    // console.log("opened");
    const modal = await this.modalController.create({
      component: AddDeviceModalComponent,
      cssClass: 'adddevicemodalstyle',
    });

    return await modal.present();
  }
  async openEditChannelModal() {
    // console.log("opened");
    const modal = await this.modalController.create({
      component: EditChannelModalComponent,
      cssClass: 'editchannelmodalstyle',
    });

    return await modal.present();
  }

  async manageSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'action-sheets-style',
      buttons: [
        {
        text: 'Add electronic device to this channel',
          handler: () => {
            this.opendeviceModal()
          },
        },
        {
        text: 'Remove all electronic devices from channel',


          handler: () => {
            this.router.navigate(['nodevice-in-channel']);
          },
        },
        {
        text: 'Delete the channel',


          handler: () => {
            console.log('Delete clicked');
          },
        },

        {
          text: 'Edit Channel name',
          handler: () => {
            this.openEditChannelModal();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });

    await actionSheet.present();
  }
  addDevice() {
    this.router.navigate(['add-device-to-channel']);
  }

}
