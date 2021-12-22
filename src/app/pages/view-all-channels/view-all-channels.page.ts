import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { EditChannelModalComponent } from 'src/app/components/edit-channel-modal/edit-channel-modal.component';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Console } from 'console';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-view-all-channels',
  templateUrl: './view-all-channels.page.html',
  styleUrls: ['./view-all-channels.page.scss'],
})
export class ViewAllChannelsPage implements OnInit {
  activeState = [];
  sceneData: any;
  deviceData = [];
  devicesId = [];
  devicesSceneState = [];
  sceneChannelId = [];
  sceneDevices = [];
  sceneId: any;
  scenesDevicesState = [];
  accessLevel: any;
  showRightButton: boolean = true;
  numberOfdevices = [];
  channelIcon: any;
  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private _mqttService: MqttService
  ) {

    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, i) => {
            this.activeState[i] = 'power-default'
            const tempMacId = doc.data().macId;

            let tempPublishObservable = this._mqttService.publish("apsis/migro/" + tempMacId + "/GetStatus", "")
            tempPublishObservable.subscribe((data) => { console.log(data) },
              (err) => { console.log(err) })


            this.subscription1 = this._mqttService.observe('apsis/migro/' + tempMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
              console.log(message.payload.toString())



              let plugStateArray = []
              //first publish and subscribe
              const splitValue = message.payload.toString().split(',')
              console.log(splitValue)
              for (let i = 0; i < splitValue.length; i++) {
                const plugStateValue = splitValue[i].split(':')
                // console.log(plugStateValue)
                let newObj = {
                  plug: '',
                  state: '',
                  macId: ''
                }

                newObj.plug = plugStateValue[0]
                newObj.state = plugStateValue[1]
                newObj.macId = tempMacId

                const tempObj = { ...newObj }
                plugStateArray.push(tempObj)
              }
              console.log(plugStateArray)
              let stateArray = []
              plugStateArray.filter(data => {
                stateArray.push(data.state)
                console.log(stateArray)
              })

              if (stateArray.some(val => val === "1" || val == "ON")) {
                this.activeState[i] = "power-default"
                this.deviceOnOff = "0"
              }

              if (stateArray.every(val => val === "1" || val == "ON")) {
                this.activeState[i] = 'power-on'
                this.deviceOnOff = "1"
              } else if (stateArray.every(val => val === "0" || val == "OFF")) {
                this.activeState[i] = "power-off"
                this.deviceOnOff = "0"
              }


            })
          })

        })
    })
  }
  title = 'My Channels';
  titleIcon = true;
  iconName = 'dice-four'
  titlebarLTiText = 'Good Morning!';
  titlebarRTiText = 'Total Channels';
  titlebarLSubTiText = 'Nitin';
  titlebarRSubTiText = '';
  public message: string;
  viewLText = 'My Channels';
  viewRText = ['Add More Channels', 'Add channel'];
  viewLIcon = 'dice-two';
  viewRIcon = 'plus';
  // powerState = ['power-on', 'power-off', 'power-default'];
  deviceIcons = ['dice-two', 'dice-four', 'dice-six'];
  sceneName = ['Migro_CH 1', 'CH 2', 'CH 3', 'CH 4'];
  deviceIconsType = 'fas';
  channelDeviceConnected = [];
  channelCapacity = [];
  navigatelink = 'wifi-scan-list';
  userId: string = '';
  channelsArray: any;
  channelName = [];
  channelId = [];
  macId = [];
  boxchannelId: any;
  editChannelName: string = '';
  editChannelIcon: string = '';
  showAddChannel = false;
  showChannels = false;
  count = 0;
  subscription1: Subscription;
  deviceOnOff = ''
  showSecondaryUserChannels: boolean = true;
  hideManageBtn: boolean = true;
  ngOnInit() {

  }
  trackByValue(index: number, item: any): number {
    return item.channelId;
  }
  show() {
    this.afs
      .collection('user')
      .doc(this.userId)
      .get()
      .subscribe((data) => {
        this.channelsArray = data.get('channelsarray');
      })
    if (Object.keys(this.channelsArray).length > 0) {
      this.showChannels = true;
    } else {
      this.showAddChannel = true;
    }
  }
  ionViewWillEnter() {

    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs.collection('user').doc(this.userId).get()
        .subscribe((data) => {
          this.accessLevel = data.get('accessLevel')
          if (this.accessLevel == "1") {
            this.showRightButton = false
            this.hideManageBtn = false;

          }
        })
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.channelsArray = data.get('channelsarray');
          // console.log(this.channelsArray, data)
          if (this.channelsArray) {


            this.titlebarRSubTiText = this.channelsArray.length
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
                  this.channelCapacity[index] = value.get('capacity');
                  this.macId[index] = value.get('macId')
                  this.deviceIcons[index] = value.get('icon')


                });
              this.afs
                .collection('user')
                .doc(this.userId)
                .collection('devices', (ref) =>
                  ref.where('channelId', '==', element.channelId)
                )
                .get()
                .subscribe((snapshot) => {
                  this.count = snapshot.size;
                  this.channelDeviceConnected[index] = this.count;
                });


            });
            if (Object.keys(this.channelsArray).length > 0) {
              this.showChannels = true;
            } else {
              this.showAddChannel = true;
            }
          }
        });
    });
  }


  click(macId, capacity, channelId) {
    console.log(macId)
    // console.log(capacity)
    this.afs.collection('user')
      .doc(this.userId)
      .collection('devices', (ref) => ref.where('channelId', '==', channelId))
      .get()
      .subscribe((snapshot) => {
        snapshot.docs.forEach((doc, i) => {
          this.numberOfdevices[i] = doc.data().deviceName
          console.log(this.numberOfdevices)
          if (!this.numberOfdevices.length || this.numberOfdevices == undefined) {
            console.log("No devices")
            this.toast("Cannot On/Off since there are no Devices in this Channel, Please add devives and Try again.", 'warning')
          } else {

            console.log(channelId)
            this.deviceOnOff = this.deviceOnOff == "0" || this.deviceOnOff == "OFF" ? "1" : "0";
            for (let i = 1; i <= 12; i++) {
              console.log(i)
              this.subscription1 = this._mqttService.observe('apsis/migro/' + macId + '/' + i).subscribe((message: IMqttMessage) => {
                this.message = message.payload.toString();
                console.log("Message: ", this.message)
              });


              let tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + macId + "/" + i, this.deviceOnOff)
              tempPublishPlug1Off.subscribe((data) => { console.log(data) },
                (err) => { console.log(err) })

            }
            this.toast("Successfull", "success")
          }
        })
      })
  }



  backBtnTo() {
    this.router.navigate(['home']);
  }
  getNameToEdit() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .doc(this.boxchannelId)
        .get()
        .subscribe((value) => {
          this.editChannelName = value.get('channelName');
          this.channelIcon = value.get('icon')
          // console.log(this.editChannelName)
        });
    });
  }
  async openEditChannelModal() {
    // console.log(this.editChannelName)

    const modal = await this.modalController.create({
      component: EditChannelModalComponent,
      cssClass: 'editchannelmodalstyle',
      componentProps: {
        editChannelNam: this.editChannelName,
        userSelectedIcon: this.channelIcon
      },
      backdropDismiss: false,
    });
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    modal.onDidDismiss().then((data) => {
      console.log(data)
      let dat = {
        editChannelName: '',
        editChannelIcon: ''
      };

      dat = data['data'];

      this.editChannelName = dat.editChannelName;
      this.editChannelIcon = dat.editChannelIcon
        if (this.editChannelName.length > 1) {
          loading.present();
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('channels')
            .doc(this.boxchannelId)
            .update({
              channelName: this.editChannelName,
              icon: this.editChannelIcon
            }).then(async () => {

              loading.dismiss();
              this.toast('Channel Name Edited Sucessfully', 'success');

            }).catch(async error => {
              loading.dismiss();
              this.toast('Error Occurred..!!', 'danger')
            })
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('devices', (ref) =>
              ref.where('channelId', '==', this.boxchannelId)
            )
            .get()
            .subscribe((snapshot) => {
              snapshot.docs.forEach((doc) => {
                doc.ref.update({
                  channelName: this.editChannelName
                })
              });
            });
        }
        this.afs
          .collection('user')
          .doc(this.userId)
          .get()
          .subscribe((data) => {
            this.channelsArray = data.get('channelsarray');
            // console.log(this.channelsArray,data)
            this.channelsArray.forEach(
              (element: any, index: string | number) => {
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
              }
            );
          });
    });

    return await modal.present();
  }

  async buttonClickE() {

    this.getNameToEdit();
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'action-sheets-style',
      buttons: [
        {
          text: 'Delete the channel',

          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'processing..',
              spinner: 'crescent',
              showBackdrop: true
            });
            loading.present();
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices', (ref) =>
                ref.where('channelId', '==', this.boxchannelId)
              )
              .get()
              .subscribe((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  console.log(doc.data().deviceId)
                  // this.deviceData.push(doc.data().)
                  this.deviceData.push(doc.data().deviceId)
                });
                console.log(this.deviceData)

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
                          if (element1 == this.boxchannelId) {

                            this.sceneId = this.sceneData.sceneId,
                              this.sceneData.sceneDevices.forEach(element => {
                                this.sceneDevices.push(element)
                              });
                            this.sceneData.scenesDevicesState.forEach(element => {
                              this.scenesDevicesState.push(element)
                            });
                            this.sceneData.sceneChannels.forEach(element => {
                              this.sceneChannelId.push(element)
                            });
                            this.sceneChannelId.forEach((element, index) => {
                              if (element == this.boxchannelId) {
                                this.sceneChannelId.splice(index, 1);
                              }
                            })
                            console.log(this.sceneId)
                            console.log(this.sceneChannelId)
                            console.log(this.sceneDevices)
                            console.log(this.scenesDevicesState)
                            this.deviceData.forEach((element3, index) => {
                              this.sceneDevices.forEach((element4, index1) => {
                                if (element3 == element4) {
                                  this.sceneDevices.splice(index1, 1);
                                }
                              })
                            })
                            this.deviceData.forEach((element3, index) => {
                              this.scenesDevicesState.forEach((element4, index1) => {
                                if (element3 == element4.deviceId) {
                                  this.scenesDevicesState.splice(index1, 1);
                                }
                              })
                            })
                            console.log(this.sceneDevices)
                            this.afs.collection('user')
                              .doc(this.userId)
                              .collection('scenes')
                              .doc(this.sceneId)
                              .update({
                                sceneChannels: this.sceneChannelId,
                                sceneDevices: this.sceneDevices,
                                scenesDevicesState: this.scenesDevicesState
                              })
                          }
                        })
                      }

                    })
                  })
              });
            this.afs
              .collection('user')
              .doc(this.userId)
              .update({
                channelsarray: this.channelsArray.filter(
                  (id: { channelId: any }) => id.channelId !== this.boxchannelId
                ),
              });

            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('channels')
              .doc(this.boxchannelId)
              .delete().then(async () => {
                loading.dismiss();
                this.toast('Channel Deleted', 'danger');

              }).catch(async error => {
                loading.dismiss();
                this.toast('error..!!', 'danger')
              })
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices', (ref) =>
                ref.where('channelId', '==', this.boxchannelId)
              )
              .get()
              .subscribe((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  doc.ref.delete();
                });
              });
            // console.log(this.boxchannelId);
            this.afs
              .collection('user')
              .doc(this.userId)
              .get()
              .subscribe((data) => {
                this.channelsArray = data.get('channelsarray');
                for (let ind = 0; ind < this.channelsArray.length; ind++) {
                  this.channelId[ind] = this.channelsArray[ind].channelId;
                  this.afs
                    .collection('user')
                    .doc(this.userId)
                    .collection('channels')
                    .doc(this.channelsArray[ind].channelId)
                    .get()
                    .subscribe((value) => {
                      this.channelName[ind] = value.get('channelName');
                      this.channelCapacity[ind] = value.get('capacity');
                    });
                  this.afs
                    .collection('user')
                    .doc(this.userId)
                    .collection('devices', (ref) =>
                      ref.where('channelId', '==', this.channelsArray[ind].channelId)
                    )
                    .get()
                    .subscribe((snapshot) => {

                      this.count = snapshot.size;
                      this.channelDeviceConnected[ind] = this.count;

                    });
                }

                if (Object.keys(this.channelsArray).length < 1) {
                  this.backBtnTo();
                }
                this.titlebarRSubTiText = this.channelsArray.length
              });

            console.log('Delete clicked');
            console.log(Object.keys(this.channelsArray).length);
            this.show()
          },
        },

        {
          text: 'Edit the Channel',
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
      duration: 3000
    });

    toast.present();
  }
}
