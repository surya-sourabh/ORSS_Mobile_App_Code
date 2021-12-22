import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-channel-one',
  templateUrl: './add-channel-one.page.html',
  styleUrls: ['./add-channel-one.page.scss'],
})
export class AddChannelOnePage implements OnInit {
  title = 'Add Channel';
  channelName: string = '';
  channelId: string = '';
  userId: string = '';
  wifiPass: string;
  ssid: string;
  toggleState = false;
  id;
  wifi: {
    state: boolean;
    ssid: string;
    wifiPass: string;
    timeZone: string;
  };
  c: {
    channelId: any;
  };
  navigationEx: any;
  reactiveForm: FormGroup;
  submitted: boolean;
  scannedData: string;
  deviceId: any;
  MacId: string = '';
  ChannelType: String;
  ManufacturingDate: string = '';
  lat: string = '';
  lng: string = '';
  alt: string = '';
  doorName: string = "";
  location: string = "";
  building: string = "";
  interval: number = 10;
  alert: number = 1;
  allChannelsMacId = [];
  timeZone: string;
  plusOrMinus: string;
  zone: string;
  constructor(
    // private qrScanner: QRScanner,
    private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private _api: ApiService,
    private http: HttpClient,
    private LoadingCtrl: LoadingController,
    private toaster: ToastController,
    // private http: HTTP,

  ) {
    this.reactiveForm = this.formBuilder.group({
      channelName: new FormControl(null, [Validators.required]),
      deviceId: new FormControl(null, [Validators.required]),
      MacId: new FormControl(null, [Validators.required])
    })
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
    })
    var navigation = this.router.getCurrentNavigation();
    var state = navigation.extras.state as { wifiPass: string; ssid: string; timeZone: string };
    this.wifiPass = state.wifiPass;
    this.ssid = state.ssid;
    this.zone = state.timeZone
    this.plusOrMinus = state.timeZone.slice(0,1)
    this.timeZone = encodeURIComponent(this.plusOrMinus)+this.zone.slice(1)
    console.log(this.timeZone)
    console.log(this.timeZone)
    this.wifi = {
      state: false,
      ssid: '',
      wifiPass: '',
      timeZone: ''
    };
   
  }


  get f() {
    return this.reactiveForm.controls;
  }


  disToggle() {
    this.toggleState = !this.toggleState;

    if (this.toggleState == true) {
      this.wifi = {
        state: true,
        ssid: this.ssid,
        wifiPass: this.wifiPass,
        timeZone: this.timeZone
      };
    }

  }


  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData.text);
      this.scannedData = barcodeData.text;
      const splitValue = this.scannedData.split("|");
      this.deviceId = splitValue[0];
      this.MacId = splitValue[1];
      this.channelName = splitValue[2];
      this.ManufacturingDate = splitValue[3];

    }).catch(err => {
      console.log('Error', err);
    });
  }


  ngOnInit() {
    // this.scan();
    this.lat = localStorage.getItem('lat');
    this.lng = localStorage.getItem('lng');
    this.alt = localStorage.getItem('alt');
  }


  backBtnTo() {
    this.router.navigate(['add-channel']);
  }

  async nextBtnTo() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    }
    else {
      this.allChannelsMacId = []
      this.afs.collection('user')
        .doc(this.userId)
        .collection('channels')
        .get()
        .subscribe(async (snapshot) => {
          snapshot.docs.forEach((val, i) => {
            this.allChannelsMacId[i] = val.get('macId')
            // console.log(this.allChannelsMacId)
          })
          if (this.allChannelsMacId.includes(this.MacId)) {
            this.toast('The Mac ID is already used by another Channel', 'warning');
          } else {

            const loading = await this.LoadingCtrl.create({
              message: `Connecting to device.
                  Attempting to connect,
                  please wait.`,
              spinner: 'crescent',
              showBackdrop: true
            });
            loading.present();
            this.http.get(`${this._api.apiEndPoint}/setting?ssid=${this.ssid}&pass=${this.wifiPass}&door=${this.doorName}&loca=${this.timeZone}&building=${this.building}&latitude=${this.lat}&longitude=${this.lng}&naltitude=${this.alt}&interval=${this.interval}&alert=${this.alert}&ndeviceid=${this.deviceId}`, { withCredentials: true })
              .subscribe(data => {
                if (data["status"] === 200) {
                  this.afauth.authState.subscribe((user) => {
                    if (user) {
                      this.userId = user.uid;
                    }

                    this.id = 'ch' + user.email + Date.now();

                    this.afs
                      .collection('user')
                      .doc(this.userId)
                      .update({
                        wifi: this.wifi,
                        channelsarray: firebase.firestore.FieldValue.arrayUnion(
                          (this.c = {
                            channelId: this.id,
                          })
                        ),
                      });
                    this.afs
                      .collection('user')
                      .doc(this.userId)
                      .collection('channels')
                      .doc(this.id)
                      .set({
                        channelName: this.channelName,
                        channelId: this.id,
                        iotChannelId: this.deviceId,
                        macId: this.MacId,
                        manufacturingDate: this.ManufacturingDate,
                        capacity: 4,
                        icon: 'dice-two',
                        channelState: 'Not-set',
                        defaultChannelIcon: "default.png"
                      });
                  });
                  console.log("Success");
                  loading.dismiss();
                  this.toast('Channel connected Sucessfully', 'success');
                  var navigationExt1: NavigationExtras = {
                    state: { id: this.id, connectStatus: true }
                  };
                  this.router.navigate(['add-channel-connected'], navigationExt1);
                }
              },
                (error => {
                  this.afauth.authState.subscribe((user) => {
                    if (user) {
                      this.userId = user.uid;
                    }

                    this.id = 'ch' + user.email + Date.now();

                    this.afs
                      .collection('user')
                      .doc(this.userId)
                      .update({
                        wifi: this.wifi,
                        channelsarray: firebase.firestore.FieldValue.arrayUnion(
                          (this.c = {
                            channelId: this.id,
                          })
                        ),
                      });
                    this.afs
                      .collection('user')
                      .doc(this.userId)
                      .collection('channels')
                      .doc(this.id)
                      .set({
                        channelName: this.channelName,
                        channelId: this.id,
                        iotChannelId: this.deviceId,
                        macId: this.MacId,
                        manufacturingDate: this.ManufacturingDate,
                        capacity: 4,
                        icon: 'dice-two',
                        channelState: 'Not-set',
                        defaultChannelIcon: "default.png"
                      });
                  });
                  loading.dismiss();
                  this.toast('Channel connected Sucessfully', 'success');
                  var navigationExt1: NavigationExtras = {
                    state: { id: this.id, connectStatus: true, channelName: this.channelName }
                  };
                  this.router.navigate(['add-channel-connected'], navigationExt1);
                  console.log(error.status);
                })
              );
          }

        })
    }
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      window.location.reload();
    }, 2000);
  }
  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
