import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-my-devices',
  templateUrl: './my-devices.page.html',
  styleUrls: ['./my-devices.page.scss'],
})
export class MyDevicesPage implements OnInit {
  title = 'My Devices';
  titleIcon = true;
  iconName = 'plug'
  subscription1: Subscription;
  message: any;
  splittedDeviceArray: any[];
  send: any;
  macId = []
  macIdForMqtt = []
  tempMacId = []
  macIdForPublish = []
  devicesList = []
  //For quick MQTT Testing
  resultDeviceList = []
  stateMessage = ''
  macIdPlugStatusList = {}
  titlebarLTiText = 'Good Morning!';
  titlebarRTiText = 'Total Devices';
  titlebarLSubTiText = 'Nitin';
  titlebarRSubTiText: any;

  deviceIconsType = ['fas', 'far'];

  deviceIcons = ['lightbulb', 'fan', 'desktop', 'tv'];
  powerState = ['power-on', 'power-off', 'power-default'];
  userId: string = '';
  devices = [];
  deviceId = [];
  channelName = [];
  plugNumber = [];
  state = [];
  deviceName = [];
  deviceIcon = [];
  showDevices: boolean;
  hide: boolean;

  activeState = [];
  deviceLength: number;
  newObj = {
    plug: '',
    state: ''
  }
  singleDevice = [];
  tempObj;
  public value: any;
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private _mqttService: MqttService,
    private util: UtilService
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




            this.subscription1 = this._mqttService.observe('apsis/migro/' + tempMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
              // console.log(message)
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

  ngOnInit(){
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
        this.devicesList.sort(this.compare)
        this.resultDeviceList = this.devicesList;
      })
    })
  }

  compare(a, b) {
    if (a.deviceName < b.deviceName) {
      return -1;
    }
    if (a.deviceName > b.deviceName) {
      return 1;
    }
    return -1;
  }
  click(plugNumber, macId, deviceState) {
    console.log(plugNumber)
    console.log(macId)
    console.log(deviceState)
    // let value = '';
    this.subscription1 = this._mqttService.observe('apsis/migro/' + macId + '/' + plugNumber).subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
      console.log("Message: ", this.message)
    });

    deviceState = deviceState == "ON" || deviceState == '1' ? "0" : "1";
    let tempPublishPlug1Off = this._mqttService.publish("apsis/migro/" + macId + "/" + plugNumber, deviceState)
    tempPublishPlug1Off.subscribe((data) => { console.log(data) },
      (err) => { console.log(err) })


  }

  ionViewWillLeave(){
    console.log("left")
    this.resultDeviceList = []
  }

  devicesInfo = [];
 
  ionViewWillEnter() {
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
            this.devices[index] = doc.data();
          });
          if (this.devices.length > 0) {
            this.showDevices = true;
            for (let index = 0; index < this.devices.length; index++) {
              this.deviceId[index] = this.devices[index].deviceId;
              this.channelName[index] = this.devices[index].channelName;
              this.plugNumber[index] = this.devices[index].plugNumber;
              this.state[index] = this.devices[index].deviceState;
              this.deviceName[index] = this.devices[index].deviceName;
              this.deviceIcon[index] = this.devices[index].deviceIcon;
              this.titlebarRSubTiText = this.devices.length;
              this.activeState[index] = "power-default"
            }
          }
          else {
            this.hide = true;
          }
        });
    });

  }
  trackBy(index: number, item: any): number {
    return item.deviceId;
  }
  backBtnTo() {
    this.router.navigate(['home']);
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      window.location.reload();
    }, 3000);
  }
}
