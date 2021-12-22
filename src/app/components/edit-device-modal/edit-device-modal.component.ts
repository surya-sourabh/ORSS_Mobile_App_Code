import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { DeviceIconModalComponent } from '../device-icon-modal/device-icon-modal.component';
// import { DeviceIconModalComponent } from '../device-icon-modal/device-icon-modal.component';

@Component({

  selector: 'app-edit-device-modal',
  templateUrl: './edit-device-modal.component.html',
  styleUrls: ['./edit-device-modal.component.scss'],
})
export class EditDeviceModalComponent implements OnInit {
  reactiveForm: FormGroup;
  submitted: boolean;
  primaryBtnText = 'Save';

  @Input() deviceId: any;
  pnumbers = [];
  deviceNameFromModal: string = '';
  deviceChName: string = '';
  deviceChId: string = '';
  plugNumberFromModal: number;
  userId: string = '';

  channelId = [];
  capacity: number;
  channelsArray: any;
  channelName = [];
  channelIdSelected: {

    channelId: string,
    channelName: string;
  }
  plugs = [];
  macId: any;
  modelData: any;
  userSelectedIcon = 'file-image';
  selectedDeviceId: any;
  plugNumberToValidate: number;
  constructor(private modalController: ModalController,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private toaster: ToastController,
    private loadingCtrl: LoadingController,) {
    this.reactiveForm = this.formBuilder.group({
      channelIdSelected: new FormControl(null, [Validators.required]),
      plugNumberFromModal: new FormControl(null, [Validators.required]),
      deviceNameFromModal: new FormControl(null, [Validators.required])
    })
  }

  get f() {
    return this.reactiveForm.controls;
  }
  ngOnInit() {

    // console.log(this.pnumbers)
  }

  ionViewWillEnter() {
    // console.log(this.deviceId)

    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // console.log(this.userId);
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices')
        .doc(this.deviceId)
        .get()
        .subscribe((value) => {
          this.deviceChName = value.get('channelName')
          this.deviceChId = value.get('channelId')
          this.plugNumberFromModal = Number(value.get('plugNumber'));
          this.plugNumberToValidate = Number(value.get('plugNumber'))
          this.deviceNameFromModal = value.get('deviceName');
          this.userSelectedIcon = value.get('deviceIcon')
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('channels')
            .doc(value.get('channelId'))
            .get()
            .subscribe((value) => {
              this.capacity = value.get('capacity');
              // console.log(this.capacity)
              this.pnumbers = [];
              for (
                let index = 0;
                index < this.capacity;
                index++
              ) {
                this.pnumbers[index] = {
                  ind: index + 1,
                  id: index,
                };
              }
            });
        });
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.channelsArray = data.get('channelsarray');

          this.channelsArray.forEach((element: any, index: string | number) => {
            this.channelId[index] = element.channelId;

            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('channels')
              .doc(element.channelId)
              .get()
              .subscribe((value) => {
                this.channelName[index] = value.get('channelName');
              });
          });
        });
    });



  }
  dismiss() {
    this.modalController.dismiss();
  }

  async save() {
    // console.log(this.plugNumberFromModal);
    // console.log(this.deviceNameFromModal);
    // console.log(this.channelIdSelected);
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    } else if (this.deviceNameFromModal.length > 0 && this.plugNumberFromModal > 0 && this.channelIdSelected) {

      console.log(this.deviceNameFromModal)
      console.log(this.plugNumberFromModal)
      console.log(this.channelIdSelected)
      console.log(this.userId)
      // console.log()
      // console.log()
      this.afs.collection('user')
        .doc(this.userId)
        .collection('channels')
        .doc(this.channelIdSelected.channelId)
        .get()
        .subscribe(value => {
          this.macId = value.get('macId');
          console.log(this.macId)
        })
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices', (ref) => ref.where('channelId', '==', this.channelIdSelected.channelId))
        .get()
        .subscribe(snapshot => {
          snapshot.docs.forEach((doc, i) => {
            this.plugs[i] = doc.data().plugNumber
            console.log(this.plugs)
          })


          console.log(this.plugs)
         
          if (this.plugs.some(val => val == this.plugNumberFromModal) && this.plugNumberFromModal !== this.plugNumberToValidate) {
            console.log("yes same plug number")
            this.toast('Same plug is already being used by another device', 'warning')
          } else {

            loading.present();
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices')
              .doc(this.deviceId)
              .update({
                channelName: this.channelIdSelected.channelName,
                channelId: this.channelIdSelected.channelId,
                plugNumber: this.plugNumberFromModal,
                deviceName: this.deviceNameFromModal,
                macId: this.macId,
                deviceIcon: this.userSelectedIcon
              }).then(async () => {
                loading.dismiss();
                this.toast('Device edited', 'success');
                this.afs
                  .collection('user')
                  .doc(this.userId)
                  .get()
                  .subscribe((data) => {
                    this.channelsArray = data.get('channelsarray');

                    this.channelsArray.forEach((element: any, index: string | number) => {
                      this.channelId[index] = element.channelId;

                      this.afs
                        .collection('user')
                        .doc(this.userId)
                        .collection('channels')
                        .doc(element.channelId)
                        .get()
                        .subscribe((value) => {
                          this.channelName[index] = value.get('channelName');
                        });
                    });
                  });

              }).catch(async error => {
                loading.dismiss();
                this.toast('Error Occurred', 'danger')
              })
            this.modalController.dismiss();
          }
        })



    }
    else {

      this.modalController.dismiss();
    }
  }

  trackByValue(index: number, numbers: any): number {
    return numbers.ind;
  }

  async deviceIconSelect(){
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

  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 3000,
    });
    toast.present();
  }
}

// formcontrol for channel

