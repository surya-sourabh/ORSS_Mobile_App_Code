import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { element } from 'protractor';
import firebase from 'firebase';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AddDeviceModalComponent } from 'src/app/components/add-device-modal/add-device-modal.component';
import { DeviceIconModalComponent } from 'src/app/components/device-icon-modal/device-icon-modal.component';
import { EditDeviceModalComponent } from 'src/app/components/edit-device-modal/edit-device-modal.component';
// import { repeat } from 'rxjs/operators';
@Component({
  selector: 'app-add-scenepage',
  templateUrl: './add-scenepage.page.html',
  styleUrls: ['./add-scenepage.page.scss'],
})
export class AddScenepagePage implements OnInit {
  deviceIdSelected: {
    deviceId: string;
    deviceToggleStateScene: boolean;
    toggleDuringScene: boolean;
    toggleAfterScene: boolean;
  };
  sceneClickedId: string;
  operation: string;
  sceneClickedStatus:boolean;
  sceneChannelsSelected: [];
  SceneDeviceSState = [];
  sceneDevicesSelected = [];
  devicesRepeated = [];
  sceneId: string;
  sceneName: string;
  channelsFirebase: any[] = [];
  deviceIdFirebase: any[] = [];
  deviceStateFirebase: any[] = [];
  channelsArr: any[] = [];
  channels: {
    channelName: string;
    channelId: string;
    devices: any[];
  };
  devicesObj: {
    deviceId: string;
    deviceName: string;
    plug: string;
    deviceIcon: string;
    showState: boolean;
    showToggleDuring: boolean;
    showToggleAfter: boolean;
  };
  submitted: boolean = false;
  deviceARR = [];
  plug = [];
  userId: string = '';
  devicesInfo = [];
  devicesInfoId = [];
  deviceId = [];
  deviceName;
  deviceNames = [];
  channelsArray: any;
  channelsArrayUpdated = [];
  channelsObj: {
    channelId: string,
    channelName: string
  };

