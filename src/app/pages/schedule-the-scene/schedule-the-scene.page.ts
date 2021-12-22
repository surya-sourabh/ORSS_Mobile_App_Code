import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { CustomModalComponent } from 'src/app/components/custom-modal/custom-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { ListOfDevicesModalComponent } from '../../components/list-of-devices-modal/list-of-devices-modal.component';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-schedule-the-scene',
  templateUrl: './schedule-the-scene.page.html',
  styleUrls: ['./schedule-the-scene.page.scss'],
})
export class ScheduleTheScenePage implements OnInit, OnDestroy {
  sunsetData: any;
  sunriseData: any;
  type: String;
  ScheduleDayNight: any
  ScheduleBasedOn = "Time";
  title = 'Scene Schedule';
  titleIcon = true;
  iconName = 'cogs';
  sceneClickedId = '';
  operation = '';
  arr: any = [0, 0, 0, 0, 0, 0, 0];
  arr1: any = [0, 0, 0, 0, 0, 0, 0];
  finalArr: any = [];
  userId: string;
  hour: any;
  finalHour: any;
  customPickerOptions: { buttons: { text: string; handler: (time: any) => void; }[]; };
  customPickerOptions2: { buttons: { text: string; handler: (time: any) => void; }[]; };

  sh: any = "00";
  sm: any = "00";
  ampm1: any = "AM"

  sth: any = "00";
  stm: any = "00";
  ampm2: any = "PM"
  convertedSh: any = '';
  convertedSth: any = '';
  splittedHour = [];
  splittedMin = []
  splittedFHour = []
  splittedFMin = []
  eachDeviceSceneBits = [];
  finalMqttString: string;
  flag: number;
  sceneTimeInDb = [];
  zString = "ZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZX";
  modelData: any;
  styleExp = "auto"
  styleExp2 = "none";
  arr2: string[];
  scheduleType: string;
  scheduleTypeFromDb: any;
  M: boolean;
  subscription: Subscription;
  subscription1: Subscription;
  tempPublishObservable1: any;
  subscription2: Subscription;
  tempPublishPlug1Off1: any;
  subscription12: Subscription;
  tempPublishObservable2: any;
  subscription22: Subscription;
  tempPublishPlug1Off2: any;
  tempPublishObservable3: any;
  subscription3: Subscription;
  subscription33: Subscription;
  tempPublishPlug1Off3: any;
  val: boolean = false;
  val2: boolean = false;
  clickedSceneId: string;
  styleButton0: any;
  styleButton1: any;
  styleButton2: any;
  styleButton3: any;
  styleButton4: any;
  styleButton5: any;
  styleButton6: any;
  rD: any;
  rD1: any;
  styleButton00: any;
  styleButton01: any;
  styleButton02: any;
  styleButton03: any;
  styleButton04: any;
  styleButton05: any;
  styleButton06: any;
  userSelectedIcon: any;

  checkfalse(x) {
    return x === 0;
  }
  checkfalse1(x) {
    return x === 0;
  }

  // Timer Stuff Variables
  clickTime: any;
  sendTime1: number;
  time: any;
  finalMin: any;
  min: any;
  userSelectedMinutes: any = 0;
  sceneDevicesArray = [];
  mqttString: string;
  message: any;
  // End of Timer Stuff
  myDate = new Date().toISOString();
  devicePlug = []
  deviceMacId = []
  deviceId = []
  sceneBitSetObj: {
    sceneId: string,
    bitSet: string,
  }
  count: number;
  scenesScheduleBits = [];
  editFieldsObj: {
    sceneStartTime: string,
    sceneEndTime: string,
    weekDays: string
  }
  toasterMessage = 'This scene is having time conflict with another scenes. Please reschedule it with different time.';
  selectedSceneDevices = [];
  selectedSceneDevicesState = [];
  disable: boolean = false;
  timePicker: boolean = false;
  sunRiseSunset: boolean = true;
  check: boolean = true;

  checkDayNight: boolean = false;
  arr1Check: boolean = false
  arr2Check: boolean = true
  constructor(private router: Router,
    private modalController: ModalController,
    private auth: AuthService,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private _mqttService: MqttService,
    private toaster: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    //
    var navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state != undefined) {
      var state = navigation.extras.state as { sceneClickedId: string, operation: string };
      this.sceneClickedId = state.sceneClickedId;
      this.operation = state.operation;
      // console.log(this.sceneClickedId, this.operation)
    }
    // Schedule logic ion-datetime Start
    this.flag = 0;
    this.customPickerOptions = {
      buttons: [
        {
          text: 'Save',
          handler: (time) => {
            // console.log("Start", time.hour.text, time.minute.text, time.ampm.text)
            this.sh = time.hour.text
            this.sm = time.minute.text
            this.ampm1 = time.ampm.text

            if (this.ampm1 == "PM") {
              this.convertedSh = parseInt(this.sh) + parseInt("12");
              // console.log("After conversion start", this.convertedSh, this.sm)
            } else {
              this.convertedSh = this.sh
            }
          }
        },
        {
          text: 'Cancel',
          handler: e => {
            // modalCtrl.dismiss(e)
          }
        }
      ]
    }

