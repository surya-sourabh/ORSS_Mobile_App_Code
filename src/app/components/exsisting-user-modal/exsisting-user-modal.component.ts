import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-exsisting-user-modal',
  templateUrl: './exsisting-user-modal.component.html',
  styleUrls: ['./exsisting-user-modal.component.scss'],
})
export class ExsistingUserModalComponent implements OnInit {

  @Input() data: string;
  primaryBtnText = "Save";
  userId = '';
  membersArray = [];
  userMemberName = [];
  memberId = [];
  memberNameArray = []
  memberIdArray = []
  cloneFromId = '';
  user1 = [];
  mId: any;
  mName: any;
  devices: any;
  deviceName: any;
  plugNumber: any;
  deviceId: any;
  deviceIcon: any;
  plugId: any;
  userFrom; any;
  devicess = [];
  checked: any;
  channelId: any;
  channelName: any;
  constructor(
    private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private auth: AuthService) {
    this.mId = this.auth.getMessage();
    this.mName = this.auth.getMessage2();
    console.log(this.mName)
    // console.log("clone to =>", this.mId)
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('members')
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.membersArray[index] = doc.data();
            console.log(this.membersArray)
            this.memberNameArray = []
            this.memberIdArray = []
            this.membersArray.filter(
              (element: any, index: string | number) => {
                if (element.memberName !== this.mName && element.memberId !== this.mId) {
                  this.userMemberName[index] = element.memberName
                  this.memberId[index] = element.memberId;
                  this.memberNameArray.push(this.userMemberName[index])
                  this.memberIdArray.push(this.memberId[index])
                  console.log(this.memberNameArray)
                }

              }
            );
          })
        })
      // this.afs
      //   .collection('user')
      //   .doc(this.userId)
      //   .get()
      //   .subscribe((data) => {
      //     this.membersArray = data.get('membersarray');
      //     this.membersArray.filter(
      //       (element: any, index: string | number) => {
      //         if (element.memberName !== this.mName) {
      //           this.userMemberName[index] = element.memberName
      //           this.memberId[index] = element.memberId;
      //           this.memberNameArray.push(this.userMemberName[index])
      //           this.memberIdArray.push(this.memberId[index])
      //         }
      //       }
      //     );
      // });
    });
  }

  ngOnInit() {

  }

  Id(memberIdArray) {
    this.cloneFromId = memberIdArray;
    console.log("clone from =>", this.cloneFromId)
  }

  changePermission() {

    this.afs
      .collection('user')
      .doc(this.cloneFromId)
      .collection('devices')
      .get()
      .subscribe((snapshot) => {
        snapshot.docs.forEach((doc, index) => {
          this.devicess[index] = doc.data();
        });
        if (this.devicess.length > 0) {

          for (let index = 0; index < this.devicess.length; index++) {
            this.channelId = this.devicess[index].channelId;
            this.channelName = this.devicess[index].channelName;
            this.deviceName = this.devicess[index].deviceName;
            this.plugNumber = this.devicess[index].plugNumber;
            this.deviceId = this.devicess[index].deviceId;
            this.deviceIcon = this.devicess[index].deviceIcon;
            this.plugId = this.devicess[index].plugId;
            this.checked = this.devicess[index].grantedPermission

            this.afs
              .collection('user')
              .doc(this.mId)
              .collection('devices')
              .doc(this.deviceId)
              .set({
                channelName: this.channelName,
                channelId: this.channelId,
                deviceName: this.deviceName,
                plugNumber: this.plugNumber,
                plugId: this.plugId,
                grantedPermission: this.checked,
                deviceId: this.deviceId
              })
          }
        }

      })
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