  displayChannelName = [];
  displayChannelId = [];
  sceneClickedName = [];
  scenesData: any;
  sceneSelectedId = [];
  perpopulatedDevices = [];
  count: any;
  channelDevicesConected = [];
  totalChannels = [];
  sceneChannelsObj: {
    channelId: string;
    channelName: string;
  };
  channelName = [];
  channelId = [];
  channelIdSelected = [];
  dev: {
    channelName: string;
  };
  reactiveForm: FormGroup;
  slectedChannelId = [];
  flagRepeatedDevice = 0;
  x = 0;
  // flag:number;
  repeatAlertMessage = ` devices are part of other scenes and can be used only two times . So kindly to make this scene, Deselect the listed devices from this scene or remove them from any other scenes`
  editSceneFields = [];
  editFieldsObj: {
    sceneStartTime: string,
    sceneEndTime: string,
    weekDays: string
  }
  scenesBitsUpdated
  scenesUpdatedCount: any;
  devicePlug = []
  deviceMacId = []
  scenesScheduleBits = []
  mqttString: string;
  splittedStartTime = [];
  splittedEndTime = [];
  finalMqttString: string;
  sceneBitSetObj: { sceneId: any; bitSet: string; };
  message: any;
  subscription: Subscription;
  subscription1: any;
  flag: number;
  duringSceneText: string
  afterSceneText: string
  initialDuring = false
  initialAfter = false
  modelData: any;
  userSelectedMinutes: any;
  userSelectedIcon = 'glass-cheers';
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toaster: ToastController,
    private _mqttService: MqttService,
    private loadingCtrl: LoadingController,
  ) {
    this.reactiveForm = this.formBuilder.group({
      channelIdSelected: new FormControl(null, [Validators.required]),
      sceneName: new FormControl(null, [Validators.required]),

    });
    var navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state != undefined) {
      var state = navigation.extras.state as { sceneClickedId: string, operation: string };
      this.sceneClickedId = state.sceneClickedId;
      this.operation = state.operation;
    }
  }
  get f() {
    return this.reactiveForm.controls;
  }
  title = 'Manage Scene';
  ngOnInit() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
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
                this.channelsObj = {
                  channelId: element.channelId,
                  channelName: this.channelName[index]
                };
                this.channelsArrayUpdated.push(this.channelsObj)
              });
          });
        });

      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('scenes')
        .doc(this.sceneClickedId)
        .get()
        .subscribe((snapshot) => {
          this.scenesData = snapshot.data();
          if (this.scenesData != undefined) {
            this.sceneName = this.scenesData.sceneName;
            this.sceneChannelsSelected = this.scenesData.sceneChannels;
            this.scenesData.sceneDevices.forEach((element) => {
              this.sceneDevicesSelected.push(element);
            })
            this.SceneDeviceSState = this.scenesData.scenesDevicesState;
            this.perpopulatedDevices = this.SceneDeviceSState
            this.channelIdSelected = this.sceneChannelsSelected;
            this.userSelectedIcon = this.scenesData.sceneIcon
            this.editSceneFields[0] = this.scenesData.editSceneFields.sceneStartTime
            this.editSceneFields[1] = this.scenesData.editSceneFields.sceneEndTime
            this.editSceneFields[2] = this.scenesData.editSceneFields.weekDays
            console.log(this.editSceneFields)
            console.log(this.scenesData)
          }
        })

    });

  }
  valFunc() {
    if (this.channelIdSelected) {
      if (this.channelIdSelected.length != 0) {
        this.displayChannelId = [];
        this.displayChannelName = [];
        for (let index = 0; index < this.channelIdSelected.length; index++) {
          this.displayChannelId.push(this.channelIdSelected[index]);
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('channels')
            .doc(this.channelIdSelected[index])
            .get()
            .subscribe((valuee) => {
              this.channelsObj = {
                channelId: this.displayChannelId[index],
                channelName: valuee.get('channelName')
              };
              this.displayChannelName.push(this.channelsObj);
              this.channelsArr = [];
              let value;
              for (let a = 0; a < this.displayChannelName.length; a++) {
                if (this.displayChannelName[a].channelId === this.displayChannelId[index]) {
                  value = this.displayChannelName[a].channelName;
                }
              }
              let id = this.displayChannelId[index];
              this.afauth.authState.subscribe((user) => {
                if (user) {
                  this.userId = user.uid;
                }

                ///




                ///
                this.afs
                  .collection('user')
                  .doc(this.userId)
                  .collection('devices', (ref) => ref.where('channelId', '==', id))
                  .get()
                  .subscribe((snapshot) => {
                    snapshot.docs.forEach((doc, index) => {
                      this.devicesInfo[index] = doc.data();
                    });
                    this.deviceARR = [];
                    if (this.devicesInfo.length > 0) {
                      for (
                        let index = 0;
                        index < this.devicesInfo.length;
                        index++
                      ) {
                        let deviceName = this.devicesInfo[index].deviceName;
                        let dId = this.devicesInfo[index].deviceId;
                        let pl = this.devicesInfo[index].plugNumber;
                        let deciceIcon = this.devicesInfo[index].deviceIcon;
                        let flag = 0;
                        if (this.perpopulatedDevices.length) {
                          for (let k = 0; k < this.perpopulatedDevices.length; k++) {
                            if (dId === this.perpopulatedDevices[k].deviceId) {
                              flag++;
                              this.devicesObj = {
                                deviceId: dId,
                                deviceName: deviceName,
                                plug: pl,
                                deviceIcon: deciceIcon,
                                showState: this.perpopulatedDevices[k].deviceToggleStateScene,
                                showToggleDuring: this.perpopulatedDevices[k].toggleDuringScene,
                                showToggleAfter: this.perpopulatedDevices[k].toggleAfterScene,
                              };
                              this.deviceARR.push(this.devicesObj);
                            }
                          }
                          if (flag === 0) {
                            this.devicesObj = {
                              deviceId: dId,
                              deviceName: deviceName,
                              plug: pl,
                              deviceIcon: deciceIcon,
                              showState: false,
                              showToggleDuring: false,
                              showToggleAfter: false,
                            };
                            this.deviceARR.push(this.devicesObj);
                          }
                        } else {
                          this.devicesObj = {
                            deviceId: dId,
                            deviceName: deviceName,
                            plug: pl,
                            deviceIcon: deciceIcon,
                            showState: false,
                            showToggleDuring: false,
                            showToggleAfter: false,
                          };
                          this.deviceARR.push(this.devicesObj);
                        }
                      }
                    }
                    this.devicesInfo = [];
                    this.channels = {
                      channelName: value,
                      channelId: id,
                      devices: this.deviceARR,
                    };
                    this.channelsArr.push(this.channels);
                  });
              });
            })
        }
      } else {
        this.channelsArr = [];
      }
    }
  }

  ionViewWillEnter() {

   
    this.valFunc();
  }
  backBtnTo() {
    this.router.navigate(['view-all-scenes']);
  }
  primaryBtnText = 'Save';
  show(deviceID, chanlIDSelected) {
    this.channelsArr.forEach((element, index) => {
      if (element.channelId === chanlIDSelected) {
        element.devices.forEach((element1) => {
          if (deviceID === element1.deviceId) {
            element1.showState = !element1.showState;
            if (element1.showState === false) {
              element1.showToggleDuring = false;
              element1.showToggleAfter = false;
            }
          }
        });
      }
    });
  }
  showDuring(deviceID, chanlIDSelected) {
    console.log(this.initialDuring, this.initialAfter)

    this.channelsArr.forEach((element, index) => {
      if (element.channelId === chanlIDSelected) {
        element.devices.forEach((element1) => {
          if (deviceID === element1.deviceId && element1.showState === true) {
            element1.showToggleDuring = !element1.showToggleDuring;
            element1.showToggleAfter = !element1.showToggleDuring
            // if(this.initialDuring===false){
            //   this.initialDuring=!this.initialDuring
            //   this.duringSceneText='Off'
            // }
            // else{
            //   this.initialDuring=!this.initialDuring
            //   this.duringSceneText='On'
            // }
          }
        });
      }
    });
  }
  showAfter(deviceID, chanlIDSelected) {
    this.channelsArr.forEach((element, index) => {
      if (element.channelId === chanlIDSelected) {
        element.devices.forEach((element1) => {
          if (deviceID === element1.deviceId && element1.showState === true) {
            element1.showToggleAfter = !element1.showToggleAfter;
            element1.showToggleDuring = !element1.showToggleAfter

          }
        });
      }
    });
  }
  async save() {
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    this.channelsFirebase = [];
    this.deviceIdFirebase = [];
    this.deviceStateFirebase = [];
    this.channelsArr.forEach((element) => {
      this.channelsFirebase.push(element.channelId);
    });
    // this.channelsArr.forEach((element) => {
    //   element.devices.forEach((element1) => {
    //     this.deviceIdFirebase.push(element1.deviceId);
    //   });
    // });
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    }
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('scenes')
        .doc(this.sceneClickedId).delete();

      this.sceneId = this.sceneName + Date.now();
      this.channelsArr.forEach((element, index) => {
        element.devices.forEach((element1) => {
          if (element1.showState === true) {
            this.deviceIdFirebase.push(element1.deviceId);
          }
          this.deviceIdSelected = {
            deviceId: element1.deviceId,
            deviceToggleStateScene: element1.showState,
            toggleDuringScene: element1.showToggleDuring,
            toggleAfterScene: element1.showToggleAfter,
          };
          this.deviceStateFirebase.push(this.deviceIdSelected);
        });
      });
      console.log(this.deviceIdFirebase)

      if (this.operation === "edit") {
        this.devicesRepeated = []
        for (let i = 0; i < this.deviceIdFirebase.length; i++) {
          this.afs.collection('user')
            .doc(this.userId)
            .collection('scenes')
            .get()
            .subscribe((value) => {
              if (this.x < this.deviceIdFirebase.length) {
                this.flagRepeatedDevice=0;
                value.docs.forEach((doc, index) => {
                  doc.data().sceneDevices.forEach(element1 => {
                    if (element1 == this.deviceIdFirebase[i]) {
                      this.channelsArr.forEach((e1) => {
                        e1.devices.forEach((e2) => {
                          if (this.deviceIdFirebase[i] == e2.deviceId) {
                            this.devicesRepeated.forEach((element3, index) => {
                              if (element3 == e2.deviceName) {
                                this.devicesRepeated.splice(index, 1);
                              }
                            })
                            this.devicesRepeated.push(e2.deviceName);
                          }
                        })
                      })
                      this.flagRepeatedDevice += 1
                    }
                  })
                })
                this.deviceNames = [];
                this.devicesRepeated.forEach(ee => {
                  this.deviceNames.push(ee);
                })
                if (this.flagRepeatedDevice >= 2) {
                  this.flagRepeatedDevice = 0;
                  this.repeatAlertMessage = this.deviceNames + " " + this.repeatAlertMessage;
                  this.toast(this.repeatAlertMessage, 'danger')
                  this.repeatAlertMessage = ` devices are part of other scenes and can be used only two times . So kindly to make this scene, Deselect the listed devices from this scene or remove them from any other scenes`
                  this.x = this.deviceIdFirebase.length + 1;
                }
                else {
                  console.log(this.sceneDevicesSelected)
                  this.sceneDevicesSelected.forEach(element => {
                    this.afs
                      .collection('user')
                      .doc(this.userId)
                      .collection('devices')
                      .doc(element)
                      .get()
                      .subscribe((snapshot) => {
                        this.scenesBitsUpdated = snapshot.data().scenesScheduleBits;
                        this.scenesUpdatedCount = snapshot.data().sceneDevicesCount;
                        console.log(this.scenesBitsUpdated)
                        this.scenesBitsUpdated.forEach((element1, index) => {
                          console.log(element1)
                          if (element1.sceneId === this.sceneClickedId) {
                            this.scenesBitsUpdated.splice(index, 1);
                            this.scenesUpdatedCount = this.scenesUpdatedCount - 1;
                          }
                          console.log(this.scenesBitsUpdated)
                        });
                        this.afs.collection('user')
                          .doc(this.userId)
                          .collection('devices')
                          .doc(element)
                          .update({
                            sceneDevicesCount: this.scenesUpdatedCount,
                            scenesScheduleBits: this.scenesBitsUpdated,
                          })
                      })

                  })
                  // mqtt starts here
                  let useDeviceInScene = []
                  let tempObj;
                  this.deviceStateFirebase.forEach((data) => {
                    // let tempArray = []
                    let useDeviceInSceneObj = {
                      deviceId: '',
                      deviceToggleStateScene: '',
                      toggleDuringScene: '',
                      toggleAfterScene: ''
                    }
                    if (data.deviceToggleStateScene == true && data.toggleDuringScene == true) {
                      useDeviceInSceneObj.deviceId = data.deviceId;
                      useDeviceInSceneObj.deviceToggleStateScene = data.deviceToggleStateScene,
                        useDeviceInSceneObj.toggleDuringScene = data.toggleDuringScene
                      useDeviceInSceneObj.toggleAfterScene = data.toggleAfterScene
                      useDeviceInScene.push(useDeviceInSceneObj)

                      // tempObj = { useDeviceInSceneObj }
                    }
                    else if (data.deviceToggleStateScene == true && data.toggleAfterScene == true) {
                      useDeviceInSceneObj.deviceId = data.deviceId;
                      useDeviceInSceneObj.deviceToggleStateScene = data.deviceToggleStateScene,
                        useDeviceInSceneObj.toggleDuringScene = data.toggleDuringScene
                      useDeviceInSceneObj.toggleAfterScene = data.toggleAfterScene
                      useDeviceInScene.push(useDeviceInSceneObj)
                    }

                  })
                  console.log(useDeviceInScene)
                  let repeat;
                  useDeviceInScene.forEach((data, i) => {
                    console.log(data)
                    let deviceDuringScene;
                    if (data.toggleDuringScene == true) {
                      deviceDuringScene = "1"
                    } else {
                      deviceDuringScene = "0"
                    }
                    let deviceAfterScene;
                    if (data.toggleAfterScene == true) {
                      deviceAfterScene = "1"
                    } else {
                      deviceAfterScene = "0"
                    }
                    // console.log(this.arr)
                    let days = this.editSceneFields[2]
                    days = days.split("")
                    console.log(days)
                    if (days.some(val => val == "1")) {
                      repeat = "R"
                      // console.log(repeat)
                    }
                    else {
                      repeat = "N"
                      // console.log(repeat)

                    }


                    console.log(data.deviceId)
                    this.afs
                      .collection('user')
                      .doc(this.userId)
                      .collection('devices', (ref) => ref.where('deviceId', '==', data.deviceId))
                      .get()
                      .subscribe((snapshot) => {
                        snapshot.docs.forEach((doc, index) => {
                          this.devicePlug[index] = doc.data().plugNumber;
                          this.deviceMacId[index] = doc.data().macId;
                          this.deviceId[index] = doc.data().deviceId
                          this.count = doc.data().sceneDevicesCount;
                          this.scenesScheduleBits = doc.data().scenesScheduleBits;
                          console.log(this.devicePlug)
                          console.log(this.deviceMacId)
                          console.log(this.count)
                          console.log(this.scenesScheduleBits)
                        })
                        this.splittedStartTime = this.editSceneFields[0].split("")
                        this.splittedEndTime = this.editSceneFields[1].split("")
                        console.log(this.splittedStartTime, this.splittedEndTime)
                        console.log(deviceAfterScene, deviceDuringScene)
                        if (deviceAfterScene == 1 && deviceDuringScene == 0) {
                          this.mqttString = this.devicePlug + "C" + deviceAfterScene + repeat + this.splittedEndTime[0]
                            + this.splittedEndTime[1] + this.splittedEndTime[2] + this.splittedEndTime[3] + days[0] + days[1] + days[2]
                            + days[3] + days[4] + days[5] + days[6] + "X" + this.devicePlug + "C" + deviceDuringScene + repeat + this.splittedStartTime[0]
                            + this.splittedStartTime[1] + this.splittedStartTime[2] + this.splittedStartTime[3] + days[0] + days[1] + days[2]
                            + days[3] + days[4] + days[5] + days[6] + "X";
                        } else if (deviceAfterScene == 0 && deviceDuringScene == 1) {

                          this.mqttString = this.devicePlug + "C" + deviceDuringScene + repeat + this.splittedStartTime[0]
                            + this.splittedStartTime[1] + this.splittedStartTime[2] + this.splittedStartTime[3] + days[0] + days[1] + days[2]
                            + days[3] + days[4] + days[5] + days[6] + "X"
                            + this.devicePlug + "C" + deviceAfterScene + repeat + this.splittedEndTime[0]
                            + this.splittedEndTime[1] + this.splittedEndTime[2] + this.splittedEndTime[3] + days[0] + days[1] + days[2]
                            + days[3] + days[4] + days[5] + days[6] + "X";
                        }
                        if (this.count < 2) {
                          let zString = "ZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZX"
                          if (this.scenesScheduleBits.length == 0) {

                            this.finalMqttString = this.mqttString + zString + zString
                            console.log(this.mqttString)

                          } else if (this.scenesScheduleBits.length == 1) {
                            this.scenesScheduleBits.forEach((data, i) => {
                              this.finalMqttString = data['bitSet'] + this.mqttString + zString
                              console.log(this.finalMqttString)

                            })
                          }
                        }
                        this.sceneBitSetObj = {
                          sceneId: this.sceneClickedId,
                          bitSet: this.mqttString
                        }
                        if (this.editSceneFields[0] == "" || this.editSceneFields[1] == "" || this.editSceneFields[2] == "") {
                          this.flag = 0
                        }
                        else {
                          this.flag = 1;
                        }
                        if (this.count == 0 && this.flag === 1) {

                          this.afs.collection('user')
                            .doc(this.userId)
                            .collection('devices')
                            .doc(data.deviceId)
                            .update({
                              sceneDevicesCount: this.count + 1,
                              scenesScheduleBits: firebase.firestore.FieldValue.arrayUnion(this.sceneBitSetObj),
                            })
                          console.log(this.sceneBitSetObj)
                          // sending Mqtt hit ////////////////////////////////////////////////////////////////
                          let tempPublishObservable = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/GetStatus", "")
                          tempPublishObservable.subscribe((data) => { console.log(data) },
                            (err) => { console.log(err) })


                          this.subscription = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                            console.log(message)
                            this.message = message.payload.toString();
                            console.log(this.message)

                          })

                          this.subscription1 = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/' + "Plug" + this.devicePlug).subscribe((message: IMqttMessage) => {
                            this.message = message.payload.toString();
                            console.log("Message: ", this.message)
                          });

                          let tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/" + "Plug" + this.devicePlug, this.finalMqttString)
                          tempPublishPlug1Off.subscribe((data) => { console.log(data) },
                            (err) => { console.log(err) })

                          // End of Mqtt hit //////////////////////////////////////////////////////////////////////////
                        }
                        this.scenesScheduleBits.forEach((value) => {

                          if (this.count > 0 && this.count < 2 && value.sceneId !== this.sceneClickedId) {
                            this.afs.collection('user')
                              .doc(this.userId)
                              .collection('devices')
                              .doc(data.deviceId)
                              .update({
                                sceneDevicesCount: this.count + 1,
                                scenesScheduleBits: firebase.firestore.FieldValue.arrayUnion(this.sceneBitSetObj)
                              })
                            console.log(this.sceneBitSetObj)

                            // sending Mqtt hit ////////////////////////////////////////////////////////////////
                            let tempPublishObservable = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/GetStatus", "")
                            tempPublishObservable.subscribe((data) => { console.log(data) },
                              (err) => { console.log(err) })


                            this.subscription = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                              console.log(message)
                              this.message = message.payload.toString();
                              console.log(this.message)

                            })

                            this.subscription1 = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/' + "Plug" + this.devicePlug).subscribe((message: IMqttMessage) => {
                              this.message = message.payload.toString();
                              console.log("Message: ", this.message)
                            });

                            let tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/" + "Plug" + this.devicePlug, this.finalMqttString)
                            tempPublishPlug1Off.subscribe((data) => { console.log(data) },
                              (err) => { console.log(err) })

                            // End of Mqtt hit //////////////////////////////////////////////////////////////////////////

                          }

                        })
                      })
                  })
                  this.editFieldsObj = {
                    sceneStartTime: this.editSceneFields[0],
                    sceneEndTime: this.editSceneFields[1],
                    weekDays: this.editSceneFields[2]
                  }
                  loading.present();
                  this.afs
                    .collection('user')
                    .doc(this.userId)
                    .collection('scenes')
                    .doc(this.sceneClickedId)
                    .set({
                      editSceneFields: this.editFieldsObj,
                      sceneId: this.sceneClickedId,
                      sceneIcon: this.userSelectedIcon,
                      sceneName: this.sceneName,
                      sceneState: 'not-set',
                      sceneChannels: this.channelsFirebase,
                      sceneDevices: this.deviceIdFirebase,
                      scenesDevicesState: this.deviceStateFirebase,
                    }).then(async () => {
                      loading.dismiss();
                      this.toast('Scene Updated', 'success');
                      this.router.navigate(['home']);
                    }).catch(async error => {
                      loading.dismiss();
                      this.toast('error..!!', 'danger')
                    })
                }
              }
            })
          this.x = 0;
        }
      }
      else {
        this.devicesRepeated = []
        for (let i = 0; i < this.deviceIdFirebase.length; i++) {
          this.afs.collection('user')
            .doc(this.userId)
            .collection('scenes')
            .get()
            .subscribe((value) => {
              if (this.x < this.deviceIdFirebase.length) {
                console.log(this.deviceIdFirebase[i])
                this.flagRepeatedDevice=0;
                value.docs.forEach((doc, index) => {
                  console.log(doc.data().sceneDevices)
                  doc.data().sceneDevices.forEach(element1 => {
                    if (element1 == this.deviceIdFirebase[i]) {
                      this.channelsArr.forEach((e1) => {
                        e1.devices.forEach((e2) => {
                          if (this.deviceIdFirebase[i] == e2.deviceId) {
                            this.devicesRepeated.forEach((element3, index) => {
                              if (element3 == e2.deviceName) {
                                this.devicesRepeated.splice(index, 1);
                              }
                            })
                            this.devicesRepeated.push(e2.deviceName);
                          }
                        })
                      })
                      this.flagRepeatedDevice += 1
                    }
                  })
                })
                this.deviceNames = [];
                this.devicesRepeated.forEach(ee => {
                  this.deviceNames.push(ee);
                })
                if (this.flagRepeatedDevice >= 2) {
                  this.flagRepeatedDevice = 0;
                  this.repeatAlertMessage = this.deviceNames + " " + this.repeatAlertMessage;
                  this.toast(this.repeatAlertMessage, 'danger')
                  this.repeatAlertMessage = ` devices are part of other scenes and can be used only two times . So kindly to make this scene, Deselect the listed devices from this scene or remove them from any other scenes`
                  this.x = this.deviceIdFirebase.length + 1;
                }
                else {
                  loading.present();
                  this.editFieldsObj = {
                    sceneStartTime: "",
                    sceneEndTime: "",
                    weekDays: ""
                  }
                  this.afs
                    .collection('user')
                    .doc(this.userId)
                    .collection('scenes')
                    .doc(this.sceneId)
                    .set({
                      sceneClickedStatus:false,
                      manualSceneStatus: 'off',
                      editSceneFields: this.editFieldsObj,
                      sceneId: this.sceneId,
                      sceneIcon: this.userSelectedIcon,
                      sceneName: this.sceneName,
                      sceneState: 'not-set',
                      sceneChannels: this.channelsFirebase,
                      sceneDevices: this.deviceIdFirebase,
                      scenesDevicesState: this.deviceStateFirebase,
                    }).then(async () => {
                      loading.dismiss();
                      this.toast('Scene Created', 'success');
                      this.router.navigate(['home']);
                    }).catch(async error => {
                      loading.dismiss();
                      this.toast('error..!!', 'danger')
                    })
                }
              }
            })
          this.x = 0;
        }


      }
    });




  }

  async opendeviceModal() {

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
  // doRefresh(event) {
  //   console.log('Begin async operation');

  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     window.location.reload();
  //   }, 3000);
  // }
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
