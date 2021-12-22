import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { LoadingController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { EditDeviceModalComponent } from 'src/app/components/edit-device-modal/edit-device-modal.component';
import { ToastController } from '@ionic/angular';
import { snapshotChanges } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { DeviceIconModalComponent } from 'src/app/components/device-icon-modal/device-icon-modal.component';
@Component({
  selector: 'app-add-device-to-channel',
  templateUrl: './add-device-to-channel.page.html',
  styleUrls: ['./add-device-to-channel.page.scss'],
})
export class AddDeviceToChannelPage implements OnInit {
  primaryBtnText = 'Save';
  deviceIcons = [];
  deviceIconsType = ['fas', 'far'];
  deviceIconName = [];
  plugBox = [false, true];
  plug = [];
  powerState = ['power-on', 'power-off', 'power-default'];
  showPowerButton = [false, true];
  deviceName: string;
  userId: string = '';
  title = 'Add device to Channel';
  channelsArray: any;
  channelName = [];
  channelId = [];
  channelIdSelected: {
    channelId: string;
    channelName: string;
  };

  channelCapacity = [];
  add;
  deviceId;
  plugNumbers = [];
  sceneData: any;
  deviceData = [];
  devicesId = [];
  devicesSceneState = [];
  sceneChannelId = [];
  sceneDevices = [];
  sceneId: any;
  scenesDevicesState = [];
  plugNumber: number;
  dev: {
    deviceId: any;
    deviceName: string;
    plugNumber: number[]
    plugId: any;
    deviceIcon: string;
    deviceState: string;
    dateModified: any;
    channelName: string;
    isChecked: boolean;
  };
  de: {
    deviceId: any;
  };

  showlist: boolean;
  showChannelName: string = '';
  devicesInfo = [];
  devicesInfoId = [];
  deviceIdEvent: any;
  devicesIdArray = [];
  reactiveForm: FormGroup;
  submitted: boolean = false;
  indexOfSelctedChannel;
  macId: any;
  hideEdit: boolean = true;
  hideDelete: boolean = true;
  subscription: Subscription;
  devicePlugsInChannel = [];
  // countNumberOfDevices = 0;
  // plugOccupied:number
  // listOfDevices:boolean=false;
  // noDevices:boolean=false;
  userSelectedIcon = 'fan';
  modelData: any;
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toaster: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    this.reactiveForm = this.formBuilder.group({
      deviceName: new FormControl(null, [Validators.required]),
      channelIdSelected: new FormControl(null, [Validators.required]),
      plugNumber: new FormControl(null, [Validators.required]),
    });
  }

  get f() {
    return this.reactiveForm.controls;
  }
  ngOnInit() { }
  show() {
    if (this.channelIdSelected) {
      this.showlist = true;
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .doc(this.channelIdSelected.channelId)
        .get()
        .subscribe((value) => {
          this.showChannelName = value.get('channelName');
          this.macId = value.get('macId')
        });
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices', (ref) =>
          ref.where('channelId', '==', this.channelIdSelected.channelId)
        )
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicesInfo[index] = doc.data();
          });
          //   if(this.devicesInfo.length>0){
          //     this.listOfDevices=true;
          //     this.noDevices=false;
          //   }
          //   else{
          //     this.noDevices=true;
          //     this.listOfDevices=false;
          //   }
        });
    } else {
      this.showlist = false;
    }
  }
  ionViewWillEnter() {
    this.show();
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // console.log(this.userId);
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.channelsArray = data.get('channelsarray');
          // console.log(this.channelsArray);

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
                this.channelCapacity[index] = {
                  capacity: value.get('capacity'),
                  channelId: value.get('channelId'),

                };
              });
          });
        });
    });
  }

  plugFunc() {
    this.show();
    this.indexOfSelctedChannel = this.channelsArray.findIndex(
      (id: { channelId: any }) =>
        id.channelId == this.channelIdSelected.channelId
    );

    this.plugNumbers = [];
    // this.countNumberOfDevices = 0;
    for (
      let index = 0;
      index < this.channelCapacity[this.indexOfSelctedChannel].capacity;
      index++
    ) {
      this.plugNumbers[index] = {
        ind: index + 1,
        id: index,
      };
    }
    this.devicesInfo = [];
    this.devicesInfoId = [];
    this.deviceIconName = [];
    this.plug = [];
    this.deviceIcons = [];

    this.afs
      .collection('user')
      .doc(this.userId)
      .collection('devices', (ref) =>
        ref.where('channelId', '==', this.channelIdSelected.channelId)
      )
      .get()
      .subscribe((snapshot) => {
        snapshot.docs.forEach((doc, index) => {
          this.devicesInfo[index] = doc.data();
          // this.countNumberOfDevices++;
        });
        // if(this.devicesInfo.length>0){
        //   this.listOfDevices=true;
        //   this.noDevices=false;
        // }
        // else{
        //   this.noDevices=true;
        //   this.listOfDevices=false;
        // }
        for (let index = 0; index < this.devicesInfo.length; index++) {
          this.devicesInfoId[index] = this.devicesInfo[index].deviceId;
          this.deviceIconName[index] = this.devicesInfo[index].deviceName;
          // this.devicesInfoId[index]=this.devicesInfo[index].deviceId
          this.plug[index] = this.devicesInfo[index].plugNumber;
          this.deviceIcons[index] = this.devicesInfo[index].deviceIcon;
        }
        // console.log(this.countNumberOfDevices);
      });
    // console.log(this.devicesInfo,Object.keys(this.devicesInfo).length,typeof(this.devicesInfo))
  }

  backBtnTo() {
    this.router.navigate(['home']);
  }

  doneBtnTo() {
    this.router.navigate(['home']);
  }
  // checkPlugNumber(){
  //   console.log(this.plugNumber)
  //   this.afs
  //   .collection('user')
  //   .doc(this.userId)
  //   .collection('devices', (ref) =>
  //     ref.where('channelId', '==', this.channelIdSelected.channelId).where('plugNumber',"==",this.plugNumber)
  //   )
  //   .get()
  //   .subscribe((snapshot) => {
  //       this.plugOccupied=snapshot.size

  //   });

  // }
  async save() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    }

    // console.log(this.countNumberOfDevices);

    // console.log(this.deviceName);
    // console.log(this.channelIdSelected.channelId);
    // this.checkPlugNumber();

    // console.log(this.plugOccupied);
    // if (
    //   this.countNumberOfDevices <
    //   this.channelCapacity[this.indexOfSelctedChannel].capacity
    // && this.plugOccupied==0) {
    //   this.countNumberOfDevices++;
    // console.log(this.countNumberOfDevices);

    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    this.subscription = this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      loading.dismiss()
      this.afs.collection('user')
        .doc(this.userId)
        .collection('devices', (ref) => ref.where('channelId', '==', this.channelIdSelected.channelId))
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicePlugsInChannel[index] = doc.data().plugNumber;
          })

          console.log(this.devicePlugsInChannel)
          if (this.devicePlugsInChannel.some(val => val == this.plugNumber)) {
            loading.dismiss()
            this.toast("Same Plug Number cannot be used on more than 1 device, Please choose different Plug Number", "warning")
          }


          else {
            console.log(this.userSelectedIcon)
            this.deviceId = 'd' + this.channelIdSelected.channelId + Date.now();

            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices')
              .doc(this.deviceId)
              .set({
                deviceId: this.deviceId,
                deviceName: this.deviceName,
                plugNumber: Number(this.plugNumber),
                plugId: 'p' + this.plugNumber + Date.now(),
                deviceIcon: this.userSelectedIcon,
                deviceState: 'Not-set',
                dateModified: Date.now(),
                channelId: this.channelIdSelected.channelId,
                channelName: this.channelIdSelected.channelName,
                isChecked: "false",
                macId: this.macId,
                sceneDevicesCount: 0,
                scenesScheduleBits: []

              }).then(async () => {
                this.subscription.unsubscribe()
                loading.dismiss();
                this.toast('Device added Sucessfully', 'success');
                this.afs
                  .collection('user')
                  .doc(this.userId)
                  .collection('devices', (ref) =>
                    ref.where('channelId', '==', this.channelIdSelected.channelId)
                  )
                  .get()
                  .subscribe((snapshot) => {
                    snapshot.docs.forEach((doc, index) => {
                      this.devicesInfo[index] = doc.data();
                      // this.countNumberOfDevices++;
                    });

                    for (let index = 0; index < this.devicesInfo.length; index++) {
                      this.devicesInfoId[index] = this.devicesInfo[index].deviceId;
                      this.deviceIconName[index] = this.devicesInfo[index].deviceName;
                      // this.devicesInfoId[index]=this.devicesInfo[index].deviceId
                      this.plug[index] = this.devicesInfo[index].plugNumber;
                      this.deviceIcons[index] = this.devicesInfo[index].deviceIcon;
                    }
                    // console.log(this.countNumberOfDevices);
                  });

              }).catch(async error => {
                loading.dismiss();
                this.toast(error.message, 'danger')
              })

          }
        })

    });
    this.devicesInfo = [];
    this.devicesInfoId = [];
    this.deviceIconName = [];
    this.plug = [];
    this.deviceIcons = [];

    this.afs
      .collection('user')
      .doc(this.userId)
      .collection('devices', (ref) =>
        ref.where('channelId', '==', this.channelIdSelected.channelId)
      )
      .get()
      .subscribe((snapshot) => {
        snapshot.docs.forEach((doc, index) => {
          this.devicesInfo[index] = doc.data();
        });
        //  if(this.devicesInfo.length>0){
        //   this.listOfDevices=true;
        //   this.noDevices=false;
        // }
        // else{
        //   this.noDevices=true;
        //   this.listOfDevices=false;
        // }
        for (let index = 0; index < this.devicesInfo.length; index++) {
          this.devicesInfoId[index] = this.devicesInfo[index].deviceId;
          this.deviceIconName[index] = this.devicesInfo[index].deviceName;
          this.plug[index] = this.devicesInfo[index].plugNumber;
          this.deviceIcons[index] = this.devicesInfo[index].deviceIcon;
        }
      });

  }
  async editDevice() {
    const modal = await this.modalController.create({
      component: EditDeviceModalComponent,
      cssClass: 'editdevicemodalstyle',
      componentProps: {
        deviceId: this.deviceIdEvent,
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {
      this.devicesInfo = [];
      this.devicesInfoId = [];
      this.deviceIconName = [];
      this.plug = [];
      this.deviceIcons = [];

      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices', (ref) =>
          ref.where('channelId', '==', this.channelIdSelected.channelId)
        )
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicesInfo[index] = doc.data();
          });
          for (let index = 0; index < this.devicesInfo.length; index++) {
            this.devicesInfoId[index] = this.devicesInfo[index].deviceId;
            this.deviceIconName[index] = this.devicesInfo[index].deviceName;
            this.plug[index] = this.devicesInfo[index].plugNumber;
            this.deviceIcons[index] = this.devicesInfo[index].deviceIcon;
          }
        });
    });
    return await modal.present();
  }
  async deleteDevice() {
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    let selectedDeviceId = this.deviceIdEvent;
    this.afs.collection('user')
      .doc(this.userId)
      .collection('scenes')
      .get()
      .subscribe((value) => {
        value.docs.forEach((doc, index) => {
          this.sceneData = [];
          this.sceneDevices = [];
          this.scenesDevicesState = [];
          this.sceneChannelId = [];
          console.log(doc.data());
          this.sceneData = doc.data();
          if (this.sceneData != undefined) {
            this.sceneData.sceneChannels.forEach(element1 => {
              if (element1 == this.channelIdSelected.channelId) {

                this.sceneId = this.sceneData.sceneId,
                  this.sceneData.sceneDevices.forEach(element => {
                    this.sceneDevices.push(element)
                  });
                this.sceneData.scenesDevicesState.forEach(element => {
                  this.scenesDevicesState.push(element)
                });
                console.log(this.sceneDevices)
                console.log(selectedDeviceId)
                this.sceneDevices.forEach((element3, index1) => {
                  if (element3 == selectedDeviceId) {
                    this.sceneDevices.splice(index1, 1);
                  }
                })
                this.scenesDevicesState.forEach((element3, index1) => {
                  if (element3.deviceId == selectedDeviceId) {
                    this.scenesDevicesState.splice(index1, 1);
                  }
                })
                console.log(this.sceneDevices)
                this.afs.collection('user')
                  .doc(this.userId)
                  .collection('scenes')
                  .doc(this.sceneId)
                  .update({
                    sceneDevices: this.sceneDevices,
                    scenesDevicesState: this.scenesDevicesState
                  })
              }
            })
          }

        })
      })
    this.afs
      .collection('user')
      .doc(this.userId)
      .collection('devices')
      .doc(this.deviceIdEvent)
      .delete().then(async () => {
        loading.dismiss();
        this.toast('Device Deleted', 'danger');

      }).catch(async error => {
        loading.dismiss();
        this.toast('Error Occurred', 'danger')
      })
  
    this.deviceIdEvent = '';

    const indexOfSelctedChannel = this.channelsArray.findIndex(
      (id: { channelId: any }) =>
        id.channelId == this.channelIdSelected.channelId
    );

    this.plugNumbers = [];
    for (
      let index = 0;
      index < this.channelCapacity[indexOfSelctedChannel].capacity;
      index++
    ) {
      this.plugNumbers[index] = {
        ind: index + 1,
        id: index,
      };
    }
    this.devicesInfo = [];
    this.devicesInfoId = [];
    this.deviceIconName = [];
    this.plug = [];
    this.deviceIcons = [];

    this.afs
      .collection('user')
      .doc(this.userId)
      .collection('devices', (ref) =>
        ref.where('channelId', '==', this.channelIdSelected.channelId)
      )
      .get()
      .subscribe((snapshot) => {
        snapshot.docs.forEach((doc, index) => {
          this.devicesInfo[index] = doc.data();
        });
        // if(this.devicesInfo.length>0){
        //   this.listOfDevices=true;
        // }
        // else{
        //   this.noDevices=true;
        // }
        for (let index = 0; index < this.devicesInfo.length; index++) {
          this.devicesInfoId[index] = this.devicesInfo[index].deviceId;
          this.deviceIconName[index] = this.devicesInfo[index].deviceName;
          this.plug[index] = this.devicesInfo[index].plugNumber;
          this.deviceIcons[index] = this.devicesInfo[index].deviceIcon;
        }
      });
  }

  async openModal() {

    const modal = await this.modalController.create({
      component: DeviceIconModalComponent,
      cssClass: '',
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        this.userSelectedIcon = modelData.data
      }
    })
    return await modal.present();
  }

  async deviceIconSelect() {

    const modal = await this.modalController.create({
      component: DeviceIconModalComponent,
      cssClass: '',
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        // console.log('Modal Data : ' + modelData.data);
        this.userSelectedIcon = modelData.data
        // console.log("Selected icon",this.userSelectedIcon)
      }
    })
    return await modal.present();
  }
  operationEdit() {
    this.editDevice();
  }
  operationDelete() {
    this.deleteDevice();
  }
  trackByValue(index: number, numbers: any): number {
    return numbers.ind;
  }

  trackBy(index: number, item: any): number {
    return item.deviceId;
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      window.location.reload();
    }, 3000);
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

//**pending */ first we have to check that devices no are full or not and simultaneously and plug numbers are not usesd twice and in edit device taht plug is not in use already**
