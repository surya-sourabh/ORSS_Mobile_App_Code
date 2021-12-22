import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() channelName = '';
  @Input() channelId = '';
  @Input() deviceName = '';
  @Input() plugNumber = '';
  @Input() roomName = '';

  selectAll: boolean;
  userId: string;
  channels = [];
  devices = [];
  // deviceName = [];
  deviceId: string;
  check: boolean;
  checked: any;
  channelDevices: any;
  deviceIcon: any;
  plugId: any;

  channelDeviceId: any;
  channelDeviceName: any;
  channelDevicePlugNumber: any;
  channelDevicePlugId: any;
  mId = this.auth.getMessage();
  memberdevices: any;

  primaryUserDevices: any = [];
  secondaryUserDevices: any = [];
  selectedDevices: any = {};

  constructor(private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private auth: AuthService,
    private util: UtilService
  ) {
    this.selectAll = false;
    // console.log(this.mId)
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // console.log(this.userId);
      }
      // console.log(this.channelId)
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels', (ref) =>
          ref.where('channelId', '==', this.channelId))
        .get()
        .subscribe((snapshot) => {
          // console.log(snapshot.docs)
          snapshot.docs.forEach((doc, index) => {
            this.channels[index] = doc.data();
            // console.log(this.channels)
            // console.log(this.channelId)
          });

        });

      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('devices', (ref) =>
          ref.where('channelId', '==', this.channelId))
        .get()
        .subscribe((snapshot) => {
          // console.log(snapshot.docs)
          snapshot.docs.forEach((doc, index) => {
            this.devices[index] = doc.data();
            // console.log(this.devices[index])
            // console.log(this.channelId)
          });

          // console.log(this.devices);


          this.afs
            .collection('user')
            .doc(this.mId)
            .collection('devices')
            .get()
            .subscribe((snapshot) => {
              // console.log(snapshot)
              snapshot.docs.forEach((doc, index) => {
                // this.devices[index] = doc.data();
                // console.log(doc.data())
                this.secondaryUserDevices.push(doc.data().deviceId)

              })

              // console.log(this.secondaryUserDevices);

              this.primaryUserDevices = this.devices.map(device => {
                let tempDevice = { ...device };
                if (this.secondaryUserDevices.includes(device.deviceId)) {
                  tempDevice.grantedPermission = true
                } else {
                  tempDevice.grantedPermission = false
                }

                return tempDevice;
              })


              if (this.primaryUserDevices.every(device => {
                // console.log(device.deviceId)
                return this.secondaryUserDevices.includes(device.deviceId)
              })) {
                this.setSelectAll(true)
              }

              if (this.primaryUserDevices.length == 0) {
                this.setSelectAll(false)
              }

            })

            if (this.devices.length > 0) {

            for (let index = 0; index < this.devices.length; index++) {

              this.deviceName = this.devices[index].deviceName;
              this.plugNumber = this.devices[index].plugNumber;
              this.deviceId = this.devices[index].deviceId;
              // this.checked = this.devices[index].checked;
              this.deviceIcon = this.devices[index].deviceIcon;
              this.plugId = this.devices[index].plugId;
              // console.log(this.deviceId)
            }
          }
        })
    });
  }

  ngOnInit() {
  }

  saveSecondaryUserDevice(deviceId, deviceName, plugNumber, plugId) {
    const deviceData = {
      channelId: this.channelId,
      channelName: this.channelName,
      deviceIcon: this.deviceIcon,
      deviceId: deviceId,
      deviceName: deviceName,
      plugId: plugId,
      plugNumber: plugNumber,
      grantedPermission: true
    }
    this.afs.collection('user').doc(this.mId)
      .collection('devices').doc(this.channelDeviceId)
      .set(deviceData);
  }

  setSelectAll(value) {
    this.selectAll = value;
  }

  handleSelectAllCheckBox(event) {

    if (event) {
      // console.log('SELECT ALL IS CHECKED')
      this.setSelectAll(true);
      this.primaryUserDevices.forEach(device => {
        device.grantedPermission = true;
      });

      this.primaryUserDevices.forEach(device => {
        this.util.setSelectedDevices(device);
      });
    } else {
      // console.log('SELECT ALL IS NOT CLICKED')
      this.setSelectAll(false);
      this.primaryUserDevices.forEach(device => {
        device.grantedPermission = false;
      });

      this.primaryUserDevices.forEach(device => {
        this.util.removeSelectedDevices(device);
      });

    }

  }

  handleDeviceCheckBox(event, deviceId, deviceName, plugNumber, plugId) {
    console.log(event);
    console.log(deviceId)

    const deviceData = {
      channelId: this.channelId,
      channelName: this.channelName,
      deviceIcon: this.deviceIcon,
      deviceId: deviceId,
      deviceName: deviceName,
      plugNumber: plugNumber,
      grantedPermission: true
    }
    if (event) {
      // console.log('DEVICE CHECK BOX IS CHECKED')
      // this.selectedDevices[deviceId] = deviceData;
      this.util.setSelectedDevices(deviceData);
      if (this.primaryUserDevices.every(device => device.grantedPermission === true)) {
        this.setSelectAll(true);
      }

    } else {
      // console.log('DEVICE CHECK BOX IS NOT CHECKED')
      this.setSelectAll(false);
      // delete this.selectedDevices[deviceId];
      this.util.removeSelectedDevices(deviceData)
    }

  }

}
