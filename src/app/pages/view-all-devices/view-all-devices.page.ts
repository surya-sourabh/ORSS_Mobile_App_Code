import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddDeviceModalComponent } from 'src/app/components/add-device-modal/add-device-modal.component';
import { EditChannelModalComponent } from 'src/app/components/edit-channel-modal/edit-channel-modal.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { EditDeviceModalComponent } from 'src/app/components/edit-device-modal/edit-device-modal.component';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
// import { DeviceIconModalComponent } from 'src/app/components/device-icon-modal/device-icon-modal.component';
@Component({
  selector: 'app-view-all-devices',
  templateUrl: './view-all-devices.page.html',
  styleUrls: ['./view-all-devices.page.scss'],
})
export class ViewAllDevicesPage implements OnInit {
  manageBtnHide: boolean = true;
  showOrHide: boolean = true;
  channelClickedId;
  title: string;
  titleIcon = true;
  iconName = 'dice-four'
  titlebarLTiText = '';
  titlebarRTiText = 'Total Devices';
  titlebarLSubTiText = '';
  titlebarRSubTiText: any = 0;
  sceneData: any;
  deviceData = [];
  devicesId = [];
  devicesSceneState = [];
  sceneChannelId = [];
  sceneDevices = [];
  sceneId: any;
  scenesDevicesState = [];
  viewRText = 'Manage';
  viewLIcon = 'plug';
  viewRIcon = 'cogs';
  deviceIconName = [];
  deviceIconsType = ['fas', 'far'];
  deviceName = ['Light Bulb', 'Fan', 'Desktop', 'TV'];
  plugBox = [false, true];
  plug = [];
  powerState = [];
  showPowerButton = [false, true];
  fromModal: any;
  userId: string = '';
  devicesInfo = [];
  deviceIcons = [];
  devicesInfoId = [];
  deviceIdEvent: any;
  channelsArray = [];
  channelId = [];
  channelCapacity = [];
  channelName = [];
  plugNumbers = [];
  listOfDevices: boolean = false;
  noDevices: boolean = false;
  editChannelName: string = '';
  channelCapacityForModal: number
  plugNumbersForModal = [];
  deviceNameFromModal: string = '';
  plugNumberFromModal: number = 0;
  deviceId;
  private subscription: Subscription;
  public message: string;
  deviceLength: number;
  newObj = {
    plug: '',
    state: ''
  }
  singleDevice = [];
  tempObj;
  splittedDeviceArray = [];
  activeState = [];
  subscription1: Subscription;
  public value: any;
  macId = []
  macIdForMqtt = []
  tempMacId = []
  macIdForPublish = []
  devicesList = []
  //For quick MQTT Testing
  resultDeviceList = []
  stateMessage = ''
  macIdPlugStatusList = {}
  accessLevel: any;
  hideEdit: boolean = true;
  hideDelete: boolean = true;
  n: number = 4;
  userSelectedIcon: string;
  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private toaster: ToastController,
    private loadingCtrl: LoadingController,
    private _mqttService: MqttService
  ) {
    var navigation = this.router.getCurrentNavigation();
    var state = navigation.extras.state as { chId: string; };
    if (state) {
      this.channelClickedId = state.chId
      // console.log(this.channelClickedId)

    }

    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices', (ref) => ref.where("channelId", "==", this.channelClickedId))
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicesList.push(doc.data());

          })
          // console.log(this.devicesList)
          this.devicesList.sort(this.compare)
          this.resultDeviceList = this.devicesList;
          console.log(this.resultDeviceList)

        })


      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .get()
        .subscribe((snapshot) => {
          const macIdList = []
          // console.log(snapshot)
          snapshot.docs.forEach((doc, index) => {
            const tempMacId = doc.data().macId;

            setInterval(() => {
              let tempPublishObservable = this._mqttService.publish("apsis/migro/" + tempMacId + "/GetStatus", "")
              tempPublishObservable.subscribe((data) => { console.log(data) },
                (err) => { console.log(err) })
            }, 300000);
            // console.log(macId)
            let tempPublishObservable = this._mqttService.publish("apsis/migro/" + tempMacId + "/GetStatus", "")
            tempPublishObservable.subscribe((data) => { console.log(data) },
              (err) => { console.log(err) })




            this.subscription = this._mqttService.observe('apsis/migro/' + tempMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
              console.log(message)
              const newMacId = message.topic.toString().split('/')[2];
              let tempMessage = '';

              if (message.payload.toString() && message.payload.toString().length > 0) {
                // tempMessage = message.payload.toString();
                // this.stateMessage = message.payload.toString();

                if (this.macIdPlugStatusList[newMacId]) {
                  // update the string for this macId
                  // let tempPlugStatusString = this.macIdPlugStatusList[newMacId];
                  const newMessage = message.payload.toString(); // '1:0,2:1'
                  const oldMessage = this.macIdPlugStatusList[newMacId]; // '1:1,2:1,3:1'

                  const splitNewMessage = newMessage.split(","); // ['1:0','2:1']
                  const splitOldMessage = newMessage.split(","); // ['1:0','2:1']

                  for (let i = 0; i < splitNewMessage.length; i++) {
                    // console.log(splitValue[i])
                    const tempPlug = splitNewMessage[i].split(':'); // ['1','0']
                    const tempPlugNumber = tempPlug[0];
                    splitOldMessage[tempPlugNumber] = splitNewMessage[i];

                  }
                  tempMessage = splitOldMessage.join(',');


                } else {
                  //not present add the string with new macId as key
                  tempMessage = this.macIdPlugStatusList[newMacId];

                }

              }



              // console.log(message)
              // console.log('topic', message.topic)
              if (!this.stateMessage || this.stateMessage.length == 0) {
                tempMessage = message.payload.toString();
                this.stateMessage = message.payload.toString();

              } else {
                const newState = message.payload.toString().split(':');
                const newMacId = message.topic.toString().split('/')[2];

                // console.log(newState);
                // console.log(newMacId);
                tempMessage = message.payload.toString();

              }

              let tempSplittedDeviceArray = [];

              // console.log("Message:", tempMessage)
              if (!tempMessage || tempMessage.length == 0) {

                console.log("No String")
              }
              else {

                const splitValue = tempMessage.split(",");
                // console.log(splitValue)
                for (let i = 0; i < splitValue.length; i++) {
                  // console.log(splitValue[i])
                  const singleDevice = splitValue[i].split(':');
                  // console.log(this.singleDevice);
                  let newObj = {
                    plug: '',
                    state: '',
                    macId: ''
                  }

                  newObj.plug = singleDevice[0]
                  newObj.state = singleDevice[1]
                  newObj.macId = newMacId
                  const tempObj = { ...newObj }
                  // console.log(this.tempObj)
                  tempSplittedDeviceArray.push(tempObj)
                }
                // console.log(tempSplittedDeviceArray)

                const tempList = []

                // [{plugNumber:1, macId:'23:34'},{plugNumber:2, macId:'23:34'}]
                this.resultDeviceList.forEach((device) => {
                  // [{plug:1,state:0,macId: 14:13:13}, {plug:1,state:0,macId: 14:13:13}]

                  for (let i = 0; i < tempSplittedDeviceArray.length; i++) {
                    if (device.plugNumber == tempSplittedDeviceArray[i].plug && device.macId == tempSplittedDeviceArray[i].macId) {
                      tempList.push({ ...device, ...tempSplittedDeviceArray[i] })
                      // console.log("NEW OBJ", { ...device, ...tempSplittedDeviceArray[i] })
                      break;

                    } else if (i == tempSplittedDeviceArray.length - 1) {
                      tempList.push({ ...device, })
                    }
                  }

                })
                if (tempList.length > 0) {
                  this.resultDeviceList = (tempList)
                }
                // console.log(this.resultDeviceList)
              }

            })
          });
        })
    })

  }

  compare(a, b) {
    if (a.plugNumber < b.plugNumber) {
      return -1;
    }
    if (a.plugNumber > b.plugNumber) {
      return 1;
    }
    return 0;
  }

  click(plugNumber, macId, deviceState) {
    // console.log(plugNumber)
    // console.log(macId)
    // console.log(deviceState)
    // let value = '';
    this.subscription1 = this._mqttService.observe('apsis/migro/' + macId + '/' + plugNumber).subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
      console.log("Message: ", this.message)
    });

    deviceState = deviceState == "ON" || deviceState == "1" ? "0" : "1";
    let tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + macId + "/" + plugNumber, deviceState)
    tempPublishPlug1Off.subscribe((data) => { console.log(data) },
      (err) => { console.log(err) })

  }
  ngOnInit() { }

  backBtnTo() {
    this.router.navigate(['home']);
  }

  ionViewWillEnter() {
    this.channelClickedId = localStorage.getItem('channelId')
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs.collection('user').doc(this.userId).get()
        .subscribe((data) => {
          this.accessLevel = data.get('accessLevel')
          if (this.accessLevel == '1') {
            this.manageBtnHide = false;
            this.showOrHide = false;
            this.hideEdit = false;
            this.hideDelete = false;

          }

        })
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.channelsArray = data.get('channelsarray');
          // console.log(this.channelsArray);
          if (this.channelsArray) {

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
          }
        });
      this.devicesInfo = [];
      this.devicesInfoId = [];
      this.deviceIconName = [];
      this.plug = [];
      this.deviceIcons = [];
      if (this.channelClickedId) {


        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('channels')
          .doc(this.channelClickedId)
          .get()
          .subscribe((value) => {
            this.title = value.get('channelName');
            this.viewLIcon = value.get('icon')
          });
        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('devices', ref => ref.where('channelId', '==', this.channelClickedId)

          ).get().subscribe((snapshot) => {
            snapshot.docs.forEach((doc, index) => {
              this.devicesInfo[index] = doc.data();
            });
            console.log(this.devicesInfo.length)
            if (this.devicesInfo.length > 0) {
              this.resultDeviceList = this.devicesInfo.sort(this.compare)
              this.titlebarRSubTiText = this.devicesInfo.length;
              this.n = 4 - this.devicesInfo.length
              this.listOfDevices = true;
              this.noDevices = false;
              for (let index = 0; index < this.devicesInfo.length; index++) {
                this.devicesInfoId[index] = this.devicesInfo[index].deviceId
                this.deviceIconName[index] = this.devicesInfo[index].deviceName
                this.plug[index] = this.devicesInfo[index].plugNumber
                this.deviceIcons[index] = this.devicesInfo[index].deviceIcon
                this.activeState[index] = "power-default"


              }
            }
            else {
              this.n = 4 - this.devicesInfo.length
              this.titlebarRSubTiText = this.devicesInfo.length
              this.noDevices = true;
              this.listOfDevices = false;
            }
          });
      }
    })

  }
  trackBy(index: number, item: any): number {
    return item.deviceId;
  }
  // showDeviceslist(){

  // }
  operationEdit() {
    this.editDevice();
  }
  operationDelete(state) {
    console.log(state)
    this.deleteDevice(state);
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
        .collection('devices', ref => ref.where('channelId', '==', this.channelClickedId)

        ).get().subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicesInfo[index] = doc.data();
          });
          if (this.devicesInfo.length > 0) {
            this.listOfDevices = true;
            this.noDevices = false;
            // for (let index = 0; index < this.devicesInfo.length; index++) {
            //   this.devicesInfoId[index] = this.devicesInfo[index].deviceId
            //   this.deviceIconName[index] = this.devicesInfo[index].deviceName
            //   this.plug[index] = this.devicesInfo[index].plugNumber
            //   this.deviceIcons[index] = this.devicesInfo[index].deviceIcon

            // }
            this.devicesList = []
            this.resultDeviceList = []
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices', (ref) => ref.where("channelId", "==", this.channelClickedId))
              .get()
              .subscribe((snapshot) => {
                snapshot.docs.forEach((doc, index) => {
                  this.devicesList.push(doc.data());

                })
                // console.log(this.devicesList)
                this.devicesList.sort(this.compare)
                this.resultDeviceList = this.devicesList;
              })
          }
          else {
            this.noDevices = true;
            this.listOfDevices = false;
          }
        });
    }
    )
    return await modal.present();
  }
  async deleteDevice(state) {
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    if(state == "ON" || state == 1){
      loading.dismiss();
      this.toast('Cannot delete device while device is On. Switch Off device and try again','warning')
    } else {
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
          this.sceneData = doc.data();
          if (this.sceneData != undefined) {
            this.sceneData.sceneChannels.forEach(element1 => {
              if (element1 == this.channelClickedId) {

                this.sceneId = this.sceneData.sceneId,
                  this.sceneData.sceneDevices.forEach(element => {
                    this.sceneDevices.push(element)
                  });
                this.sceneData.scenesDevicesState.forEach(element => {
                  this.scenesDevicesState.push(element)
                });
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
        this.devicesList = []
        this.resultDeviceList = []
        this.toast('Device Deleted ', 'danger');
        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('devices', (ref) => ref.where("channelId", "==", this.channelClickedId))
          .get()
          .subscribe((snapshot) => {
            snapshot.docs.forEach((doc, index) => {
              this.devicesList.push(doc.data());

            })
            // console.log(this.devicesList)
            this.titlebarRSubTiText = this.devicesList.length
            this.devicesList.sort(this.compare)
            this.resultDeviceList = this.devicesList;
            this.n = 4 - this.devicesList.length

          })

      }).catch(async error => {
        loading.dismiss();
        this.toast('Error Occurred', 'danger')
      })
    // console.log(this.deviceIdEvent)
    this.deviceIdEvent = "";
    // console.log(this.deviceIdEvent)
    // console.log(this.devicesInfoId)
    const indexOfSelctedChannel = this.channelsArray.findIndex(
      (id: { channelId: any }) => id.channelId == this.channelClickedId
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
      .collection('devices', ref => ref.where('channelId', '==', this.channelClickedId)

      ).get().subscribe((snapshot) => {
        snapshot.docs.forEach((doc, index) => {
          this.devicesInfo[index] = doc.data();
        });
        if (this.devicesInfo.length > 0) {
          this.listOfDevices = true;
          this.noDevices = false
          for (let index = 0; index < this.devicesInfo.length; index++) {
            this.devicesInfoId[index] = this.devicesInfo[index].deviceId
            this.deviceIconName[index] = this.devicesInfo[index].deviceName
            this.plug[index] = this.devicesInfo[index].plugNumber
            this.deviceIcons[index] = this.devicesInfo[index].deviceIcon

          }
        }
        else {
          this.noDevices = true;
          this.listOfDevices = false;
        }
      });
    }      
  }
  addDevice() {
    this.router.navigate(['add-device-to-channel']);
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
        .doc(this.channelClickedId)
        .get()
        .subscribe((value) => {
          this.editChannelName = value.get('channelName');
          this.macId = value.get('macId')

          // console.log(this.editChannelName)
        });
    });
  }
  getPlugNumbers() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // console.log(this.userId);
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .doc(this.channelClickedId)
        .get()
        .subscribe((value) => {

          this.channelCapacityForModal = value.get('capacity');
          // console.log(this.channelCapacityForModal)
          this.plugNumbersForModal = [];
          for (
            let index = 0;
            index < this.channelCapacityForModal;
            index++
          ) {
            this.plugNumbersForModal[index] = {
              ind: index + 1,
              id: index,
            };
          }
        });
    });

    // console.log(this.plugNumbersForModal)
  }
  async opendeviceModal() {

    const modal = await this.modalController.create({
      component: AddDeviceModalComponent,
      cssClass: 'adddevicemodalstyle',
      componentProps: {
        plugNumbers: this.plugNumbersForModal,
      },
      backdropDismiss: false,
    });
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    modal.onDidDismiss().then((data) => {
      let details = {
        deviceNameFromModal: '',
        plugNumberFromModal: 0,
        deviceIcon: ''
      };
      details = data['data'];
      this.deviceNameFromModal = details.deviceNameFromModal;
      this.plugNumberFromModal = details.plugNumberFromModal;
      this.userSelectedIcon = details.deviceIcon;
      this.subscription = this.afauth.authState.subscribe((user) => {
        if (user) {
          this.userId = user.uid;
        }
        if (this.deviceNameFromModal.length > 0 && this.plugNumberFromModal > 0) {
          if (this.plug.some(val => val == this.plugNumberFromModal)) {
            this.toast("Same Plug Number cannot be used on more than 1 device, Please choose different Plug Number", "warning")
          }
          else {

            this.deviceId = 'd' + this.channelClickedId + Date.now();
            loading.present();
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices')
              .doc(this.deviceId)
              .set({
                deviceId: this.deviceId,
                deviceName: this.deviceNameFromModal,
                plugNumber: this.plugNumberFromModal,
                plugId: 'p' + this.plugNumberFromModal + Date.now(),
                deviceIcon: this.userSelectedIcon,
                deviceState: 'Not-set',
                dateModified: Date.now(),
                channelId: this.channelClickedId,
                channelName: this.title,
                macId: this.macId,
                sceneDevicesCount: 0,
                scenesScheduleBits: []
              }).then(async () => {
                this.subscription.unsubscribe()
                loading.dismiss();
                this.resultDeviceList = []
                this.devicesList = []
                this.toast('Device added Sucessfully', 'success');
                this.afs
                  .collection('user')
                  .doc(this.userId)
                  .collection('devices', (ref) => ref.where("channelId", "==", this.channelClickedId))
                  .get()
                  .subscribe((snapshot) => {
                    snapshot.docs.forEach((doc, index) => {
                      this.devicesList.push(doc.data());

                    })
                    // console.log(this.devicesList)
                    this.titlebarRSubTiText = this.devicesList.length;
                    this.devicesList.sort(this.compare)
                    this.resultDeviceList = this.devicesList;
                    this.n = 4 - this.devicesList.length
                  })

              }).catch(async error => {
                loading.dismiss();
                this.toast('Error Occurred..!!', 'danger')
              })
          }
        }
        this.devicesInfo = [];
        this.devicesInfoId = [];
        this.deviceIconName = [];
        this.plug = [];
        this.deviceIcons = [];

        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('devices', ref => ref.where('channelId', '==', this.channelClickedId)

          ).get().subscribe((snapshot) => {
            snapshot.docs.forEach((doc, index) => {
              this.devicesInfo[index] = doc.data();
            });

            if (this.devicesInfo.length > 0) {
              this.listOfDevices = true;
              this.noDevices = false
              // this.titlebarRSubTiText=this.devicesInfo.length;
              for (let index = 0; index < this.devicesInfo.length; index++) {
                this.devicesInfoId[index] = this.devicesInfo[index].deviceId
                this.deviceIconName[index] = this.devicesInfo[index].deviceName
                this.plug[index] = this.devicesInfo[index].plugNumber
                this.deviceIcons[index] = this.devicesInfo[index].deviceIcon
              }
            }
            else {
              // this.titlebarRSubTiText=0;
              this.noDevices = true;
              this.listOfDevices = false;
            }

          });
      });


    });



    return await modal.present();
  }
  async openEditChannelModal() {
    // console.log(this.editChannelName)

    const modal = await this.modalController.create({
      component: EditChannelModalComponent,
      cssClass: 'editchannelmodalstyle',
      componentProps: {
        editChannelNam: this.editChannelName,
      },
      backdropDismiss: false,
    });
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    modal.onDidDismiss().then((data) => {
      let dat = {
        editChannelName: '',
      };

      dat = data['data'];
      this.editChannelName = dat.editChannelName;
      this.afauth.authState.subscribe((user) => {
        if (user) {
          this.userId = user.uid;
        }
        if (this.editChannelName.length > 1) {
          loading.present();
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('channels')
            .doc(this.channelClickedId)
            .update({
              channelName: this.editChannelName,
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
              ref.where('channelId', '==', this.channelClickedId)
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
        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('channels')
          .doc(this.channelClickedId)
          .get()
          .subscribe((value) => {
            this.title = value.get('channelName');
          });
      });
    });

    return await modal.present();
  }

  async manageSheet() {
    this.getNameToEdit();
    this.getPlugNumbers();
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'action-sheets-style',
      buttons: [
        {
          text: 'Add electronic device to this channel',
          handler: () => {

            this.opendeviceModal()
            // console.log(this.deviceNameFromModal)
            // console.log(this.plugNumberFromModal)
          },
        },
        {
          text: 'Remove all electronic devices from channel',

          handler: () => {

            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices', (ref) =>
                ref.where('channelId', '==', this.channelClickedId)
              )
              .get()
              .subscribe((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  console.log(doc.data().deviceId)
                  this.deviceData.push(doc.data().deviceId)
                });

                this.afs.collection('user')
                  .doc(this.userId)
                  .collection('scenes')
                  .get()
                  .subscribe((value) => {
                    value.docs.forEach((doc, index) => {
                      this.sceneData = [];
                      this.sceneDevices = [];
                      this.scenesDevicesState = [];
                      this.sceneData = doc.data();
                      if (this.sceneData != undefined) {
                        this.sceneData.sceneChannels.forEach(element1 => {
                          if (element1 == this.channelClickedId) {

                            this.sceneId = this.sceneData.sceneId,
                              this.sceneData.sceneDevices.forEach(element => {
                                this.sceneDevices.push(element)
                              });
                            this.sceneData.scenesDevicesState.forEach(element => {
                              this.scenesDevicesState.push(element)
                            });
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
              .collection('devices', ref => ref.where('channelId', '==', this.channelClickedId)

              ).get().subscribe((snapshot) => {
                snapshot.docs.forEach((doc, index) => {
                  this.devicesInfo[index] = doc.data();
                });
                for (let index = 0; index < this.devicesInfo.length; index++) {

                  this.afs
                    .collection('user')
                    .doc(this.userId)
                    .collection('devices')
                    .doc(this.devicesInfo[index].deviceId)
                    .delete();
                }
                this.titlebarRSubTiText = 0;

              });
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('channels')
              .doc(this.channelClickedId)
              .get()
              .subscribe((value) => {
                this.n = value.get('capacity');
              });
            this.noDevices = true;
            this.listOfDevices = false;

          },
        },
        {
          text: 'Delete the channel',

          handler: () => {
            loading.present();
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices', (ref) =>
                ref.where('channelId', '==', this.channelClickedId)
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
                          if (element1 == this.channelClickedId) {

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
                              if (element == this.channelClickedId) {
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
                  (id: { channelId: any }) => id.channelId !== this.channelClickedId
                ),
              });
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('channels')
              .doc(this.channelClickedId)
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
                ref.where('channelId', '==', this.channelClickedId)
              )
              .get()
              .subscribe((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  doc.ref.delete();
                });
              });
            this.backBtnTo();
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
