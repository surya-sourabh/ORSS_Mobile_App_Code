import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  newMessage = " hello"

  @Output() event = new EventEmitter<string>();

  notificationNum = "5";
  private subscription: Subscription;
  public message: string;
  allDeviceStatus = []
  styleButton: { color: string; };
  splittedDeviceArray = [];
  activeState = [];
  deviceLength: number;
  newObj = {
    plug: '',
    state: ''
  }
  singleDevice = [];
  tempObj;
  public value: any;
  macId = []
  macIdForMqtt = []
  tempMacId = []
  macIdForPublish = []
  userId: any;
  plugNumber = [];
  devicesInfo = [];
  public send: any;


  constructor(private router: Router,
    private auth: AuthService,
    private _mqttService: MqttService,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private api: ApiService,
    private util: UtilService) {
    // console.log(this.newMessage)
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

      }

      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices')
        .get().subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.devicesInfo[index] = doc.data().plugNumber;
            this.plugNumber[index] = this.devicesInfo[index]
            // console.log(this.plugNumber[index])
          });



        })
    })

    // this.afauth.authState.subscribe((user) => {
    //   if (user) {
    //     this.userId = user.uid;

    //   }
    //   this.afs
    //     .collection('user')
    //     .doc(this.userId)
    //     .collection('channels')
    //     .get()
    //     .subscribe((snapshot) => {
    //       snapshot.docs.forEach((doc, index) => {
    //         this.macIdForMqtt[index] = doc.data().macId;
    //         // console.log(this.macIdForMqtt[index])
    //         this.macIdForPublish[index] = this.macIdForMqtt[index]
    //         // console.log(this.macIdForPublish[index])
    //         this.tempMacId.push(this.macIdForPublish[index])
    //         // console.log(this.tempMacId)
    //         this.tempMacId.forEach((macId, i) => {
    //           // console.log(macId)
    //           let tempPublishObservable = this._mqttService.publish("apsis/migro/" + macId + "/GetStatus", "")
    //           tempPublishObservable.subscribe((data) => { console.log(data) },
    //             (err) => { console.log(err) })







    //           setInterval(() => {
    //             let tempPublishObservable = this._mqttService.publish("apsis/migro/" + macId + "/GetStatus", "")
    //             tempPublishObservable.subscribe((data) => { console.log(data) },
    //               (err) => { console.log(err) })
    //           }, 300000);



    //           // Subscribe to the SendStatus to get the Status of every Plug (Electronic device inside the Channel).
    //           // This will give plug no: 0/1. 0 means device is off(green). 1 means device is on(red)
    //           this.subscription = this._mqttService.observe('apsis/migro/' + macId + '/SendStatus').subscribe((message: IMqttMessage) => {
    //             this.message = message.payload.toString();
    //             console.log("Message: ", this.message)
    //             if (!this.message || this.message.length == 0) {
    //               // My channel is switched of
    //               // My system will show any electronic device as GREY
    //               // this.activeState = "power-default"
    //               console.log("#########################")
    //             }
    //             else {
    //               this.splittedDeviceArray = [];
    //               // this.activeState = "power-on"
    //               // My System will check the complete String
    //               // Use string to split based on , to get list of devices which are on or off
    //               const splitValue = this.message.split(",");
    //               // console.log(splitValue)
    //               for (let i = 0; i < splitValue.length; i++) {
    //                 // console.log(splitValue[i])
    //                 this.singleDevice = splitValue[i].split(':');
    //                 // console.log(this.singleDevice);
    //                 this.newObj.plug = this.singleDevice[0]
    //                 this.newObj.state = this.singleDevice[1]
    //                 this.tempObj = { ...this.newObj }
    //                 // console.log(this.tempObj)
    //                 this.splittedDeviceArray.push(this.tempObj)
    //               }
    //               // console.log(this.splittedDeviceArray)

    //               this.splittedDeviceArray.forEach((data, i) => {

    //                 if (data.plug == this.plugNumber[i]) {
    //                   if (data.state == "1" || data.state.toUpperCase() === "ON") {
    //                     this.activeState[i] = "power-on"
    //                     this.send = this.activeState[i]
    //                     this.util.setMessage(this.send)
    //                   } else {
    //                     this.activeState[i] = "power-off"
    //                     // this.api.setMessage(this.activeState[i])
    //                     this.send = this.activeState[i]

    //                   }


    //                 }
    //               })
    //               console.log(this.send)
    //               this.util.setMessage(this.send)
    //             }
    //           })
    //         });

    //         //For quick MQTT Testing
    //       });
    //     })
    // })
  }

  ngOnInit() {
    // this.event.emit(this.newMessage)

  }
  @Input() title = '';
  @Input() titleIcon: boolean;
  @Input() iconName = "";
  @Input() backBtn: boolean;
  @Input() notificationIcon: boolean;
  @Input() notificationBadgeIcon: boolean;
  @Input() nextBtn: boolean;
  @Input() doneBtn: boolean;
  @Input() saveBtn: boolean;
  @Input() closeBtn: boolean = false;
  @Input() clockIcon: boolean;
  @Output() backBtnEvent = new EventEmitter();
  @Output() nextBtnEvent = new EventEmitter();
  @Output() doneBtnEvent = new EventEmitter();
  @Output() saveBtnEvent = new EventEmitter();

  backBtnLink() {
    this.backBtnEvent.emit();
  }

  nextBtnLink() {
    this.nextBtnEvent.emit();
  }

  doneBtnLink() {
    this.doneBtnEvent.emit();
  }


  scheduleScenePage() {
    this.router.navigate(['schedule-the-scene']);

  }
  saveBtnLink() {
    this.saveBtnEvent.emit();
  }


}