    this.customPickerOptions2 = {
      buttons: [
        {
          text: 'Save',
          handler: (time) => {
            // console.log("Stop", time.hour.text, time.minute.text, time.ampm.text)
            this.sth = time.hour.text
            this.stm = time.minute.text
            this.ampm2 = time.ampm.text
            if (this.ampm2 == "PM") {
              this.convertedSth = parseInt(this.sth) + parseInt("12");
              // console.log("After conversion stop", this.convertedSth, this.stm)
            } else {
              this.convertedSth = this.sth
            }
            // this.convertedSth = 12
          }
        },
        {
          text: 'Cancel',
          handler: e => {
            // modalCtrl.dismiss(e)
          }
        }
      ]
    }
    // Schedule logic ion-datetime End
  }
  timeCheck() {
    this.timePicker = false
    this.sunRiseSunset = true
    this.styleExp = "auto"
    this.styleExp2 = "none"
    document.getElementById('Su1').style.color = '#7B7B7B';
    document.getElementById('Su1').style.backgroundColor = '#FFFFFF';
    document.getElementById('M1').style.color = '#7B7B7B';
    document.getElementById('M1').style.backgroundColor = '#FFFFFF';
    document.getElementById('Tu1').style.color = '#7B7B7B';
    document.getElementById('Tu1').style.backgroundColor = '#FFFFFF';
    document.getElementById('We1').style.color = '#7B7B7B';
    document.getElementById('We1').style.backgroundColor = '#FFFFFF';
    document.getElementById('Th1').style.color = '#7B7B7B';
    document.getElementById('Th1').style.backgroundColor = '#FFFFFF';
    document.getElementById('Fr1').style.color = '#7B7B7B';
    document.getElementById('Fr1').style.backgroundColor = '#FFFFFF';
    document.getElementById('Sa1').style.color = '#7B7B7B';
    document.getElementById('Sa1').style.backgroundColor = '#FFFFFF';
    document.getElementById('Rd1').style.color = '#7B7B7B';
    document.getElementById('Rd1').style.backgroundColor = '#FFFFFF';
  }

  dayNight() {
    this.styleExp = "none"
    this.styleExp2 = "auto"
    this.timePicker = true
    this.sunRiseSunset = false
    document.getElementById('Su').style.color = '#7B7B7B';
    document.getElementById('Su').style.backgroundColor = '#FFFFFF';
    document.getElementById('M').style.color = '#7B7B7B';
    document.getElementById('M').style.backgroundColor = '#FFFFFF';
    document.getElementById('Tu').style.color = '#7B7B7B';
    document.getElementById('Tu').style.backgroundColor = '#FFFFFF';
    document.getElementById('We').style.color = '#7B7B7B';
    document.getElementById('We').style.backgroundColor = '#FFFFFF';
    document.getElementById('Th').style.color = '#7B7B7B';
    document.getElementById('Th').style.backgroundColor = '#FFFFFF';
    document.getElementById('Fr').style.color = '#7B7B7B';
    document.getElementById('Fr').style.backgroundColor = '#FFFFFF';
    document.getElementById('Sa').style.color = '#7B7B7B';
    document.getElementById('Sa').style.backgroundColor = '#FFFFFF';
    document.getElementById('Rd').style.color = '#7B7B7B';
    document.getElementById('Rd').style.backgroundColor = '#FFFFFF';
  }
  backBtnTo() {
    this.router.navigate(['view-all-scenes']);
  }

  ngOnInit() {
    this.type = 'schedule';

  }
  titlebarLTiText = ''
  titlebarRTiText = 'Total Devices';
  titlebarLSubTiText = '';
  titlebarRSubTiText: any;
  sceneName = '';
  primaryBtnText = 'Save';

  devicesInScenes = '';
  ionViewWillEnter() {
    // console.log(this.sceneClickedId)
    this.clickedSceneId = this.auth.getMessage2()

    this.callAtLast()

  }

  callAtLast() {

    this.subscription = this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      // console.log(this.sceneClickedId)
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('scenes').doc(this.clickedSceneId)
        .get()
        .subscribe((snapshot) => {
          this.sceneName = snapshot.get('sceneName')
          this.devicesInScenes = snapshot.get('sceneDevices')
          this.sceneTimeInDb = snapshot.get('editSceneFields')
          if (snapshot.get('scheduleType')) {
            this.scheduleTypeFromDb = snapshot.get('scheduleType')
            console.log(this.scheduleTypeFromDb)
          }
          console.log(this.sceneTimeInDb)
          if (this.sceneTimeInDb['weekDays'] != '' || this.sceneTimeInDb['sceneStartTime'] != '' || this.sceneTimeInDb['sceneEndTime'] != '') {
            if (this.scheduleTypeFromDb == "Time") {
              this.ScheduleBasedOn = "Time"
              this.timePicker = false
              this.sunRiseSunset = true
              this.styleExp2 = "none"
              this.styleExp = "auto"



              let splittedSt = this.sceneTimeInDb['sceneStartTime'].split('')
              console.log(splittedSt)
              this.sh = splittedSt[0] + splittedSt[1]
              this.sm = splittedSt[2] + splittedSt[3]

              if (!this.sh || !this.sm || !this.sth || !this.stm) {
                this.sh = "00"
                this.sm = "00"
                this.sth = "00"
                this.stm = "00"
              }


              if (this.sh > 12) {
                this.ampm1 = "PM"
              }
              if (this.sh > 12) {
                this.sh = "0" + (this.sh - 12)
                console.log(this.sh)
              }
              if (this.sh < 10) {
                this.sh = this.sh.toString()
              }
              if (this.sm < 10) {
                this.sm = this.sm.toString()
              }



              let splittedEt = this.sceneTimeInDb['sceneEndTime'].split('')
              this.sth = splittedEt[0] + splittedEt[1]
              this.stm = splittedEt[2] + splittedEt[3]
              if (this.sth > 12) {
                this.ampm2 = "PM"
              }
              if (this.sth > 12) {
                this.sth = this.sth - 12
              }
              if (this.sth < 10) {
                this.sth = "0" + this.sth
              }
              if (this.stm < 10) {
                this.stm = this.stm
              }



              let splittedWd = this.sceneTimeInDb['weekDays'].split('')
              console.log(splittedWd)
              for (let i = 0; i < splittedWd.length; i++) {
                if (splittedWd[0] == 1) {
                  this.styleButton00 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[1] == 1) {
                  this.styleButton01 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[2] == 1) {
                  this.styleButton02 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[3] == 1) {
                  this.styleButton03 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[4] == 1) {
                  this.styleButton04 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[5] == 1) {
                  this.styleButton05 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[6] == 1) {
                  this.styleButton06 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }

              }
              const weekdaysRepeat = splittedWd.every(i => i == 1)
              if (weekdaysRepeat == true) {
                this.rD = {
                  'backgroundColor': '#787df4', 'color': '#FFFFFF'
                }
                this.val = true
                this.arr = [1, 1, 1, 1, 1, 1, 1]
              } else {
                this.rD = {
                  'backgroundColor': '#FFFFFF', 'color': '#7B7B7B'
                }
              }

              // document.getElementById('Su').style.color = '#FFFFFF';
              // document.getElementById('Su').style.backgroundColor = '#787df4';




            } else if (this.scheduleTypeFromDb == "DayNight") {
              this.ScheduleBasedOn = "DayNight"
              this.timePicker = true
              this.sunRiseSunset = false
              this.styleExp2 = "auto"
              this.styleExp = "none"

              let splittedSt = this.sceneTimeInDb['sceneStartTime'].split('')
              console.log(splittedSt)
              this.sh = splittedSt[0] + splittedSt[1]
              this.sm = splittedSt[2] + splittedSt[3]
              if (this.sh <= 12) {
                this.ScheduleDayNight = "M"
              } else {
                this.ScheduleDayNight = "N"
              }

              let splittedWd = this.sceneTimeInDb['weekDays'].split('')
              for (let i = 0; i < splittedWd.length; i++) {
                if (splittedWd[0] == 1) {
                  this.styleButton0 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[1] == 1) {
                  this.styleButton1 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[2] == 1) {
                  this.styleButton2 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[3] == 1) {
                  this.styleButton3 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[4] == 1) {
                  this.styleButton4 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[5] == 1) {
                  this.styleButton5 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }
                if (splittedWd[6] == 1) {
                  this.styleButton6 = {
                    'backgroundColor': '#787df4', 'color': '#FFFFFF'
                  }
                }

              }

              const weekdaysRepeat = splittedWd.every(i => i == 1)
              if (weekdaysRepeat == true) {
                this.rD1 = {
                  'backgroundColor': '#787df4', 'color': '#FFFFFF'
                }
                this.val = true
                this.arr = [1, 1, 1, 1, 1, 1, 1]
              } else {
                this.rD1 = {
                  'backgroundColor': '#FFFFFF', 'color': '#7B7B7B'
                }
              }
            }

          }

          if (undefined !== this.devicesInScenes && this.devicesInScenes.length) {

            this.titlebarRSubTiText = this.devicesInScenes.length
          }
        })
    })
  }
  segmentChanged(ev: any) {
    // console.log('Segment changed', ev);
  }
  fromModal: any;
  async openModal() {
    // console.log("opened");
    const modal = await this.modalController.create({
      component: CustomModalComponent,
      cssClass: 'custommodal-css',
    })

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
        this.userSelectedIcon = modelData.data
      }
    })

    return await modal.present();
  }

  // Timer logic
  addZeroForFinalMin(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    this.finalMin = s
    return s;
  }
  addZeroForMin(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    this.min = s
    return s;
  }

  addZeroForHour(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    this.hour = s
    return s;
  }

  addZeroForFinalHour(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    this.finalHour = s
    return s;
  }
  save() {
    this.userSelectedMinutes = this.auth.getMessage()
    // console.log(this.userSelectedMinutes)
    this.time = new Date()
    // console.log(this.time)
    this.hour = this.time.getHours();
    this.finalHour = this.time.getHours();
    this.min = this.time.getMinutes() + 1
    // console.log("start", this.hour, this.min);
    // let sendDate = parseInt("63")
    this.finalMin = this.min + parseInt(this.userSelectedMinutes)
    // console.log("stop", this.finalHour, this.finalMin)
    if (this.finalMin > 59) {
      this.finalMin = this.finalMin - parseInt("59")
      // console.log("after subtraction", this.min)

      this.finalHour = this.hour + 1;
      this.finalMin = this.finalMin - 1;
      // console.log("final minutes output", this.finalHour, this.finalMin)


      if (this.finalHour == "23" && this.finalMin > 59) {
        this.finalHour = parseInt("00");
        // console.log(this.finalHour)
      }

    }
    if (this.hour < 10) {
      this.addZeroForHour(this.hour, 2)
    }

    if (this.finalHour < 10) {
      this.addZeroForFinalHour(this.finalHour, 2)
    }
    if (this.min < 10) {
      this.addZeroForMin(this.min, 2)

    }
    if (this.finalMin < 10) {
      this.addZeroForFinalMin(this.finalMin, 2)
    }

    // console.log("start time", this.hour, this.min)
    // console.log("stop time", this.finalHour, this.finalMin)
    let splittedHour = this.hour.toString().split('')
    let splittedMin = this.min.toString().split('')
    let splittedFHour = this.finalHour.toString().split('')
    let splittedFMin = this.finalMin.toString().split('')

    console.log("splitted", splittedHour)
    console.log("splitted", splittedMin)
    console.log("splitted", splittedFHour)
    console.log("splitted", splittedFMin)


    let clickedSceneId = this.auth.getMessage2()
    // console.log(clickedSceneId)
    this.afs.collection('user')
      .doc(this.userId)
      .collection('scenes')
      .doc(clickedSceneId)
      .get()
      .subscribe((value) => {
        this.sceneDevicesArray = value.data().scenesDevicesState;
        // console.log(this.sceneDevicesArray)
        let deviceDuringScene = []
        let deviceAfterScene = []
        let useDeviceInScene = []
        this.sceneDevicesArray.forEach((data, i) => {
          if (data.deviceToggleStateScene == true) {

            if (data.deviceToggleStateScene == true && data.toggleDuringScene == true && data.toggleAfterScene == true) {
              deviceDuringScene[i] = "1";
              deviceAfterScene[i] = "1";
            } else if (data.deviceToggleStateScene == true && data.toggleDuringScene == false && data.toggleAfterScene == true) {
              deviceDuringScene[i] = "0";
              deviceAfterScene[i] = "1";
            } else if (data.deviceToggleStateScene == true && data.toggleDuringScene == true && data.toggleAfterScene == false) {
              deviceDuringScene[i] = "1";
              deviceAfterScene[i] = "0";
            } else if (data.deviceToggleStateScene == true && data.toggleDuringScene == false && data.toggleAfterScene == false) {
              deviceDuringScene[i] = "0";
              deviceAfterScene[i] = "0";
            }

            // console.log(deviceDuringScene)
            // console.log(deviceAfterScene)

            // let tempObj;
            // this.sceneDevicesArray.forEach((data) => {
            //   // let tempArray = []
            //   let useDeviceInSceneObj = {
            //     deviceId: '',
            //     deviceToggleStateScene: '',
            //     duringScene: '',
            //     afterScene: ''
            //   }
            //   if (data.deviceToggleStateScene == true) {
            //     useDeviceInSceneObj.deviceId = data.deviceId;
            //     useDeviceInSceneObj.deviceToggleStateScene = data.deviceToggleStateScene;
            //     useDeviceInSceneObj.duringScene = deviceDuringScene
            //     useDeviceInSceneObj.afterScene = deviceAfterScene
            //     // tempObj = { useDeviceInSceneObj }
            //   }
            //   useDeviceInScene.push(useDeviceInSceneObj)
            //   console.log(useDeviceInScene)
            // })
            // })

            let devicePlug = []
            let deviceMacId = []
            let string = []
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices', (ref) => ref.where('deviceId', '==', data.deviceId))
              .get()
              .subscribe((snapshot) => {
                snapshot.docs.forEach((doc, index) => {
                  devicePlug[index] = doc.data().plugNumber;
                  deviceMacId[index] = doc.data().macId;
                  this.count = doc.data().sceneDevicesCount;
                  this.scenesScheduleBits = doc.data().scenesScheduleBits;
                  // console.log(devicePlug)
                  // console.log(this.scenesScheduleBits)
                  // console.log(this.count)
                  // console.log(deviceDuringScene)
                  // console.log(this.scenesScheduleBits)
                  this.mqttString = devicePlug + "C" + deviceDuringScene[i] + "N" + splittedHour[0] + splittedHour[1] + splittedMin[0]
                    + splittedMin[1] + "0000000" + "X" + devicePlug + "C" + deviceAfterScene[i] + "N" + splittedFHour[0] + splittedFHour[1]
                    + splittedFMin[0] + splittedFMin[1] + "0000000" + "X";
                  let zString = "ZZZZZZZZZZZZZZZXZZZZZZZZZZZZZZZX";
                  if (this.count == 0) {

                    this.finalMqttString = zString + zString + this.mqttString
                  }
                  else if (this.count == 1) {
                    this.scenesScheduleBits.forEach((data) => {
                      this.finalMqttString = data.bitSet + zString + this.mqttString
                    })
                  }
                  else if (this.count == 2) {
                    let set1;
                    let set2;
                    let deviceSetBit = []
                    this.scenesScheduleBits.forEach((data, i) => {
                      // this.finalMqttString = data['bitSet'] + this.mqttString + zString
                      // console.log(this.finalMqttString)
                      deviceSetBit.push(data['bitSet'])

                    })
                    set1 = deviceSetBit[0]
                    set2 = deviceSetBit[1]
                    this.finalMqttString = set1 + set2 + this.mqttString
                  }

                  // sending Mqtt hit ////////////////////////////////////////////////////////////////
                  this.tempPublishObservable1 = this._mqttService.publish("apsis/migro/" + deviceMacId + "/GetStatus", "")
                  this.tempPublishObservable1.subscribe((data) => { console.log(data) },
                    (err) => { console.log(err) })


                  this.subscription1 = this._mqttService.observe('apsis/migro/' + deviceMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                    this.message = message.payload.toString();
                    console.log(this.message)
                  })

                  this.subscription12 = this._mqttService.observe('apsis/migro/' + deviceMacId + '/' + "Plug" + devicePlug).subscribe((message: IMqttMessage) => {
                    this.message = message.payload.toString();
                    console.log("Message: ", this.message)
                    if (this.message) {
                      this.toast('Timer set Successfully', 'success')
                      this.router.navigate(['view-all-scenes'])
                    } else {
                      this.toast("Error Occured, Try Again.", 'warning')
                    }
                  });

                  this.tempPublishPlug1Off1 = this._mqttService.publish("apsis/migro/" + deviceMacId + "/" + "Plug" + devicePlug, this.finalMqttString)
                  this.tempPublishPlug1Off1.subscribe((data) => { console.log(data) },
                    (err) => { console.log(err) })

                  // End of Mqtt hit //////////////////////////////////////////////////////////////////////////
                })

              })
          }

        })
      })


  }
  // Timer logic ends Here\
  click() {
    if (this.ScheduleBasedOn === 'DayNight') {
      document.getElementById('Su').style.color = '#7B7B7B';
      document.getElementById('Su').style.backgroundColor = '#FFFFFF';
      this.arr[0] = false
      this.arr[0] = 0
    }
  }
  select(str: string) {
    this.val = !this.val
    if (str == 'repeat' && this.val == true) {
      this.arr = [1, 1, 1, 1, 1, 1, 1];
      // console.log(this.arr);
      document.getElementById('Su').style.color = '#FFFFFF';
      document.getElementById('Su').style.backgroundColor = '#787df4';
      document.getElementById('M').style.color = '#FFFFFF';
      document.getElementById('M').style.backgroundColor = '#787df4';
      document.getElementById('Tu').style.color = '#FFFFFF';
      document.getElementById('Tu').style.backgroundColor = '#787df4';
      document.getElementById('We').style.color = '#FFFFFF';
      document.getElementById('We').style.backgroundColor = '#787df4';
      document.getElementById('Th').style.color = '#FFFFFF';
      document.getElementById('Th').style.backgroundColor = '#787df4';
      document.getElementById('Fr').style.color = '#FFFFFF';
      document.getElementById('Fr').style.backgroundColor = '#787df4';
      document.getElementById('Sa').style.color = '#FFFFFF';
      document.getElementById('Sa').style.backgroundColor = '#787df4';

    }
    if (str == 'repeat' && this.val == false) {
      this.arr = [0, 0, 0, 0, 0, 0, 0]
      document.getElementById('Su').style.color = '#7B7B7B';
      document.getElementById('Su').style.backgroundColor = '#FFFFFF';
      document.getElementById('M').style.color = '#7B7B7B';
      document.getElementById('M').style.backgroundColor = '#FFFFFF';
      document.getElementById('Tu').style.color = '#7B7B7B';
      document.getElementById('Tu').style.backgroundColor = '#FFFFFF';
      document.getElementById('We').style.color = '#7B7B7B';
      document.getElementById('We').style.backgroundColor = '#FFFFFF';
      document.getElementById('Th').style.color = '#7B7B7B';
      document.getElementById('Th').style.backgroundColor = '#FFFFFF';
      document.getElementById('Fr').style.color = '#7B7B7B';
      document.getElementById('Fr').style.backgroundColor = '#FFFFFF';
      document.getElementById('Sa').style.color = '#7B7B7B';
      document.getElementById('Sa').style.backgroundColor = '#FFFFFF';
    }
    if (str == 'Su') {
      this.arr[0] = !this.arr[0] == true ? 1 : 0;
      if (this.arr[0] == 1) {
        document.getElementById('Su').style.color = '#FFFFFF';
        document.getElementById('Su').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Su').style.color = '#7B7B7B';
        document.getElementById('Su').style.backgroundColor = '#FFFFFF';
      }
    }
    if (str == 'M') {
      this.arr[1] = !this.arr[1] == true ? 1 : 0;
      if (this.arr[1] == 1) {
        document.getElementById('M').style.color = '#FFFFFF';
        document.getElementById('M').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('M').style.color = '#7B7B7B';
        document.getElementById('M').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr);
    }
    if (str == 'Tu') {
      this.arr[2] = !this.arr[2] == true ? 1 : 0;
      if (this.arr[2] == 1) {
        document.getElementById('Tu').style.color = '#FFFFFF';
        document.getElementById('Tu').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Tu').style.color = '#7B7B7B';
        document.getElementById('Tu').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr);
    }
    if (str == 'We') {
      this.arr[3] = !this.arr[3] == true ? 1 : 0;
      if (this.arr[3] == 1) {
        document.getElementById('We').style.color = '#FFFFFF';
        document.getElementById('We').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('We').style.color = '#7B7B7B';
        document.getElementById('We').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr);
    }
    if (str == 'Th') {
      this.arr[4] = !this.arr[4] == true ? 1 : 0;
      if (this.arr[4] == 1) {
        document.getElementById('Th').style.color = '#FFFFFF';
        document.getElementById('Th').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Th').style.color = '#7B7B7B';
        document.getElementById('Th').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr);
    }
    if (str == 'Fr') {
      this.arr[5] = !this.arr[5] == true ? 1 : 0;
      if (this.arr[5] == 1) {
        document.getElementById('Fr').style.color = '#FFFFFF';
        document.getElementById('Fr').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Fr').style.color = '#7B7B7B';
        document.getElementById('Fr').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr);
    }
    if (str == 'Sa') {
      this.arr[6] = !this.arr[6] == true ? 1 : 0;
      if (this.arr[6] == 1) {
        document.getElementById('Sa').style.color = '#FFFFFF';
        document.getElementById('Sa').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Sa').style.color = '#7B7B7B';
        document.getElementById('Sa').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr);
    }

    console.log(this.arr);
    // for (let i = 0; i < this.arr.length; i++) {
    //   if (this.arr[i] == 1) {
    //     this.arr2[i] == 1
    //     console.log(this.arr2)
    //   }
    // }


    if (this.arr.some(this.checkfalse)) {
      document.getElementById('Rd').style.color = '#7B7B7B';
      document.getElementById('Rd').style.backgroundColor = '#FFFFFF';

    }
    else {
      document.getElementById('Rd').style.color = '#FFFFFF';
      document.getElementById('Rd').style.backgroundColor = '#787df4';
    }
  }
  select1(str: string) {
    this.val2 = !this.val2
    if (str == 'repeat1' && this.val2 == true) {
      this.arr1 = [1, 1, 1, 1, 1, 1, 1];
      // console.log(this.arr1);
      document.getElementById('Su1').style.color = '#FFFFFF';
      document.getElementById('Su1').style.backgroundColor = '#787df4';
      document.getElementById('M1').style.color = '#FFFFFF';
      document.getElementById('M1').style.backgroundColor = '#787df4';
      document.getElementById('Tu1').style.color = '#FFFFFF';
      document.getElementById('Tu1').style.backgroundColor = '#787df4';
      document.getElementById('We1').style.color = '#FFFFFF';
      document.getElementById('We1').style.backgroundColor = '#787df4';
      document.getElementById('Th1').style.color = '#FFFFFF';
      document.getElementById('Th1').style.backgroundColor = '#787df4';
      document.getElementById('Fr1').style.color = '#FFFFFF';
      document.getElementById('Fr1').style.backgroundColor = '#787df4';
      document.getElementById('Sa1').style.color = '#FFFFFF';
      document.getElementById('Sa1').style.backgroundColor = '#787df4';

    }
    if (str == 'repeat1' && this.val2 == false) {
      this.arr1 = [0, 0, 0, 0, 0, 0, 0];
      // console.log(this.arr1);
      document.getElementById('Su1').style.color = '#7B7B7B';
      document.getElementById('Su1').style.backgroundColor = '#FFFFFF';
      document.getElementById('M1').style.color = '#7B7B7B';
      document.getElementById('M1').style.backgroundColor = '#FFFFFF';
      document.getElementById('Tu1').style.color = '#7B7B7B';
      document.getElementById('Tu1').style.backgroundColor = '#FFFFFF';
      document.getElementById('We1').style.color = '#7B7B7B';
      document.getElementById('We1').style.backgroundColor = '#FFFFFF';
      document.getElementById('Th1').style.color = '#7B7B7B';
      document.getElementById('Th1').style.backgroundColor = '#FFFFFF';
      document.getElementById('Fr1').style.color = '#7B7B7B';
      document.getElementById('Fr1').style.backgroundColor = '#FFFFFF';
      document.getElementById('Sa1').style.color = '#7B7B7B';
      document.getElementById('Sa1').style.backgroundColor = '#FFFFFF';

    }
    if (str == 'Su1') {
      this.arr1[0] = !this.arr1[0] == true ? 1 : 0;
      if (this.arr1[0] == 1) {
        document.getElementById('Su1').style.color = '#FFFFFF';
        document.getElementById('Su1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Su1').style.color = '#7B7B7B';
        document.getElementById('Su1').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr1);
    }

    if (str == 'M1') {
      this.arr1[1] = !this.arr1[1] == true ? 1 : 0;
      if (this.arr1[1] == 1) {
        document.getElementById('M1').style.color = '#FFFFFF';
        document.getElementById('M1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('M1').style.color = '#7B7B7B';
        document.getElementById('M1').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr1);
    }
    if (str == 'Tu1') {
      this.arr1[2] = !this.arr1[2] == true ? 1 : 0;
      if (this.arr1[2] == 1) {
        document.getElementById('Tu1').style.color = '#FFFFFF';
        document.getElementById('Tu1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Tu1').style.color = '#7B7B7B';
        document.getElementById('Tu1').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr1);
    }
    if (str == 'We1') {
      this.arr1[3] = !this.arr1[3] == true ? 1 : 0;
      if (this.arr1[3] == 1) {
        document.getElementById('We1').style.color = '#FFFFFF';
        document.getElementById('We1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('We1').style.color = '#7B7B7B';
        document.getElementById('We1').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr1);
    }
    if (str == 'Th1') {
      this.arr1[4] = !this.arr1[4] == true ? 1 : 0;
      if (this.arr1[4] == 1) {
        document.getElementById('Th1').style.color = '#FFFFFF';
        document.getElementById('Th1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Th1').style.color = '#7B7B7B';
        document.getElementById('Th1').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr1);
    }
    if (str == 'Fr1') {
      this.arr1[5] = !this.arr1[5] == true ? 1 : 0;
      if (this.arr1[5] == 1) {
        document.getElementById('Fr1').style.color = '#FFFFFF';
        document.getElementById('Fr1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Fr1').style.color = '#7B7B7B';
        document.getElementById('Fr1').style.backgroundColor = '#FFFFFF';
      }
      // console.log(this.arr1);
    }
    if (str == 'Sa1') {
      this.arr1[6] = !this.arr1[6] == true ? 1 : 0;
      if (this.arr1[6] == 1) {
        document.getElementById('Sa1').style.color = '#FFFFFF';
        document.getElementById('Sa1').style.backgroundColor = '#787df4';
      }
      else {
        document.getElementById('Sa1').style.color = '#7B7B7B';
        document.getElementById('Sa1').style.backgroundColor = '#FFFFFF';
      }
    }
    // console.log(this.arr1);


    if (this.arr1.some(this.checkfalse1)) {
      document.getElementById('Rd1').style.color = '#7B7B7B';
      document.getElementById('Rd1').style.backgroundColor = '#FFFFFF';

    }
    else {
      document.getElementById('Rd1').style.color = '#FFFFFF';
      document.getElementById('Rd1').style.backgroundColor = '#787df4';
    }
  }

  async openModal_ListDevices() {
    // console.log("opened");
    let clickedSceneId = this.auth.getMessage2()
    const modal = await this.modalController.create({
      component: ListOfDevicesModalComponent,
      cssClass: 'ListOfDevicesCss',
      componentProps: {
        sceneId: clickedSceneId,
      },
    })

    return await modal.present();
  }


  //Schedule logic starts here
  async scheduleSave() {
    const loading = await this.loadingCtrl.create({
      message: 'processing..',
      spinner: 'crescent',
      showBackdrop: true
    });
    if (this.sh == this.sth && this.sm == this.stm && this.ampm1 == this.ampm2) {
      this.toast('Start Time and End Time cannot be Same, Please Choose Appropriate Time', 'warning')
    }
    else if ((this.convertedSh && this.convertedSth && this.sm && this.stm) || (this.ScheduleBasedOn && this.ScheduleDayNight)) {

      if (this.ScheduleBasedOn === 'Time') {
        this.scheduleType = "Time"
        this.finalArr = this.arr;
        if (this.convertedSh > 23 && this.ampm1 == "PM") {
          this.convertedSh = "12"
        } else if (this.convertedSth > 23 && this.ampm2 == "PM") {
          this.convertedSth = "12"
        }
        if (this.convertedSh == 12 && this.ampm1 == "AM") {
          this.convertedSh = "00"
        } else if (this.convertedSth == 12 && this.ampm2 == "AM") {
          this.convertedSth = "00"
        }
        this.splittedHour = this.convertedSh.toString().split('')
        this.splittedMin = this.sm.toString().split('')
        this.splittedFHour = this.convertedSth.toString().split('')
        this.splittedFMin = this.stm.toString().split('')

        console.log("splitted", this.splittedHour)
        console.log("splitted", this.splittedMin)
        console.log("splitted", this.splittedFHour)
        console.log("splitted", this.splittedFMin)
      }

      if (this.ScheduleBasedOn === 'DayNight') {
        this.scheduleType = "DayNight"
        this.finalArr = this.arr1;
        this.sunriseData = localStorage.getItem('sunrise');
        this.sunsetData = localStorage.getItem('sunset');

        let spilltedSunrise = this.sunriseData.toString().split(':')
        let spilltedSunset = this.sunsetData.toString().split(':')
        console.log(spilltedSunrise);
        console.log(spilltedSunset);
        let splittedHourSunrise1 = spilltedSunrise[0].toString().split('')
        let splittedHourSunrise2 = spilltedSunrise[1].toString().split('')
        let splittedSunset1 = spilltedSunset[0].toString().split('')
        let splittedSunset2 = spilltedSunset[1].toString().split('')
        console.log(splittedHourSunrise1)
        console.log(splittedHourSunrise2)
        console.log(splittedSunset1)
        console.log(splittedSunset2)
        console.log(this.ScheduleDayNight);
        console.log(this.ScheduleBasedOn);
        if (this.ScheduleDayNight === 'M') {

          this.splittedHour = splittedHourSunrise1;
          this.splittedMin = splittedHourSunrise2
          this.splittedFHour = splittedSunset1
          this.splittedFMin = splittedSunset2
        }
        if (this.ScheduleDayNight === 'N') {

          this.splittedHour = splittedSunset1;
          this.splittedMin = splittedSunset2
          this.splittedFHour = splittedHourSunrise1
          this.splittedFMin = splittedHourSunrise2
        }
      }
      this.editFieldsObj = {
        sceneStartTime: this.splittedHour[0] + this.splittedHour[1] + this.splittedMin[0] + this.splittedMin[1],
        sceneEndTime: this.splittedFHour[0] + this.splittedFHour[1] + this.splittedFMin[0] + this.splittedFMin[1],
        weekDays: this.finalArr[0].toString() + this.finalArr[1].toString() + this.finalArr[2].toString() + this.finalArr[3].toString() + this.finalArr[4].toString() + this.finalArr[5].toString() + this.finalArr[6].toString()
      }
      // console.log(this.editFieldsObj.sceneStartTime)
      // this.subscription1 = this.afauth.authState.subscribe((user) => {
      //   if (user) {
      //     this.userId = user.uid;
      //   }
      this.subscription = this.afs.collection('user')
        .doc(this.userId)
        .collection('scenes')
        .get()
        .subscribe((value) => {
          value.docs.forEach((doc, index) => {
            if (doc.data().sceneId == this.sceneClickedId) {
              this.selectedSceneDevices = doc.data().sceneDevices
              this.selectedSceneDevicesState = doc.data().scenesDevicesState;
            }
            if (doc.data().sceneId != this.sceneClickedId) {
              if (doc.data().editSceneFields != undefined && doc.data().editSceneFields.sceneEndTime == this.editFieldsObj.sceneEndTime && doc.data().editSceneFields.sceneStartTime == this.editFieldsObj.sceneStartTime) {
                for (let i = 0; i < this.selectedSceneDevicesState.length; i++) {
                  for (let j = 0; j < doc.data().scenesDevicesState.length; j++) {
                    if (this.selectedSceneDevicesState[i].deviceId == doc.data().scenesDevicesState[j].deviceId) {
                      if (this.selectedSceneDevicesState[i].deviceToggleStateScene == true && doc.data().scenesDevicesState[j].deviceToggleStateScene == true) {
                        if (this.selectedSceneDevicesState[i].toggleAfterScene != doc.data().scenesDevicesState[j].toggleAfterScene && this.selectedSceneDevicesState[i].toggleDuringScene != doc.data().scenesDevicesState[j].toggleDuringScene) {
                          this.toast(this.toasterMessage, 'danger');
                          j = doc.data().scenesDevicesState.length + 1;
                          i = this.selectedSceneDevicesState.length + 1;
                        }
                      }
                    }
                  }
                }
              }
            }
            else {
              // this.afauth.authState.subscribe((user) => {
              //   if (user) {
              //     this.userId = user.uid;
              //   }
              let clickedSceneId = this.auth.getMessage2()
              this.afs.collection('user')
                .doc(this.userId)
                .collection('scenes')
                .doc(clickedSceneId)
                .update({
                  editSceneFields: this.editFieldsObj,
                  scheduleType: this.scheduleType
                })
              // })
              let sceneSets = []

              // console.log(clickedSceneId)

              this.afs.collection('user')
                .doc(this.userId)
                .collection('scenes')
                .doc(clickedSceneId)
                .get()
                .subscribe((value) => {
                  this.sceneDevicesArray = value.data().scenesDevicesState;
                  // console.log(this.sceneDevicesArray)
                  let useDeviceInScene = []
                  let tempObj;
                  this.sceneDevicesArray.forEach((data) => {
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
                  // console.log(useDeviceInScene)
                  let repeat;
                  useDeviceInScene.forEach((data, i) => {
                    // console.log(data)
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

                    if (this.finalArr.some(val => val == "1")) {
                      repeat = "R"
                      // console.log(repeat)
                    }
                    else {
                      repeat = "N"
                      // console.log(repeat)

                    }


                    // console.log(data.deviceId)
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
                          // console.log(this.devicePlug)
                          // console.log(this.deviceMacId)
                          // console.log(this.count)
                          // console.log(this.scenesScheduleBits)
                        })
                        // 1	C	1	N	1	2	2	8	1	0	1	1	1	1	1	X
                        // console.log(deviceAfterScene, deviceDuringScene)
                        if (deviceAfterScene == 1 && deviceDuringScene == 0) {
                          this.mqttString = this.devicePlug + "C" + deviceAfterScene + repeat + this.splittedFHour[0]
                            + this.splittedFHour[1] + this.splittedFMin[0] + this.splittedFMin[1] + this.finalArr[0] + this.finalArr[1] + this.finalArr[2]
                            + this.finalArr[3] + this.finalArr[4] + this.finalArr[5] + this.finalArr[6] + "X" + this.devicePlug + "C" + deviceDuringScene + repeat + this.splittedHour[0]
                            + this.splittedHour[1] + this.splittedMin[0] + this.splittedMin[1] + this.finalArr[0] + this.finalArr[1] + this.finalArr[2]
                            + this.finalArr[3] + this.finalArr[4] + this.finalArr[5] + this.finalArr[6] + "X";
                        } else if (deviceAfterScene == 0 && deviceDuringScene == 1) {

                          this.mqttString = this.devicePlug + "C" + deviceDuringScene + repeat + this.splittedHour[0]
                            + this.splittedHour[1] + this.splittedMin[0] + this.splittedMin[1] + this.finalArr[0] + this.finalArr[1] + this.finalArr[2]
                            + this.finalArr[3] + this.finalArr[4] + this.finalArr[5] + this.finalArr[6] + "X"
                            + this.devicePlug + "C" + deviceAfterScene + repeat + this.splittedFHour[0]
                            + this.splittedFHour[1] + this.splittedFMin[0] + this.splittedFMin[1] + this.finalArr[0] + this.finalArr[1] + this.finalArr[2]
                            + this.finalArr[3] + this.finalArr[4] + this.finalArr[5] + this.finalArr[6] + "X";
                        }
                        if (this.count < 2) {
                          if (this.scenesScheduleBits.length == 0) {

                            this.finalMqttString = this.mqttString + this.zString + this.zString
                            // console.log(this.finalMqttString)

                          } else if (this.scenesScheduleBits.length == 1) {
                            this.scenesScheduleBits.forEach((data, i) => {
                              this.finalMqttString = data['bitSet'] + this.mqttString + this.zString
                              // console.log(this.finalMqttString)

                            })


                          }

                        }

                        this.sceneBitSetObj = {
                          sceneId: clickedSceneId,
                          bitSet: this.mqttString
                        }

                        // this.count = 1
                        if (this.count == 0) {
                          loading.present();
                          this.afs.collection('user')
                            .doc(this.userId)
                            .collection('devices')
                            .doc(data.deviceId)
                            .update({
                              sceneDevicesCount: this.count + 1,
                              scenesScheduleBits: firebase.firestore.FieldValue.arrayUnion(this.sceneBitSetObj),
                            }).then(async () => {
                              loading.dismiss();
                              this.toast("Set Updated Successfully", "success")
                              this.afs.collection('user')
                                .doc(this.userId)
                                .collection('scenes')
                                .doc(clickedSceneId)
                                .update({
                                  manualSceneStatus: "activate"
                                })
                              this.router.navigate(['/view-all-scenes'])

                            }).catch(err => {
                              console.log(err)
                            })
                          // console.log(this.sceneBitSetObj)
                          // sending Mqtt hit ////////////////////////////////////////////////////////////////
                          this.tempPublishObservable2 = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/GetStatus", "")
                          this.tempPublishObservable2.subscribe((data) => { console.log(data) },
                            (err) => { console.log(err) })


                          this.subscription2 = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                            console.log(message)
                            this.message = message.payload.toString();
                            console.log(this.message)

                          })

                          this.subscription22 = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/' + "Plug" + this.devicePlug).subscribe((message: IMqttMessage) => {
                            this.message = message.payload.toString();
                            console.log("Message: ", this.message)
                          });

                          this.tempPublishPlug1Off2 = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/" + "Plug" + this.devicePlug, this.finalMqttString)
                          this.tempPublishPlug1Off2.subscribe((data) => { console.log(data) },
                            (err) => { console.log(err) })

                          // End of Mqtt hit //////////////////////////////////////////////////////////////////////////

                          this.subscription2.unsubscribe()
                          this.subscription22.unsubscribe()
                        }

                        this.scenesScheduleBits.forEach((value) => {
                          if (this.count > 0 && this.count < 2 && value.sceneId !== clickedSceneId) {
                            loading.present();
                            this.afs.collection('user')
                              .doc(this.userId)
                              .collection('devices')
                              .doc(data.deviceId)
                              .update({
                                sceneDevicesCount: this.count + 1,
                                scenesScheduleBits: firebase.firestore.FieldValue.arrayUnion(this.sceneBitSetObj)
                              }).then(async () => {
                                loading.dismiss();
                                this.toast("Set Updated Successfully", "success")
                                this.afs.collection('user')
                                  .doc(this.userId)
                                  .collection('scenes')
                                  .doc(clickedSceneId)
                                  .update({
                                    manualSceneStatus: "activate"
                                  })
                                this.router.navigate(['/view-all-scenes'])

                              }).catch(err => {
                                console.log(err)
                              })
                            // console.log(this.sceneBitSetObj)
                          } else if (this.scenesScheduleBits.length == 2) {
                            // console.log(this.scenesScheduleBits)
                            loading.present();
                            this.scenesScheduleBits.forEach((val, i) => {
                              if (val.sceneId == clickedSceneId) {
                                this.scenesScheduleBits.splice(i, 1);

                                this.scenesScheduleBits.push(this.sceneBitSetObj)

                              }
                              console.log(this.scenesScheduleBits)
                              this.afs.collection('user')
                                .doc(this.userId)
                                .collection('devices')
                                .doc(data.deviceId)
                                .set({
                                  scenesScheduleBits: this.scenesScheduleBits
                                }, { merge: true }).then(async () => {
                                  loading.dismiss();
                                  this.toast("Set Updated Successfully", "success")
                                  this.afs.collection('user')
                                    .doc(this.userId)
                                    .collection('scenes')
                                    .doc(clickedSceneId)
                                    .update({
                                      manualSceneStatus: "activate"
                                    })
                                  this.router.navigate(['/view-all-scenes'])

                                }).catch(err => {
                                  console.log(err)
                                })
                            })
                            let set1;
                            let set2;
                            let deviceSetBit = []
                            this.scenesScheduleBits.forEach((data, i) => {
                              // this.finalMqttString = data['bitSet'] + this.mqttString + zString
                              // console.log(this.finalMqttString)
                              deviceSetBit.push(data.bitSet)

                            })
                            set1 = deviceSetBit[0]
                            set2 = deviceSetBit[1]
                            this.finalMqttString = set1 + set2 + this.zString
                            // console.log(this.finalMqttString)
                          } else if (this.scenesScheduleBits.length == 1 && value.sceneId == clickedSceneId) {
                            this.finalMqttString = this.mqttString + this.zString + this.zString
                            loading.present();
                            console.log(this.finalMqttString)
                            this.afs.collection('user')
                              .doc(this.userId)
                              .collection('devices')
                              .doc(data.deviceId)
                              .set({
                                scenesScheduleBits: Array(this.sceneBitSetObj)
                                // scenesScheduleBits: this.sceneBitSetObj
                              }, { merge: true }).then(async () => {
                                loading.dismiss();
                                this.toast("Set Updated Successfully", "success")
                                this.afs.collection('user')
                                  .doc(this.userId)
                                  .collection('scenes')
                                  .doc(clickedSceneId)
                                  .update({
                                    manualSceneStatus: "activate"
                                  })
                                this.router.navigate(['/view-all-scenes'])
                              }).catch(err => {
                                console.log(err)
                              })
                          }
                        })
                        // sending Mqtt hit ////////////////////////////////////////////////////////////////
                        // console.log(this.finalMqttString)
                        // this.tempPublishObservable3 = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/GetStatus", "")
                        // this.tempPublishObservable3.subscribe((data) => { console.log(data) },
                        //   (err) => { console.log(err) })


                        // this.subscription3 = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/SendStatus').subscribe((message: IMqttMessage) => {
                        //   console.log(message)
                        //   this.message = message.payload.toString();
                        //   console.log(this.message)

                        // })

                        this.subscription33 = this._mqttService.observe('apsis/migro/' + this.deviceMacId + '/' + "Plug" + this.devicePlug).subscribe((message: IMqttMessage) => {
                          this.message = message.payload.toString();
                          console.log("Message: ", this.message)
                        })

                        this.tempPublishPlug1Off3 = this._mqttService.publish("apsis/migro/" + this.deviceMacId + "/" + "Plug" + this.devicePlug, this.finalMqttString)
                        this.tempPublishPlug1Off3.subscribe((data) => { console.log(data) },
                          (err) => { console.log(err) })

                        // End of Mqtt hit //////////////////////////////////////////////////////////////////////////
                      })
                    if (this.subscription33) {

                      // this.subscription3.unsubscribe()
                      this.subscription33.unsubscribe()
                    }
                  })
                })
              // })
            }
          })
        })
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('scenes')
        .doc(this.sceneClickedId)
        .update({
          manualSceneStatus: 'run'
        })
      // })
    } else {
      this.toast("Please choose an Appropriate Time", "warning")
    }

  }

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  ngOnDestroy() {
    console.log("********")
    if (this.subscription33) {

      this.subscription33.unsubscribe()
    }



  }
  home() {
    this.router.navigate(['home'])

  }

  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 5000,
    });
    toast.present();
  }


}
