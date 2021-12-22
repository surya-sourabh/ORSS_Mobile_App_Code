import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { DeviceIconModalComponent } from '../device-icon-modal/device-icon-modal.component';
@Component({
  selector: 'app-add-device-modal',
  templateUrl: './add-device-modal.component.html',
  styleUrls: ['./add-device-modal.component.scss'],
})
export class AddDeviceModalComponent implements OnInit {
  primaryBtnText = 'Save';
  @Input() plugNumbers: any;
  pnumbers = [];
  deviceNameFromModal: string = '';
  plugNumberFromModal: number = 0;
  emptyDeviceName: boolean = false;
  emptyPlug: boolean = false;
  modelData: any;
  userSelectedIcon = 'lightbulb';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.pnumbers = this.plugNumbers;
    // console.log(this.pnumbers)
  }
  ionViewWillEnter() {
    // console.log(this.pnumbers)
    this.pnumbers = this.plugNumbers;
  }
  dismiss() {
    this.modalController.dismiss({
      deviceNameFromModal: '',
      plugNumberFromModal: 0,
    });
  }
  dismissWithFields() {
    if (!this.deviceNameFromModal) {
      this.emptyDeviceName = true;
    } else if (!this.deviceNameFromModal || !this.plugNumberFromModal) {
      this.emptyPlug = true;
    } else
      if (this.deviceNameFromModal.length > 0 && this.plugNumberFromModal > 0) {
        this.modalController.dismiss({
          deviceNameFromModal: this.deviceNameFromModal,
          plugNumberFromModal: Number(this.plugNumberFromModal),
          deviceIcon: this.userSelectedIcon
        });
      } else {
        this.modalController.dismiss({
          deviceNameFromModal: '',
          plugNumberFromModal: 0,
        });
      }
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: DeviceIconModalComponent,
      cssClass: '',
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
        this.userSelectedIcon = modelData.data
        console.log("Selected icon",this.userSelectedIcon)
      }
    })
    return await modal.present();
  }
  saveFields() {
    this.dismissWithFields();
  }
  trackByValue(index: number, numbers: any): number {
    return numbers.ind;
  }
}
