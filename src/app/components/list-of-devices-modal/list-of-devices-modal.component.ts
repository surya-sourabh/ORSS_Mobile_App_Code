import { Component, OnInit, Input, Output, } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-list-of-devices-modal',
  templateUrl: './list-of-devices-modal.component.html',
  styleUrls: ['./list-of-devices-modal.component.scss'],
})
export class ListOfDevicesModalComponent implements OnInit {
  sceneName: any;

  constructor(private modalCtrl: ModalController, private afs: AngularFirestore,
    private afauth: AngularFireAuth,) { }

  title = "List of devices in Scene";
  devicesIdArray = [];
  @Input() sceneId = ''
  userId: string = '';
  deviceIconsType = ['fas', 'far'];
  deviceName = [];
  deviceIcon = [];
  channelName = [];
  plugNumber = [];
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('scenes').doc(this.sceneId)
        .get()
        .subscribe((snapshot) => {
          this.sceneName = snapshot.get('sceneName')
          this.devicesIdArray = snapshot.get('sceneDevices');
          console.log(this.devicesIdArray);
          this.devicesIdArray.forEach((element: any, index: string | number) => {
            this.afs
              .collection('user')
              .doc(this.userId)
              .collection('devices')
              .doc(element)
              .get()
              .subscribe((value) => {
                this.deviceName[index] = value.get('deviceName');
                this.plugNumber[index] = value.get('plugNumber');
                this.deviceIcon[index] = value.get('deviceIcon');
                this.channelName[index] = value.get('channelName');
                console.log(this.channelName)
                console.log(this.deviceName)
                console.log(this.deviceIcon)
                console.log(this.plugNumber)

              });
          });
        })

      console.log(this.sceneId);

    })
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

}
