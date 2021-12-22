import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
// import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
// import { connect } from 'mqtt'
// import { DevicesService } from '../services/device.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  currentTime: any;
  editSceneFields = [];
  startTime: any;
  endTime: any;
  alt: any;
  accessLevel: any;
  hideFromSecondaryUsers: boolean = true;
  secondaryUserPageShow: boolean = false;
  noPermission: boolean;
  showRightButton: boolean = true;
  title = "Home";
  titlebarLTiText = 'Good Morning!';
  titlebarRTiText: any;
  titlebarLSubTiText = 'Nitin';
  titlebarRSubTiText: any;
  userName = 'Nitin';
  viewLText = [
    'My Channels',
    'My Devices',
    'Members',
    'Scenes',
    'Running Devices',
  ];
  viewRText = [
    'View All ',
    'View All Channels',
    'View All Devices',
    'View All Members',
  ];
  viewLIcon = ['dice-two', 'plug', 'cogs', 'users-cog'];
  viewRIcon = ['arrow-right'];
  cName = ['Migro_CH1', 'CH1', 'CH2', 'CH4', 'CH8'];
  channelIcon = [];
  channelDeviceConnected = [];
  channelCapacity = [];
  sceneClickedStatus:boolean;
  sceneStatus:boolean;
  deviceIcon = [];
  deviceIconsType = ['fas', 'far'];
  powerState = ['power-off', 'power-on', 'power-default'];
  deviceName = [];
  deviceId = [];
  deviceState = [];
  status: boolean = false;
  channelNameDevice = []
  devices = [];
  plugBox = [false, true];
  plugNumber = [];
  navigateLink = [
    'view-all-scenes',
    'view-all-channels',
    'user-listing-screen',
    'add-users',
    'my-devices',
  ];
  userId: string = '';
  channelsArray: any[];
  channelName = [];
  channelId = [];
  membersArray = [];
  memberId = [];
  memberName = [];
  memberPhoto = [];
  countScenesDevices: any;
  scenesData: any[] = [];
  sceneName = [];
  totalScenesDevices = [];
  channelDevicesConected = [];
  listOfScenes: boolean = false;
  noScenes: boolean = false;
  sceneIcon = ['hiking', 'cloud-sun', 'cloud-moon', 'gifts', 'cloud-moon-rain'];
  active: boolean = false;
  showAddChannel: boolean;
  showAddMembers: boolean;
  lat;
  lng;
  addDeviceUi: boolean;
  listOfAllDevice: boolean;
  count = 0;
  showUsers: boolean;
  showAddDevices: boolean;
  styleButton: any;
  splittedDeviceArray = [];
  onOffState: number = 0;
  statusArray = [];
  statusObj: {
    sceneId: string,
    status: string,
    status1:boolean
  }
  sceneIdEvent
  // secondaryPageAddMembersHide: boolean = true;
  //For quick MQTT Testing
  private subscription: Subscription;
  public message: string;
  deviceLength: number;


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
  sunrise;
  sunset;
  sceneId = [];
  devicesInScenes: any;
  scheduleBits: any;
  string: any;
  dMacId: any;
  mqttString: any;
  plug: any;
  subscription2: Subscription;
  tempPublishPlug1Off: any;
  deviceOnOff: string;
  numberOfdevices =[];
  constructor(private router: Router, private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private geo: Geolocation,
    private _mqttService: MqttService,
    // private ble: BLE,
    private ngZone: NgZone,
    private platform: Platform,
    private permissions: AndroidPermissions,
  ) {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

      }
    })
    this.platform.ready().then(() => {
      this.permissions.checkPermission
        (this.permissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
          if (!result.hasPermission) {
            this.permissions.checkPermission
              (this.permissions.PERMISSION.ACCESS_COARSE_LOCATION);
          }
        }, (err) => {
          this.permissions.requestPermission
            (this.permissions.PERMISSION.ACCESS_COARSE_LOCATION);
        })
    })

    this.date();
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices')
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicesList.push(doc.data());

          })
          // console.log(this.devicesList)
          this.resultDeviceList = this.devicesList;

        })

      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .get()
        .subscribe((snapshot) => {
          // const macIdList = []
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
              this.message = message.payload.toString();
              console.log(this.message)
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
                      tempList.push({ ...device })
                    }
                  }

                })
                if (tempList.length > 0) {
                  this.resultDeviceList = (tempList)
                }
                console.log(this.resultDeviceList)
              }

            })
          });
        })
    })


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

  devicess: any[] = [];
  statusMessage: string;


  // // MQtt Scheduling Test
  // scheduleMqtt() {
  //   console.log('Clicked')
  //   let tempPublishObservable = this._mqttService.publish("apsis/migro/" + "40:F5:20:04:00:69" + "/GetStatus", "")
  //   tempPublishObservable.subscribe((data) => { console.log(data) },
  //     (err) => { console.log(err) })


  //   this.subscription = this._mqttService.observe('apsis/migro/' + "40:F5:20:04:00:69" + '/SendStatus').subscribe((message: IMqttMessage) => {
  //     console.log(message)

  //   })

  //   this.subscription1 = this._mqttService.observe('apsis/migro/' + "40:F5:20:04:00:69" + '/' + "Plug1").subscribe((message: IMqttMessage) => {
  //     this.message = message.payload.toString();
  //     console.log("Message: ", this.message)
  //   });

  //   let tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + "40:F5:20:04:00:69" + "/" + 1, "1C1R12471111111X1C0R12501111111X1C1R12551111111X1C0R12571111111XZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZX")
  //   tempPublishPlug1Off.subscribe((data) => { console.log(data) },
  //     (err) => { console.log(err) })

  // }


  // //

  date() {
    const date = new Date();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const shortMonth = date.toLocaleString('en-us', { month: 'short' });
    const shortDate = date.toLocaleString('en-us', { day: 'numeric' });
    this.titlebarRTiText = `${shortMonth} ${shortDate}`;
    this.titlebarRSubTiText = `${time}`;
   
  }


  ngOnInit() {
    console.log('Initializing HomePage');
    // PushNotifications.requestPermissions().then(result => {
    //   if (result.receive === 'granted') {
    //     // Register with Apple / Google to receive push via APNS/FCM
    //     PushNotifications.register();
    //   } else {
    //     // Show some error
    //   }
    // });
    // PushNotifications.addListener('registration', (token: Token) => {
    //   console.log('Push registration success, token: ' + token.value);
    // });

    // PushNotifications.addListener('registrationError', (error: any) => {
    //   alert('Error on registration: ' + JSON.stringify(error));
    // });

    // PushNotifications.addListener(
    //   'pushNotificationReceived',
    //   (notification: PushNotificationSchema) => {
    //     alert('Push received: ' + JSON.stringify(notification));
    //   },
    // );

    // PushNotifications.addListener(
    //   'pushNotificationActionPerformed',
    //   (notification: ActionPerformed) => {
    //     alert('Push action performed: ' + JSON.stringify(notification));
    //   },
    // );
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

      }

      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.membersArray = data.get('membersarray');
          if (this.membersArray) {
            this.membersArray.forEach((element: any, index: string | number) => {
              this.memberName[index] = element.memberName;
              this.memberId[index] = element.memberId
            });
            this.memberId.forEach((data, i) => {
              this.afs
                .collection('user')
                .doc(data)
                .get()
                .subscribe((photoData) => {
                  this.memberPhoto[i] = photoData.get('photoURL')
                  if (this.memberPhoto[i] == undefined) {
                    this.memberPhoto[i] = "/assets/images/default_avatar.png";
                  } else {
                    this.memberPhoto[i]
                  }
                })
            })
          }
          if (
            this.membersArray == undefined ||
            this.membersArray.length === 0
          ) {
            this.showAddMembers = true;
            this.showUsers = false;
          } else {
            this.showUsers = true;
            // this.showAddMembers = false;
          }

        })
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
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.channelsArray = data.get('channelsarray');
          if (
            this.channelsArray == undefined ||
            this.channelsArray.length === 0
          ) {
            this.showAddChannel = true;

            // console.log(this.channelsArray);

            if (
              this.channelsArray == undefined ||
              this.channelsArray.length === 0
            ) {
              this.showAddChannel = true;
            } else {
              this.showAddChannel = false;
              // console.log(this.showAddChannel)
            }
          } else {
            this.showAddChannel = false;
            this.channelsArray = data.get('channelsarray');
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
                    this.channelCapacity[index] = value.get('capacity');
                    this.macId[index] = value.get('macId')
                    this.channelIcon[index] = value.get('icon')
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
              }
            );
          }
        });
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices')
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devices[index] = doc.data();
            // console.log(this.devices)
          });
          if (this.devices == undefined ||
            this.devices.length === 0) {
            this.addDeviceUi = true;
          }
          else {

            this.noScenes = true

            this.listOfAllDevice = true;
            for (let index = 0; index < this.devices.length; index++) {
              this.deviceId[index] = this.devices[index].deviceId;
              this.channelNameDevice[index] = this.devices[index].channelName;
              this.plugNumber[index] = this.devices[index].plugNumber;
              this.deviceState[index] = this.devices[index].deviceState;
              this.deviceName[index] = this.devices[index].deviceName;
              this.deviceIcon[index] = this.devices[index].deviceIcon;
              this.deviceLength = this.devices.length
              this.activeState[index] = "power-default"
              this.macId[index] = this.devices[index].macId
              // console.log(this.macId[index])
              this.macIdForMqtt.push(this.macId[index])
            }
          }

          this.geo.getCurrentPosition({
            timeout: 25000,
            enableHighAccuracy: true,


          }
          ).then((res) => {
            console.log(res)
            this.lat = res.coords.latitude;
            this.lng = res.coords.longitude;
            this.alt = res.coords.altitude;
            // console.log(res)
            localStorage.setItem("lat", this.lat);
            localStorage.setItem("lng", this.lng);
            localStorage.setItem("alt", this.alt);

          }).catch((e) => {
            console.log(e);
          })

          const lat = JSON.parse(localStorage.getItem('lat'));
          const lng = JSON.parse(localStorage.getItem('lng'));

          this.sunrise = getSunrise(lat, lng);
          let string = this.sunrise.toString();
          let sunriseString = string.slice(16, 21)
          console.log("sunrise =>", sunriseString)
          localStorage.setItem('sunrise', sunriseString)

          this.sunset = getSunset(lat, lng);
          let string2 = this.sunset.toString();
          let sunsetString = string2.slice(16, 21)
          console.log("sunset =>", sunsetString)
          localStorage.setItem('sunset', sunsetString)


          // console.log(this.deviceLength)
          this.afs.collection('user').doc(this.userId).get()
            .subscribe((data) => {
              this.accessLevel = data.get('accessLevel')
              if (this.accessLevel == '1') {
                this.hideFromSecondaryUsers = false;
                if (this.devices.length > 0) {
                  this.secondaryUserPageShow = true;
                  this.noPermission = false;
                } else {
                  this.noPermission = true;
                }
              }
            })
        });

    });



    // for (let i = 0; i < this.devices.length; i++) {

    //   this.activeState[i] = "power-default"
    // }
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
          });
          this.sceneName = [];
          if (this.scenesData.length > 0) {
            // this.titlebarRSubTiText = this.scenesData.length;
            this.listOfScenes = true;
            this.noScenes = false;
            this.statusArray = [];
            for (let index = 0; index < this.scenesData.length; index++) {             
              this.editSceneFields[index] = this.scenesData[index].editSceneFields
              this.sceneName[index] = this.scenesData[index].sceneName
              this.channelDevicesConected[index] = this.scenesData[index].scenesDevicesState
              this.sceneId[index] = this.scenesData[index].sceneId
              this.statusObj = {
                sceneId: this.sceneId[index],
                status: this.scenesData[index].manualSceneStatus,
                status1:this.scenesData[index].sceneClickedStatus
              }
              this.statusArray.push(this.statusObj);
            }
            for (let j = 0; j < this.channelDevicesConected.length; j++) {
              this.countScenesDevices = 0;
              this.channelDevicesConected[j].forEach((element) => {
                if (element.deviceToggleStateScene === true)
                  this.countScenesDevices++;
              })
              this.totalScenesDevices.push(this.countScenesDevices);
            }
          }
          else {
            // this.noScenes = true;
            this.listOfScenes = false;
          }

          const date = new Date();
          const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
          const t = time.split(':');

          this.currentTime = t[0].concat(t[1]);
          this.statusArray.forEach((element, index) => {
            if (this.currentTime < this.editSceneFields[index].sceneStartTime && this.currentTime < this.editSceneFields[index].sceneEndTime &&element.status1==false)
              element.status = 'run'
            else if (this.currentTime >= this.editSceneFields[index].sceneStartTime && this.currentTime < this.editSceneFields[index].sceneEndTime &&element.status1==false) {
              element.status = 'activate'
            }
            else if (element.status1==false) {
              element.status = 'off'
            }
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('scenes')
              .doc(element.sceneId)
              .update({
                manualSceneStatus: element.status
              })
            // }
          })
        });

    });

  }

  //For quick MQTT Testing
  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  public ngOnDestroy() {
    if (this.subscription) {

      this.subscription.unsubscribe();
    }

  }
  //For quick MQTT Testing

  // start() {
  //   this.device.mqtt();
  // }

  ionViewWillEnter() {
   
  }

  addDevice() {
    this.router.navigate(['add-device-to-channel']);
  }

  addChannel() {
    this.router.navigate(['add-channel']);
  }
  addScene() {
    this.router.navigate(['add-scenepage']);
  }
  addMembers() {
    this.router.navigate(['add-new-user']);
  }
  channelLink(ch: string) {
    var navigationExtras: NavigationExtras = {
      state: { chId: ch },
    };
    localStorage.setItem('channelId', ch)
    this.router.navigate(['view-all-devices'], navigationExtras);
  }

  onOffBtn(macId,channelCapacity,channelId){
  this.numberOfdevices = [];
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
            // this.toast("Cannot On/Off since there are no Devices in this Channel, Please add devives and Try again.", 'warning')
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
            // this.toast("Successfull", "success")
          }
        })
      })
  }

  activate() {

    // this.active = !this.active;

    // let ac = this.active;
    // if (ac === true) {
    //   document.getElementById('sic').style.background = '#FF9A3E';

    //   document.getElementById('scenIcon').style.color = '#ffffff';
    //   document.getElementById('sceneboxcolor').style.background = '#484B9A';
    // } else {
    //   document.getElementById('scenIcon').style.color = '#7b7b7b';
    //   document.getElementById('sic').style.background = '#7b7b7b';
    //   document.getElementById('sceneboxcolor').style.background = '#ffff';
    // }
    // console.log(this.sceneIdEvent)
    // console.log(this.statusArray);
    let status;
    this.statusArray.forEach((element, index) => {
      if (element.sceneId == this.sceneIdEvent) {
        if (element.status == 'off')
          element.status = 'activate'
        else
          element.status = 'off'
        if (this.currentTime == this.editSceneFields[index].sceneStartTime) {
          element.status = 'activate'
        }
        if (this.currentTime == this.editSceneFields[index].sceneEndTime) {
          element.status = 'off'
        }
        // element.status = !element.status
        status = element.status
        if(element.status=='activate')
        {
          this.sceneClickedStatus=true;
        }
        else{
          this.sceneClickedStatus=false;
        }
        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('scenes')
          .doc(this.sceneIdEvent)
          .update({
            sceneClickedStatus:this.sceneClickedStatus,
            manualSceneStatus: element.status
          })
        console.log(element.status);
      }
    })
    // console.log(status)
    let scheduleString = [];
    let zString = "ZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZX"
    if (status == 'activate') {
      console.log("Its on")
      this.afs.collection('user')
        .doc(this.userId)
        .collection('scenes')
        .doc(this.sceneIdEvent)
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
                  if (data.sceneId == this.sceneIdEvent) {
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

                    this.tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + this.dMacId + "/" + "Plug" + this.plug, this.mqttString)
                    this.tempPublishPlug1Off.subscribe((data) => { console.log(data) },
                      (err) => { console.log(err) })

                    //MQTT ends here


                  }
                  // if (scheduleString.length == 0) {
                  //   console.log("no schedule data")
                  //   // this.toast('Please Schedule the scene', 'warning')
                  // } else if (scheduleString.length == 1) {
                  //   this.mqttString = scheduleString[0] + zString + zString
                  //   console.log(this.mqttString)
                  // } else if (scheduleString.length == 2) {
                  //   this.mqttString = scheduleString[0] + scheduleString[1] + zString
                  //   console.log(this.mqttString)
                  // }

                })
              })

          });
        })


    } else {
      console.log('Its off')
      console.log(this.scheduleBits)
      this.afs.collection('user')
        .doc(this.userId)
        .collection('scenes')
        .doc(this.sceneIdEvent)
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
                  if (data.sceneId == this.sceneIdEvent) {
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

                    let tempPublishPlug1Off2 = this._mqttService.publish("apsis/migro/" + this.dMacId + "/" + "Plug" + this.plug, this.mqttString)
                    tempPublishPlug1Off2.subscribe((data) => { console.log(data) },
                      (err) => { console.log(err) })

                    //MQTT ends here


                  }


                })
              })

          });
        })

    }
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      window.location.reload();
    }, 3000);
  }
}
