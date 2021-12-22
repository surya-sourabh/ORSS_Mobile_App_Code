import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-view-all-scenes',
  templateUrl: './view-all-scenes.page.html',
  styleUrls: ['./view-all-scenes.page.scss'],
})
export class ViewAllScenesPage implements OnInit {
  manualSceneStatus = [];
  devicesInScenes = [];
  scheduleBits = [];
  dMacId = [];
  plug = [];
  string: any;
  mqttString: string;
  subscription1: Subscription;
  message: any;
  tempPublishPlug1Off: any;
  subscription: Subscription;
  subscription2: Subscription;
  scenesDatas = [];
  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private _mqttService: MqttService
  ) { }

  ngOnInit() {
  }
  count: any;
  scenesData: any[] = [];
  sceneData: any;
  scenesBitsUpdated: any;
  scenesUpdatedCount: any;
  userId: string = '';
  titlebarLTiText = 'Good Morning!';
  titlebarRTiText = 'Total Scenes';
  titlebarLSubTiText = 'Nitin';
  titlebarRSubTiText: any;
  viewLText = 'My Scenes';
  viewRText = 'Add More Scenes';
  viewLIcon = 'cogs';
  viewRIcon = 'plus';
  powerState = ['power-on', 'power-off', 'power-default'];
  deviceIcons = [];
  sceneName = [];
  sceneId = [];
  deviceIconsType = 'fas';
  totalChannels = [];
  channelDevicesConected = [];
  scenesDevices = [];
  listOfDevices: boolean = false;
  noDevices: boolean = false;
  navigateLink = 'add-scenepage';
  showRightButton = true;
  title = 'My Scenes';
  titleIcon = true;
  iconName = 'cogs';
  backBtnTo() {
    this.router.navigate(['home']);
  }

  async buttonClickE(sceneIdSelected) {
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'action-sheets-style',
      buttons: [
        {
          text: 'Schedule the scene',
          handler: () => {
            console.log('Schedule clicked');
            console.log(sceneIdSelected)
            let task = "schedule";
            var navigationExtras: NavigationExtras = {
              state: { sceneClickedId: sceneIdSelected, operation: task },
            };
            this.auth.setMessage2(sceneIdSelected)
            this.router.navigate(['schedule-the-scene'], navigationExtras);
          },
        },
        {
          text: 'Configure/Edit the scene',
          handler: () => {
            let task = "edit";
            var navigationExtras: NavigationExtras = {
              state: { sceneClickedId: sceneIdSelected, operation: task },
            };
            this.router.navigate(['add-scenepage'], navigationExtras);
            console.log(navigationExtras)
            console.log('Manage clicked');
          },
        },
        {
          text: 'Delete Scene',

          handler: () => {
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('scenes')
              .doc(sceneIdSelected)
              .get()
              .subscribe((snapshot) => {
                this.sceneData = snapshot.data();
                if (this.sceneData != undefined) {
                  this.sceneData.sceneDevices.forEach((element) => {
                    this.scenesDevices.push(element);
                  })
                  console.log(this.scenesDevices)
                  this.scenesDevices.forEach(element => {
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
                          if (element1.sceneId === sceneIdSelected) {
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
                }
              })
            console.log(this.scenesDevices)
            loading.present();
            this.afauth.authState.subscribe((user) => {
              if (user) {
                this.userId = user.uid;
              }
              this.afs
                .collection('user')
                .doc(this.userId)
                .collection('scenes')
                .doc(sceneIdSelected)
                .delete().then(async () => {
                  loading.dismiss();
                  this.toast('Scene Deleted', 'danger');

                }).catch(async error => {
                  loading.dismiss();
                  this.toast('error..!!', 'danger')
                })
              this.scenesData = [];
              this.sceneName = [];
              this.sceneId = [];
              this.channelDevicesConected = [];
              this.scenesDevices = [];
              this.afs
                .collection('user')
                .doc(this.userId)
                .collection('scenes')
                .get()
                .subscribe((snapshot) => {
                  snapshot.docs.forEach((doc, index) => {
                    this.scenesData[index] = doc.data();
                    console.log(this.scenesData)
                  });
                  console.log(this.scenesData.length)
                  this.sceneName = [];
                  if (this.scenesData.length > 0) {
                    this.titlebarRSubTiText = this.scenesData.length;
                    this.listOfDevices = true;
                    this.noDevices = false;
                    for (let index = 0; index < this.scenesData.length; index++) {
                      this.sceneName[index] = this.scenesData[index].sceneName
                      this.sceneId[index] = this.scenesData[index].sceneId
                      this.channelDevicesConected[index] = this.scenesData[index].scenesDevicesState
                    }
                    for (let j = 0; j < this.channelDevicesConected.length; j++) {
                      this.count = 0;
                      this.channelDevicesConected[j].forEach((element) => {
                        if (element.deviceToggleStateScene === true)
                          this.count++;
                      })
                      this.totalChannels.push(this.count);
                    }
                  }
                  else {
                    this.noDevices = true;
                    this.router.navigate(['home']);
                    this.listOfDevices = false;
                  }

                });
            });
            console.log('Delete clicked');
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
  // countFunc(){

  // }
  ionViewWillEnter() {

    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('scenes')
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.scenesData[index] = doc.data();
            console.log(this.scenesData)
          });
          // console.log(this.scenesData.length)
          this.sceneName = [];
          if (this.scenesData.length > 0) {
            this.titlebarRSubTiText = this.scenesData.length;
            this.listOfDevices = true;
            this.noDevices = false;
            for (let index = 0; index < this.scenesData.length; index++) {
              this.sceneName[index] = this.scenesData[index].sceneName
              this.sceneId[index] = this.scenesData[index].sceneId
              this.deviceIcons[index]= this.scenesData[index].sceneIcon
              this.channelDevicesConected[index] = this.scenesData[index].scenesDevicesState
              this.manualSceneStatus[index] = this.scenesData[index].manualSceneStatus
            }
            for (let j = 0; j < this.channelDevicesConected.length; j++) {
              this.count = 0;
              this.channelDevicesConected[j].forEach((element) => {
                if (element.deviceToggleStateScene === true)
                  this.count++;
              })
              this.totalChannels.push(this.count);
            }
          }
          else {
            this.noDevices = true;
            this.listOfDevices = false;
          }

        });

    });

  }

  async sceneBtnClick(sceneId) {
    let zString = "ZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZX"
    console.log(sceneId)
    let manualSceneStatus
    this.afs
      .collection('user')
      .doc(this.userId)
      .collection('scenes')
      .doc(sceneId)
      .get()
      .subscribe(value => {
        manualSceneStatus = value.get('manualSceneStatus')

        if (manualSceneStatus == 'off') {
          console.log("Turn on")
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('scenes')
            .doc(sceneId)
            .update({
              manualSceneStatus: 'activate',
              sceneClickedStatus:true
            }).then(() => {


              // console.log(this.scenesData.length)
              this.toast('Scene Turned On', 'success')
              this.afs.collection('user')
                .doc(this.userId)
                .collection('scenes')
                .doc(sceneId)
                .get()
                .subscribe(value => {
                  this.devicesInScenes = value.get('sceneDevices')
                  console.log(this.devicesInScenes)
                  this.devicesInScenes.forEach(element => {
                    console.log(element)
                    this.afs.collection('user')
                      .doc(this.userId)
                      .collection('devices')
                      .doc(element)
                      .get()
                      .subscribe(value => {
                        this.scheduleBits = value.get('scenesScheduleBits')
                        this.dMacId = value.get('macId')
                        this.plug = value.get('plugNumber')
                        // console.log(this.scheduleBits)
                        // console.log(this.dMacId)
                        this.scheduleBits.forEach(data => {
                          if (data.sceneId == sceneId) {
                            this.string = data.bitSet
                            // console.log(this.string)
                            // scheduleString.push(data.bitSet)
                            console.log(this.string)
                            this.mqttString = this.string + zString + zString
                            console.log(this.mqttString)

                            //MQTT starts here
                            // let tempPublishObservable = this._mqttService.publish("apsis/migro/" + this.dMacId + "/GetStatus", "")
                            // tempPublishObservable.subscribe((data) => { console.log(data) },
                            //   (err) => { console.log(err) })


                            // this.subscription = this._mqttService.observe('apsis/migro/' + this.dMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                            //   console.log(message)

                            // })

                            this.subscription1 = this._mqttService.observe('apsis/migro/' + this.dMacId + '/' + "Plug" + this.plug).subscribe((message: IMqttMessage) => {
                              this.message = message.payload.toString();
                              console.log("Message: ", this.message)
                            });
                            this.callAtLast()
                            this.tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + this.dMacId + "/" + "Plug" + this.plug, this.mqttString)
                            this.tempPublishPlug1Off.subscribe((data) => { console.log(data) },
                              (err) => { console.log(err) })

                            //MQTT ends here


                          }

                        })
                      })

                  });
                })

            });

        } else {
          console.log("Turn off")
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('scenes')
            .doc(sceneId)
            .update({
              manualSceneStatus: 'off',
              sceneClickedStatus:false
            }).then(() => {


              this.toast('Scene Turned Off', 'success')
              this.afs.collection('user')
                .doc(this.userId)
                .collection('scenes')
                .doc(sceneId)
                .get()
                .subscribe(value => {
                  this.devicesInScenes = value.get('sceneDevices')
                  console.log(this.devicesInScenes)
                  this.devicesInScenes.forEach(element => {
                    console.log(element)
                    this.subscription = this.afs.collection('user')
                      .doc(this.userId)
                      .collection('devices')
                      .doc(element)
                      .get()
                      .subscribe(value => {
                        this.scheduleBits = value.get('scenesScheduleBits')
                        this.dMacId = value.get('macId')
                        this.plug = value.get('plugNumber')
                        this.scheduleBits.forEach(data => {
                          if (data.sceneId == sceneId) {
                            this.string = data.bitSet
                            console.log(this.string)
                            // scheduleString.push(data.bitSet)
                            this.mqttString = zString + zString + zString
                            console.log(this.mqttString)


                            //MQTT starts here
                            // let tempPublishObservable = this._mqttService.publish("apsis/migro/" + this.dMacId + "/GetStatus", "")
                            // tempPublishObservable.subscribe((data) => { console.log(data) },
                            //   (err) => { console.log(err) })


                            // this.subscription = this._mqttService.observe('apsis/migro/' + this.dMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                            //   console.log(message)

                            // })

                            this.subscription2 = this._mqttService.observe('apsis/migro/' + this.dMacId + '/' + "Plug" + this.plug).subscribe((message: IMqttMessage) => {
                              this.message = message.payload.toString();
                              console.log("Message: ", this.message)

                            });
                            this.callAtLast()

                            let tempPublishPlug1Off2 = this._mqttService.publish("apsis/migro/" + this.dMacId + "/" + "Plug" + this.plug, this.mqttString)
                            tempPublishPlug1Off2.subscribe((data) => { console.log(data) },
                              (err) => { console.log(err) })

                            //MQTT ends here


                          }


                        })
                      })

                  });
                })
            });


        }
      })
  }

  callAtLast() {
    this.scenesData = []
    this.afs
      .collection('user')
      .doc(this.userId)
      .collection('scenes')
      .get()
      .subscribe((snapshot) => {
        snapshot.docs.forEach((doc, index) => {
          this.scenesData[index] = doc.data();
          console.log(this.scenesData)
        });
        // console.log(this.scenesData.length)
        this.sceneName = [];
        if (this.scenesData.length > 0) {
          this.titlebarRSubTiText = this.scenesData.length;
          this.listOfDevices = true;
          this.noDevices = false;
          for (let index = 0; index < this.scenesData.length; index++) {
            this.sceneName[index] = this.scenesData[index].sceneName
            this.sceneId[index] = this.scenesData[index].sceneId
            this.channelDevicesConected[index] = this.scenesData[index].scenesDevicesState
            this.manualSceneStatus[index] = this.scenesData[index].manualSceneStatus
          }
        }
      })
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
